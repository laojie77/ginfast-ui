<template>
 <div class="snow-page">
    <div class="snow-inner">
        <a-card :loading="loading" :bordered="false">
                <a-space wrap>
                    <!-- 查询表单-->
                    <!-- 客户精确查询 -->
                    <a-input-number v-model="searchForm.customerId" placeholder="请输入客户" style="width: 240px;" />
                    <!-- 操作用户精确查询 -->
                    <a-input-number v-model="searchForm.userId" placeholder="请输入操作用户" style="width: 240px;" />
                    <!-- 跟进内容精确查询 -->
                    <a-input v-model="searchForm.data" placeholder="请输入跟进内容" style="width: 240px;" />
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                    <a-button @click="handleReset">重置</a-button>
                    <a-button type="primary" @click="handleCreate" v-hasPerm="['plugins:syscustomertracessyscustomertraces:add']">
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
                    <a-table-column title="客户" data-index="customerId"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="操作用户" data-index="userId"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="跟进内容" data-index="data"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="操作" :width="200">
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
import { useSysCustomerTracesPluginHook } from '../../hooks/syscustomertraces';
import type { SysCustomerTracesData } from '../../api/syscustomertraces';
import { formatTime } from '@/globals';
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

// 搜索表单
const searchForm = reactive({
    customerId: undefined,
    userId: undefined,
    data: '',
});

const editingData = reactive<Partial<SysCustomerTracesData>>({
    id: undefined,
    customerId: undefined,
    userId: undefined,
    data: undefined,
});

const rules = {
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
    if (searchForm.customerId) {
        params.customerId = searchForm.customerId;
    }
    if (searchForm.userId) {
        params.userId = searchForm.userId;
    }
    if (searchForm.data) {
        params.data = searchForm.data;
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
    searchForm.customerId = undefined;
    searchForm.userId = undefined;
    searchForm.data = '';
    resetSearchParams();
    loadData(1);
};

// 新增数据
const handleCreate = () => {
    // 重置表单数据
    Object.assign(editingData, {
        id: undefined,
        customerId: undefined,
        userId: undefined,
        data: undefined,
    });
    modalVisible.value = true;
};

// 编辑数据
const handleEdit = async (record: SysCustomerTracesData) => {
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