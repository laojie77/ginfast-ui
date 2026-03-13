<template>
 <div class="snow-page">
    <div class="snow-inner">
        <a-card :loading="loading" :bordered="false">
            <a-form :model="searchForm" :layout="layoutMode.layout" label-align="left" auto-label-width>
                <a-row :gutter="16">
                  <a-col :span="isMobile ? 24 : 6">
                    <a-form-item field="hiddenName" label="渠道名称">
                      <a-input-search v-model="searchForm.hiddenName" placeholder="请输入名称搜索" @search="handleSearch" allow-clear />
                    </a-form-item>
                  </a-col>
<!--                    <a-col :span="isMobile ? 24 : 8">-->
<!--                        &lt;!&ndash; 公司平台选择框查询（radio/select/checkbox统一使用select） &ndash;&gt;-->
<!--                        <a-form-item field="tenantId" label="公司平台">-->
<!--                            <a-select v-model="searchForm.tenantId" placeholder="请选择公司平台" allow-clear>-->
<!--                            </a-select>-->
<!--                        </a-form-item>-->
<!--                    </a-col>-->
<!--                    <a-col :span="isMobile ? 24 : 8">-->
<!--                        &lt;!&ndash; 城市选择框查询（radio/select/checkbox统一使用select） &ndash;&gt;-->
<!--                        <a-form-item field="city" label="城市">-->
<!--                            <a-select v-model="searchForm.city" placeholder="请选择城市" allow-clear>-->
<!--                                <a-option v-for="item in cityOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>-->
<!--                            </a-select>-->
<!--                        </a-form-item>-->
<!--                    </a-col>-->
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-space wrap>
                            <a-button type="primary" @click="handleSearch">查询</a-button>
                            <a-button @click="handleReset">重置</a-button>
                        </a-space>
                    </a-col>
                </a-row>
            </a-form>

            <a-table :data="dataList" :loading="loading" :pagination="paginationConfig"
                :bordered="{ wrapper: true, cell: true }" @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange">
                <template #columns>
<!--                    <a-table-column title="Id" data-index="id"  :width="150"  ellipsis tooltip/>-->
                    <a-table-column title="渠道名称" data-index="hiddenName"  :width="150"  ellipsis tooltip/>
<!--                    <a-table-column title="公司" data-index="tenantId"  :width="150"  ellipsis tooltip/>-->
                    <a-table-column title="城市" data-index="city"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="优质率" data-index="rate"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="总进件数" data-index="quantity"  :width="150"  ellipsis tooltip/>
                  <a-table-column title="回传" data-index="isStar" :width="100" align="center">
                    <template #cell="{ record }">
                      <a-tag bordered size="small" :color="record.isStar === 1 ? 'arcoblue' : 'red'">
                        {{ messageTypeOption[record.isStar]?.name }}
                      </a-tag>
                    </template>
                  </a-table-column>
<!--                    <a-table-column title="操作" :width="200">-->
<!--                        <template #cell="{ record }">-->
<!--                            <a-space>-->
<!--                                <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syschannelcompanysyschannelcompany:edit']">-->
<!--                                    编辑-->
<!--                                </a-button>-->
<!--                                <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">-->
<!--                                    <a-button size="small" status="danger" v-hasPerm="['plugins:syschannelcompanysyschannelcompany:delete']">-->
<!--                                        删除-->
<!--                                    </a-button>-->
<!--                                </a-popconfirm>-->
<!--                            </a-space>-->
<!--                        </template>-->
<!--                    </a-table-column>-->
                </template>
            </a-table>

        </a-card>

        <!-- 编辑/创建弹窗 -->
        <a-modal v-model:visible="modalVisible" :title="editingData.id ? '编辑数据' : '新增数据'" :on-before-ok="handleSave"
            @cancel="handleCancel" :width="layoutMode.width">
            <a-form :model="editingData" :rules="rules" ref="formRef" :layout="layoutMode.layout">
                <a-form-item field="city" label="城市">
                    <a-select v-model="editingData.city" placeholder="请选择城市">
                        <a-option v-for="item in cityOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="isStar" label="回传">
                    <a-radio-group v-model="editingData.isStar">
                        <a-radio v-for="item in messageTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="fieldMappings" label="字段映射配置"><a-input v-model="editingData.fieldMappings" placeholder="请输入字段映射配置" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</div>  
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useSysChannelCompanyPluginHook } from '../../hooks/syschannelcompany';
import type { SysChannelCompanyData } from '../../api/syschannelcompany';
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
const { isMobile } = useDevicesSize();

// 弹窗布局配置
const layoutMode = computed(() => {
  let info = {
    mobile: {
      width: "95%",
      layout: "vertical"
    },
    desktop: {
      width: "40%",
      layout: "horizontal"
    }
  };
  return isMobile.value ? info.mobile : info.desktop;
});

const cityOption = ref(dictFilter("city"));
const messageTypeOption = ref(dictFilter("status"));
const isStarOption = ref(dictFilter("isStatus"));
const {
    dataList,
    loading,
    total,
    currentPage,
    pageSize,
    fetchDataList,
    createData,
    updateData,
    resetSearchParams
} = useSysChannelCompanyPluginHook();

const modalVisible = ref(false);
const formRef = ref();

// 搜索表单
const searchForm = reactive({
    channelId: undefined,
    tenantId: undefined,
    city: '',
  hiddenName: '',
});

const editingData = reactive<Partial<SysChannelCompanyData>>({
    id: undefined,
    channelId: undefined,
    city: undefined,
    rate: undefined,
    quantity: undefined,
    isStar: undefined,
    fieldMappings: undefined,
});

const rules = {
    channelId: [{ required: true, message: '渠道ID不能为空' }],
    city: [{ required: true, message: '城市不能为空' }],
    isStar: [{ required: true, message: '是否回传不能为空' }],
    fieldMappings: [{ required: true, message: '字段映射配置不能为空' }],
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
    if (searchForm.channelId) {
        params.channelId = searchForm.channelId;
    }
    if (searchForm.tenantId) {
        params.tenantId = searchForm.tenantId;
    }
    if (searchForm.city) {
        params.city = searchForm.city;
    }
    if (searchForm.hiddenName) {
        params.hiddenName = searchForm.hiddenName;
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
    searchForm.channelId = undefined;
    searchForm.tenantId = undefined;
    searchForm.city = '';
    searchForm.hiddenName = '';
    resetSearchParams();
    loadData(1);
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
