<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false">
        <a-space wrap>
          <a-cascader
            v-model="searchForm.deptId"
            :options="cascaderOptions"
            placeholder="请选择部门"
            check-strictly
            allow-clear
            style="width: 240px"
          />
          <a-select v-model="searchForm.userId" placeholder="请选择员工" allow-clear style="width: 240px">
            <a-option v-for="item in followerOptions" :key="item.value" :value="Number(item.value)">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-input v-model="searchForm.customer_id" placeholder="请输入客户编号" allow-clear style="width: 240px" />
          <a-input v-model="searchForm.mobile" placeholder="请输入电话" allow-clear style="width: 240px" />
          <a-select v-model="searchForm.status" placeholder="请选择通话状态" allow-clear style="width: 240px">
            <a-option v-for="item in statusOption" :key="item.value" :value="Number(item.value)">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-select v-model="searchForm.type" placeholder="请选择通话类型" allow-clear style="width: 240px">
            <a-option v-for="item in typeOption" :key="item.value" :value="Number(item.value)">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-date-picker v-model="searchForm.createdAt" placeholder="请选择创建时间" style="width: 240px" />
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>

        <a-table
          :data="dataList"
          :loading="loading"
          :pagination="paginationConfig"
          row-key="id"
          :bordered="{ wrapper: true, cell: true }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #columns>
            <a-table-column title="ID" data-index="id" :width="90" ellipsis tooltip />
            <a-table-column title="所属部门" :width="160" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getRecordDepartmentName(record) || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="员工" data-index="userName" :width="140" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.userName || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="客户编号" data-index="customer_id" :width="200" ellipsis tooltip />
            <a-table-column title="电话" data-index="mobile" :width="140" ellipsis tooltip />
            <a-table-column title="通话状态" data-index="status" :width="140" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getOptionName(statusOption, record.status) || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="通话类型" data-index="type" :width="140" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getOptionName(typeOption, record.type) || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="通话时长" data-index="duration" :width="120" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.duration != null ? `${record.duration}秒` : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="开始时间" data-index="startTime" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.startTime ? formatTime(record.startTime) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="结束时间" data-index="endTime" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.endTime ? formatTime(record.endTime) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="录音地址" data-index="vdieo" :width="220" ellipsis tooltip />
            <a-table-column title="创建时间" data-index="createdAt" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.createdAt ? formatTime(record.createdAt) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="200" fixed="right">
              <template #cell="{ record }">
                <a-space>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="['plugins:syscallrecordsyscallrecord:delete']">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { formatTime } from "@/globals";
import { UserInfoKey } from "@/utils/auth";
import { getLocalStorage } from "@/utils/app";
import { useCustomerDepartmentScope } from "@/plugins/syscustomer/hooks/department";
import { useSysCallRecordPluginHook } from "../../hooks/syscallrecord";
import type { SysCallRecordData } from "../../api/syscallrecord";

const userInfo = getLocalStorage<any>(UserInfoKey);
const statusOption = ref<Array<{ value: number | string; name: string }>>(dictFilter("callStatus"));
const typeOption = ref([
  { value: 1, name: "呼出/拨号" },
  { value: 2, name: "呼入/接听" }
]);

const {
  followerOptions,
  cascaderOptions,
  departmentTreeLoaded,
  loadDepartmentTree,
  loadFollowerOptionsForSearch,
  getDepartmentName
} = useCustomerDepartmentScope(userInfo);

const { dataList, loading, total, currentPage, pageSize, fetchDataList, createData, updateData, deleteData, resetSearchParams } =
  useSysCallRecordPluginHook();

const modalVisible = ref(false);
const formRef = ref();

const searchForm = reactive({
  deptId: undefined as number | number[] | undefined,
  userId: undefined as number | undefined,
  customer_id: "",
  mobile: "",
  status: undefined as number | undefined,
  type: undefined as number | undefined,
  createdAt: undefined as string | undefined
});

