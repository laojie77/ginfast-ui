<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false">
        <a-space wrap>
          <a-input v-model="searchForm.userName" placeholder="请输入用户名称/昵称" style="width: 240px" allow-clear />
          <a-select v-model="searchForm.status" placeholder="请选择任务状态" style="width: 240px" allow-clear>
            <a-option v-for="item in statusOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>
          </a-select>
          <a-range-picker v-model="searchForm.createdAtRange" style="width: 240px" @change="handleSearch" />
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>

        <a-table
          :data="dataList"
          :loading="loading"
          :pagination="paginationConfig"
          :bordered="{ wrapper: true, cell: true }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #columns>
            <a-table-column title="任务ID" data-index="id" :width="120" ellipsis tooltip />
            <a-table-column title="用户昵称" data-index="userNickName" :width="160" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.userNickName || '-' }}
              </template>
            </a-table-column>
            <a-table-column title="任务状态" data-index="status" :width="140" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag :color="getTaskStatusColor(record.status)">
                  {{ getTaskStatusText(record.status) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="导出总数" data-index="total" :width="120" ellipsis tooltip />
            <a-table-column title="已处理" data-index="processed" :width="120" ellipsis tooltip />
            <a-table-column title="进度" data-index="progress" :width="120" ellipsis tooltip>
              <template #cell="{ record }">
                {{ `${record.progress || 0}%` }}
              </template>
            </a-table-column>
            <a-table-column title="导出文件" data-index="fileName" :width="220" ellipsis tooltip />
            <a-table-column title="失败原因" data-index="errorMessage" :width="260" ellipsis tooltip />
            <a-table-column title="开始时间" data-index="startedAt" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.startedAt ? formatTime(record.startedAt) : '' }}
              </template>
            </a-table-column>
            <a-table-column title="完成时间" data-index="finishedAt" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.finishedAt ? formatTime(record.finishedAt) : '' }}
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="createdAt" :width="180" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.createdAt ? formatTime(record.createdAt) : '' }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { formatTime } from '@/globals';
import { useSysCustomerExportTasksPluginHook } from '../../hooks/syscustomerexporttasks';

const statusOption = ref(dictFilter('taskStatusAll'));
const { dataList, loading, total, currentPage, pageSize, fetchDataList, resetSearchParams } =
  useSysCustomerExportTasksPluginHook();

const searchForm = reactive<{
  userName?: string;
  status?: string;
  createdAtRange: string[];
}>({
  userName: undefined,
  status: undefined,
  createdAtRange: [],
});

const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50],
}));

const getTaskStatusText = (status?: string) => {
  const matched = statusOption.value.find(item => String(item.value) === String(status));
  if (matched?.name) {
    return matched.name;
  }

  switch (status) {
    case 'queued':
      return '排队中';
    case 'running':
      return '执行中';
    case 'success':
      return '已完成';
    case 'failed':
      return '失败';
    case 'canceled':
      return '已取消';
    default:
      return status || '-';
  }
};

const getTaskStatusColor = (status?: string) => {
  switch (status) {
    case 'queued':
      return 'orange';
    case 'running':
      return 'arcoblue';
    case 'success':
      return 'green';
    case 'failed':
      return 'red';
    case 'canceled':
      return 'gray';
    default:
      return 'gray';
  }
};

const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params: {
    pageNum: number;
    pageSize: number;
    userName?: string;
    status?: string;
    createdAt?: string[];
  } = {
    pageNum,
    pageSize: pageSizeVal,
  };

  if (searchForm.userName) {
    params.userName = searchForm.userName.trim();
  }
  if (searchForm.status) {
    params.status = searchForm.status;
  }
  if (searchForm.createdAtRange.length === 2) {
    params.createdAt = searchForm.createdAtRange;
  }

  await fetchDataList(params);
};

const handlePageChange = (page: number) => {
  loadData(page, pageSize.value);
};

const handlePageSizeChange = (size: number) => {
  loadData(1, size);
};

const handleSearch = () => {
  loadData(1);
};

const handleReset = () => {
  searchForm.userName = undefined;
  searchForm.status = undefined;
  searchForm.createdAtRange = [];
  resetSearchParams();
  loadData(1);
};

onMounted(async () => {
  await loadData();
});
</script>
