import { ref, computed } from 'vue';
import type { SysCallRecordData, SysCallRecordListParams, SysCallRecordListResult, SysCallRecordResult } from '../api/syscallrecord';
import {
    getSysCallRecordList,
    createSysCallRecord,
    updateSysCallRecord,
    deleteSysCallRecord,
    getSysCallRecord
} from '../api/syscallrecord';

export const useSysCallRecordPluginHook = () => {
    // State
    const dataList = ref<SysCallRecordData[]>([]);
    const loading = ref<boolean>(false);
    const total = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
    const searchParams = ref<Partial<SysCallRecordListParams>>({});

    // Computed
    const getDataList = computed(() => dataList.value);
    const isLoading = computed(() => loading.value);
    const getTotal = computed(() => total.value);
    const getCurrentPage = computed(() => currentPage.value);
    const getPageSize = computed(() => pageSize.value);
    const getSearchParams = computed(() => searchParams.value);

    // Actions
    const fetchDataList = async (params?: Partial<SysCallRecordListParams>) => {
        loading.value = true;
        try {
            // 更新分页参数和搜索条件
            if (params?.pageNum !== undefined) {
                currentPage.value = params.pageNum;
            }
            if (params?.pageSize !== undefined) {
                pageSize.value = params.pageSize;
            }
            
            // 更新搜索参数
            if (params) {
                searchParams.value = { ...searchParams.value, ...params };
            }

            // 构造请求参数
            const requestParams: SysCallRecordListParams = {
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                ...searchParams.value
            };

            const response: SysCallRecordListResult = await getSysCallRecordList(requestParams);

            // 根据返回的数据结构处理
            if (Array.isArray(response.data.list)) {
                // 如果返回的是数组格式（旧格式）
                dataList.value = response.data.list || [];
                total.value = response.data.total || 0;
            }
        } finally {
            loading.value = false;
        }
    };

    const createData = async (data: Omit<SysCallRecordData, 'id'>) => {
        try {
            const response = await createSysCallRecord(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const updateData = async (data: Partial<SysCallRecordData>) => {
        try {
            const response = await updateSysCallRecord(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const deleteData = async (id: number) => {
        try {
            await deleteSysCallRecord(id);
            dataList.value = dataList.value.filter((item: SysCallRecordData) => item.id !== id);
            // 减少总数
            total.value = Math.max(0, total.value - 1);
        } catch (error) {
            throw error;
        }
    };

    // 根据ID获取用户详情
    const getDetail = async (id: number) : Promise<SysCallRecordResult> => {
        try {
            const response = await getSysCallRecord(id);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    // 重置搜索条件
    const resetSearchParams = () => {
        searchParams.value = {};
        currentPage.value = 1;
    };

    return {
        // State
        dataList,
        loading,
        total,
        currentPage,
        pageSize,
        searchParams,

        // Computed
        getDataList,
        isLoading,
        getTotal,
        getCurrentPage,
        getPageSize,
        getSearchParams,

        // Actions
        fetchDataList,
        createData,
        updateData,
        deleteData,
        resetSearchParams,
        getDetail
    };
};