const editingData = reactive<Partial<SysCallRecordData>>({
  id: undefined,
  userId: undefined,
  userName: undefined,
  customer_id: undefined,
  mobile: undefined,
  status: undefined,
  type: undefined,
  startTime: undefined,
  endTime: undefined,
  vdieo: undefined,
  duration: undefined,
  version: undefined
});

const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50]
}));

const followerMap = computed(
  () =>
    new Map(
      followerOptions.value.map(item => [
        Number(item.value),
        { name: item.name, deptId: item.deptId }
      ])
    )
);

const resolveLeafDepartmentId = (deptId: number | number[] | undefined) => {
  if (Array.isArray(deptId)) {
    return deptId.length > 0 ? deptId[deptId.length - 1] : undefined;
  }
  return deptId;
};

const getOptionName = (options: Array<{ value: number | string; name: string }>, value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return options.find(item => Number(item.value) === Number(value))?.name || "";
};

const getRecordDepartmentName = (record: SysCallRecordData) => {
  const deptId = followerMap.value.get(Number(record.userId))?.deptId;
  return deptId ? getDepartmentName(deptId) : "";
};

const validateSearchForm = () => {
  if (resolveLeafDepartmentId(searchForm.deptId) && !searchForm.userId) {
    Message.warning("选择部门后请继续选择员工");
    return false;
  }
  return true;
};

const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params: Record<string, unknown> = {
    pageNum,
    pageSize: pageSizeVal
  };

  if (searchForm.userId) {
    params.userId = searchForm.userId;
  }
  if (searchForm.customer_id) {
    params.customer_id = searchForm.customer_id;
  }
  if (searchForm.mobile) {
    params.mobile = searchForm.mobile;
  }
  if (searchForm.status !== undefined) {
    params.status = searchForm.status;
  }
  if (searchForm.type !== undefined) {
    params.type = searchForm.type;
  }
  if (searchForm.createdAt) {
    params.createdAt = searchForm.createdAt;
  }

  await fetchDataList(params);
};

watch(
  [() => searchForm.deptId, () => departmentTreeLoaded.value],
  async ([newDeptId, isDepartmentTreeLoaded]) => {
    if (!isDepartmentTreeLoaded) {
      return;
    }

    await loadFollowerOptionsForSearch(newDeptId);

    if (searchForm.userId && !followerOptions.value.some(item => Number(item.value) === Number(searchForm.userId))) {
      searchForm.userId = undefined;
    }
  },
  { immediate: true }
);

const handlePageChange = (page: number) => {
  loadData(page, pageSize.value);
};

const handlePageSizeChange = (size: number) => {
  loadData(1, size);
};

const handleSearch = () => {
  if (!validateSearchForm()) {
    return;
  }
  loadData(1);
};

const handleReset = () => {
  searchForm.deptId = undefined;
  searchForm.userId = undefined;
  searchForm.customer_id = "";
  searchForm.mobile = "";
  searchForm.status = undefined;
  searchForm.type = undefined;
  searchForm.createdAt = undefined;
  resetSearchParams();
  loadData(1);
};

const handleDelete = async (id: number) => {
  try {
    await deleteData(id);
    await loadData();
  } catch (error) {
    console.error("删除失败:", error);
  }
};

const handleSave = async () => {
  const isValid = await formRef.value?.validate();
  if (isValid) return false;

  try {
    const dataToSave = JSON.parse(JSON.stringify(editingData));
    if (editingData.id) {
      await updateData(dataToSave);
    } else {
      await createData(dataToSave);
    }
    await loadData();
  } catch (error) {
    console.error("保存失败:", error);
    return false;
  }

  return true;
};

const handleCancel = () => {
  modalVisible.value = false;
};

onMounted(async () => {
  await loadDepartmentTree();
  await loadData();
});
</script>

<style scoped lang="scss"></style>
