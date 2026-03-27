<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false">
        <a-space wrap>
          <a-input v-model="searchForm.customerNum" placeholder="请输入客户编号" allow-clear style="width: 240px" />
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
          <a-input v-model="searchForm.data" placeholder="请输入跟进内容" allow-clear style="width: 240px" />
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleCreate" v-hasPerm="['plugins:syscustomertracessyscustomertraces:add']">
            <template #icon>
              <icon-plus />
            </template>
            <span>新增数据</span>
          </a-button>
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
            <a-table-column title="客户编号" data-index="customerNum" :width="200" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.customerNum || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="所属部门" :width="160" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getRecordDepartmentName(record) || "-" }}
              </template>
            </a-table-column>
            <a-table-column title="员工" data-index="userName" :width="140" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getRecordUserName(record) }}
              </template>
            </a-table-column>
            <a-table-column title="跟进内容" data-index="data" :width="260" ellipsis tooltip />
            <a-table-column title="创建时间" data-index="createdAt" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.createdAt ? formatTime(record.createdAt) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="200" fixed="right">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syscustomertracessyscustomertraces:edit']">
                    编辑
                  </a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="['plugins:syscustomertracessyscustomertraces:delete']">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>

      <a-modal
        v-model:visible="modalVisible"
        :title="editingData.id ? '编辑数据' : '新增数据'"
        :on-before-ok="handleSave"
        @cancel="handleCancel"
      >
        <a-form ref="formRef" :model="editingData" :rules="rules"> </a-form>
      </a-modal>
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
import { useSysCustomerTracesPluginHook } from "../../hooks/syscustomertraces";
import type { SysCustomerTracesData } from "../../api/syscustomertraces";

const userInfo = getLocalStorage<any>(UserInfoKey);

const {
  followerOptions,
  cascaderOptions,
  departmentTreeLoaded,
  loadDepartmentTree,
  loadFollowerOptionsForSearch,
  getDepartmentName
} = useCustomerDepartmentScope(userInfo);

const {
  dataList,
  loading,
  total,
  currentPage,
  pageSize,
  fetchDataList,
  createData,
  updateData,
  deleteData,
  getDetail,
  resetSearchParams
} = useSysCustomerTracesPluginHook();

const modalVisible = ref(false);
const formRef = ref();

const searchForm = reactive({
  customerNum: "",
  deptId: undefined as number | number[] | undefined,
  userId: undefined as number | undefined,
  data: ""
});

const editingData = reactive<Partial<SysCustomerTracesData>>({
  id: undefined,
  customerId: undefined,
  userId: undefined,
  data: undefined
});

const rules = {};

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

const getRecordUserName = (record: SysCustomerTracesData) => {
  return record.userName || followerMap.value.get(Number(record.userId))?.name || String(record.userId || "-");
};

const getRecordDepartmentName = (record: SysCustomerTracesData) => {
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

  if (searchForm.customerNum.trim()) {
    params.customerNum = searchForm.customerNum.trim();
  }
  if (searchForm.userId) {
    params.userId = searchForm.userId;
  }
  if (searchForm.data) {
    params.data = searchForm.data;
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
  searchForm.customerNum = "";
  searchForm.deptId = undefined;
  searchForm.userId = undefined;
  searchForm.data = "";
  resetSearchParams();
  loadData(1);
};

const handleCreate = () => {
  Object.assign(editingData, {
    id: undefined,
    customerId: undefined,
    userId: undefined,
    data: undefined
  });
  modalVisible.value = true;
};

const handleEdit = async (record: SysCustomerTracesData) => {
  const detail = await getDetail(record.id);
  Object.assign(editingData, detail.data);
  modalVisible.value = true;
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
