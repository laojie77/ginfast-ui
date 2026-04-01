<template>
 <div class="snow-page">
    <div class="snow-inner">
        <a-card :loading="loading" :bordered="false">
            <template #title>
                <a-space>
                    <span>我的通知</span>
                    <a-badge :count="unreadCount" :max-count="99" />
                </a-space>
            </template>
            <template #extra>
                <a-button type="primary" @click="handleMarkAllRead" :disabled="unreadCount === 0">全部已读</a-button>
            </template>

            <a-space wrap style="margin-bottom: 16px;">
                <a-input-search v-model="searchForm.title" placeholder="请输入通知标题搜索" style="width: 240px;" @search="handleSearch" allow-clear />
                <a-select v-model="searchForm.type" placeholder="请选择通知类型" style="width: 240px;" allow-clear>
                    <a-option v-for="item in typeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                </a-select>
                <a-select v-model="searchForm.level" placeholder="请选择通知等级" style="width: 240px;" allow-clear>
                    <a-option v-for="item in levelOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>
                </a-select>
                <a-select v-model="searchForm.readStatus" placeholder="请选择阅读状态" style="width: 240px;" allow-clear>
                    <a-option :value="0">未读</a-option>
                    <a-option :value="1">已读</a-option>
                </a-select>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
            </a-space>

            <a-table :data="dataList" :loading="loading" :pagination="paginationConfig"
                :bordered="{ wrapper: true, cell: true }" @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange" :row-class="getRowClass">
                <template #columns>
                    <a-table-column title="通知标题" data-index="notice.title" :width="200" ellipsis tooltip>
                        <template #cell="{ record }">
                            <a-space>
                                <a-badge v-if="record.readStatus === 0" dot />
                                <a-link @click="handleView(record)">{{ record.notice?.title }}</a-link>
                            </a-space>
                        </template>
                    </a-table-column>
                    <a-table-column title="通知类型" :width="120">
                        <template #cell="{ record }">
                            {{ getDictLabel(typeOption, record.notice?.type) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="通知等级" :width="120">
                        <template #cell="{ record }">
                            <a-tag :color="getLevelColor(record.notice?.level)">{{ getDictLabel(levelOption, record.notice?.level) }}</a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="发布人" :width="120">
                        <template #cell="{ record }">
                            {{ record.notice?.publisher?.username || '-' }}
                        </template>
                    </a-table-column>
                    <a-table-column title="发布时间" :width="180">
                        <template #cell="{ record }">
                            {{ record.notice?.publishTime ? formatTime(record.notice.publishTime) : "-" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="阅读状态" data-index="readStatus" :width="100">
                        <template #cell="{ record }">
                            <a-tag v-if="record.readStatus === 0" color="red">未读</a-tag>
                            <a-tag v-else color="green">已读</a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="阅读时间" data-index="readTime" :width="180">
                        <template #cell="{ record }">
                            {{ record.readTime ? formatTime(record.readTime) : "-" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" :width="150">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button size="small" @click="handleView(record)">查看</a-button>
                                <a-button v-if="record.readStatus === 0" size="small" type="primary" @click="handleMarkRead(record.id)">标记已读</a-button>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <!-- 查看详情弹窗 -->
        <a-modal :visible="viewVisible" title="通知详情" :footer="false" width="800px" @update:visible="viewVisible = $event">
            <a-descriptions :column="2" bordered>
                <a-descriptions-item label="通知标题">{{ viewData.notice?.title }}</a-descriptions-item>
                <a-descriptions-item label="通知类型">{{ getDictLabel(typeOption, viewData.notice?.type) }}</a-descriptions-item>
                <a-descriptions-item label="通知等级">
                    <a-tag :color="getLevelColor(viewData.notice?.level)">{{ getDictLabel(levelOption, viewData.notice?.level) }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="发布人">{{ viewData.notice?.publisher?.username || '-' }}</a-descriptions-item>
                <a-descriptions-item label="发布时间">{{ viewData.notice?.publishTime ? formatTime(viewData.notice.publishTime) : '-' }}</a-descriptions-item>
                <a-descriptions-item label="阅读时间">{{ viewData.readTime ? formatTime(viewData.readTime) : '未读' }}</a-descriptions-item>
                <a-descriptions-item label="通知内容" :span="2">
                    <div style="white-space: pre-wrap;">{{ viewData.notice?.content }}</div>
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useInboxHook } from '../../hooks/inbox';
import type { SysNoticeInboxData } from '../../api/sysnotice';
import { formatTime, dictFilter } from '@/globals';
import { Message } from '@arco-design/web-vue';

const typeOption = ref(dictFilter("noticeType"));
const levelOption = ref(dictFilter("noticeLevel"));

const {
    dataList,
    loading,
    total,
    unreadCount,
    currentPage,
    pageSize,
    fetchInboxList,
    markAsRead,
    markAllAsRead,
    getInboxDetail,
    resetSearchParams
} = useInboxHook();

const viewVisible = ref(false);

const searchForm = reactive({
    title: '',
    type: undefined,
    level: '',
    readStatus: undefined,
});

const viewData = ref<Partial<SysNoticeInboxData>>({});

const paginationConfig = computed(() => ({
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: [10, 20, 30, 50],
}));

const getDictLabel = (options: any[], value: any) => {
    const item = options.find(opt => opt.value == value);
    return item?.name || value;
};

const getLevelColor = (level: string) => {
    const colors: any = { high: 'red', medium: 'orange', low: 'blue' };
    return colors[level] || 'gray';
};

const getRowClass = (record: any) => {
    return record.readStatus === 0 ? 'unread-row' : '';
};

const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
    const params: any = { pageNum, pageSize: pageSizeVal };
    if (searchForm.title) params.title = searchForm.title;
    if (searchForm.type !== undefined) params.type = searchForm.type;
    if (searchForm.level) params.level = searchForm.level;
    if (searchForm.readStatus !== undefined) params.readStatus = searchForm.readStatus;
    await fetchInboxList(params);
};

const handlePageChange = (page: number) => loadData(page, pageSize.value);
const handlePageSizeChange = (size: number) => loadData(1, size);
const handleSearch = () => loadData(1);

const handleReset = () => {
    Object.assign(searchForm, { title: '', type: undefined, level: '', readStatus: undefined });
    resetSearchParams();
    loadData(1);
};

const handleView = async (record: SysNoticeInboxData) => {
    const detail = await getInboxDetail(record.id);
    viewData.value = detail.data;
    viewVisible.value = true;
    if (record.readStatus === 0) {
        await handleMarkRead(record.id);
    }
};

const handleMarkRead = async (id: number) => {
    try {
        await markAsRead(id);
        Message.success('已标记为已读');
        await loadData();
    } catch (error) {
        Message.error('操作失败');
    }
};

const handleMarkAllRead = async () => {
    try {
        await markAllAsRead();
        Message.success('全部已读');
        await loadData();
    } catch (error) {
        Message.error('操作失败');
    }
};

onMounted(() => loadData());
</script>

<style scoped lang="scss">
:deep(.unread-row) {
    background-color: #f0f9ff;
}
</style>
