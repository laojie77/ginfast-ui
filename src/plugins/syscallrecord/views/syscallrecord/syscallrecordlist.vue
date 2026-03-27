<template>
 <div class="snow-page">
    <div class="snow-inner">
        <a-card :loading="loading" :bordered="false">
                <a-space wrap>
                    <!-- 查询表单-->
                    <!-- 业务员id精确查询 -->
                    <a-input-number v-model="searchForm.userId" placeholder="请输入业务员id" style="width: 240px;" />
                    <!-- 电话精确查询 -->
                    <a-input v-model="searchForm.mobile" placeholder="请输入电话" style="width: 240px;" />
                    <!-- 状态:0等待处理,1已完成,2未接听/挂断/拒绝,3待拨号选择框查询（radio/select/checkbox统一使用select） -->
                    <a-select v-model="searchForm.status" placeholder="请选择状态:0等待处理,1已完成,2未接听/挂断/拒绝,3待拨号" style="width: 240px;" allow-clear>
                        <a-option v-for="item in statusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                    </a-select>
                    <!-- 通话类型:1呼出/拨号,2呼入/接听选择框查询（radio/select/checkbox统一使用select） -->
                    <a-select v-model="searchForm.type" placeholder="请选择通话类型:1呼出/拨号,2呼入/接听" style="width: 240px;" allow-clear>
                    </a-select>
                    <!-- CreatedAt精确查询 -->
                    <a-date-picker v-model="searchForm.createdAt" placeholder="请选择CreatedAt" style="width: 240px;" />
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                    <a-button @click="handleReset">重置</a-button>
                    <a-button type="primary" @click="handleCreate" v-hasPerm="['plugins:syscallrecordsyscallrecord:add']">
                        <template #icon>
                            <icon-plus />
                        </template>
                        <span>新增数据</span>
                    </a-button>
                </a-space>

            <a-table :data="dataList" :loading="loading" :pagination="paginationConfig"
                :bordered="{ wrapper: true, cell: true }" @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange">
                <template #columns>
                    <a-table-column title="Id" data-index="id"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="业务员id" data-index="userId"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="业务员姓名" data-index="userName"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="客户姓名" data-index="name"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="电话" data-index="mobile"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="状态:0等待处理,1已完成,2未接听/挂断/拒绝,3待拨号" data-index="status"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="通话类型:1呼出/拨号,2呼入/接听" data-index="type"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="开始时间" data-index="startTime"  :width="150"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ record['startTime'] ? formatTime(record['startTime']) : "" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="结束时间" data-index="endTime"  :width="150"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ record['endTime'] ? formatTime(record['endTime']) : "" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="录音地址" data-index="vdieo"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="通话时长" data-index="duration"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="版本" data-index="version"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="操作" :width="200">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syscallrecordsyscallrecord:edit']">
                                    编辑
                                </a-button>
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

        <!-- 编辑/创建弹窗 -->
        <a-modal v-model:visible="modalVisible" :title="editingData.id ? '编辑数据' : '新增数据'" :on-before-ok="handleSave"
            @cancel="handleCancel">
            <a-form :model="editingData" :rules="rules" ref="formRef">
            </a-form>
        </a-modal>
    </div>
</div>  
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useSysCallRecordPluginHook } from '../../hooks/syscallrecord';
import type { SysCallRecordData } from '../../api/syscallrecord';
import { formatTime } from '@/globals';
const statusOption = ref(dictFilter("callStatus"));
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
} = useSysCallRecordPluginHook();

const modalVisible = ref(false);
const formRef = ref();

// 搜索表单
const searchForm = reactive({
    userId: undefined,
    mobile: '',
    status: undefined,
    type: undefined,
    createdAt: '',
});

const editingData = reactive<Partial<SysCallRecordData>>({
    id: undefined,
    userId: undefined,
    userName: undefined,
    name: undefined,
    mobile: undefined,
    status: undefined,
    type: undefined,
    startTime: undefined,
    endTime: undefined,
    vdieo: undefined,
    duration: undefined,
    version: undefined,
});

const rules = {
    userId: [{ required: true, message: '业务员id不能为空' }],
    mobile: [{ required: true, message: '电话不能为空' }],
};

// 分页配置
const paginationConfig = computed(() => ({
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: [10, 20, 30, 50],
}));

// 获取数据列表
const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
    const params: any = {
        pageNum,
        pageSize: pageSizeVal,
    };
    if (searchForm.userId) {
        params.userId = searchForm.userId;
    }
    if (searchForm.mobile) {
        params.mobile = searchForm.mobile;
    }
    if (searchForm.status) {
        params.status = searchForm.status;
    }
    if (searchForm.type) {
        params.type = searchForm.type;
    }
    if (searchForm.createdAt) {
        params.createdAt = searchForm.createdAt;
    }
    await fetchDataList(params);
};

// 处理分页变化
const handlePageChange = (page: number) => {
    loadData(page, pageSize.value);
};

// 处理页面大小变化
const handlePageSizeChange = (size: number) => {
    loadData(1, size); // 页码重置为1
};

// 搜索处理
const handleSearch = () => {
    loadData(1); // 搜索时重置到第一页
};

// 重置搜索
const handleReset = () => {
    searchForm.userId = undefined;
    searchForm.mobile = '';
    searchForm.status = undefined;
    searchForm.type = undefined;
    searchForm.createdAt = '';
    resetSearchParams();
    loadData(1);
};

// 新增数据
const handleCreate = () => {
    // 重置表单数据
    Object.assign(editingData, {
        id: undefined,
        userId: undefined,
        userName: undefined,
        name: undefined,
        mobile: undefined,
        status: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined,
        vdieo: undefined,
        duration: undefined,
        version: undefined,
    });
    modalVisible.value = true;
};

// 编辑数据
const handleEdit = async (record: SysCallRecordData) => {
    // 获取详情
    const detail = await getDetail(record.id);
    // 赋值给编辑数据
    Object.assign(editingData, detail.data);
    modalVisible.value = true;
};

// 删除数据
const handleDelete = async (id: number) => {
    try {
        await deleteData(id);
        // 重新加载当前页数据
        await loadData();
        // 显示删除成功消息
        // 这里可以使用项目的消息提示机制
    } catch (error) {
        // 显示删除失败消息
        console.error('删除失败:', error);
    }
};

// 保存数据
const handleSave = async () => {
    const isValid = await formRef.value?.validate();
    if (isValid) return false;
    try {
        const dataToSave = JSON.parse(JSON.stringify(editingData));
        if (editingData.id) {
            // 更新数据
            await updateData(dataToSave);
        } else {
            // 创建数据
            await createData(dataToSave);
        }
        // 重新加载数据
        await loadData();
    } catch (error) {
        console.error('保存失败:', error);
        return false;
    }
    return true;
};

// 取消操作
const handleCancel = () => {
    modalVisible.value = false;
};

onMounted(async () => {
    // 初始化加载数据
    await loadData();
})

</script>

<style scoped lang="scss">

</style>