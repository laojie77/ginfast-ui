import { computed, ref } from 'vue';

import type {
  SysCustomerExportTasksData,
  SysCustomerExportTasksListParams,
  SysCustomerExportTasksListResult,
} from '../api/syscustomerexporttasks';
import { getSysCustomerExportTasksList } from '../api/syscustomerexporttasks';

export const useSysCustomerExportTasksPluginHook = () => {
  const dataList = ref<SysCustomerExportTasksData[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const searchParams = ref<Partial<SysCustomerExportTasksListParams>>({});

  const getDataList = computed(() => dataList.value);
  const isLoading = computed(() => loading.value);
  const getTotal = computed(() => total.value);
  const getCurrentPage = computed(() => currentPage.value);
  const getPageSize = computed(() => pageSize.value);
  const getSearchParams = computed(() => searchParams.value);

  const fetchDataList = async (params?: Partial<SysCustomerExportTasksListParams>) => {
    loading.value = true;
    try {
      if (params?.pageNum !== undefined) {
        currentPage.value = params.pageNum;
      }
      if (params?.pageSize !== undefined) {
        pageSize.value = params.pageSize;
      }
      if (params) {
        searchParams.value = { ...searchParams.value, ...params };
      }

      const requestParams: SysCustomerExportTasksListParams = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        ...searchParams.value,
      };

      const response: SysCustomerExportTasksListResult = await getSysCustomerExportTasksList(requestParams);
      dataList.value = Array.isArray(response.data.list) ? response.data.list : [];
      total.value = response.data.total || 0;
    } finally {
      loading.value = false;
    }
  };

  const resetSearchParams = () => {
    searchParams.value = {};
    currentPage.value = 1;
  };

  return {
    dataList,
    loading,
    total,
    currentPage,
    pageSize,
    searchParams,
    getDataList,
    isLoading,
    getTotal,
    getCurrentPage,
    getPageSize,
    getSearchParams,
    fetchDataList,
    resetSearchParams,
  };
};
