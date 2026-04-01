import { ref, computed } from 'vue';
import type { SysNoticeData, SysNoticeListParams, SysNoticeListResult, SysNoticeResult } from '../api/sysnotice.ts';
import {
    getSysNoticeList,
    createSysNotice,
    updateSysNotice,
    deleteSysNotice,
    getSysNotice,
    publishSysNotice,
    revokeSysNotice
} from '../api/sysnotice.ts';

export const useSysNoticePluginHook = () => {
    // State
    const dataList = ref<SysNoticeData[]>([]);
    const loading = ref<boolean>(false);
    const total = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
    const searchParams = ref<Partial<SysNoticeListParams>>({});

    // Computed
    const getDataList = computed(() => dataList.value);
    const isLoading = computed(() => loading.value);
    const getTotal = computed(() => total.value);
    const getCurrentPage = computed(() => currentPage.value);
    const getPageSize = computed(() => pageSize.value);
    const getSearchParams = computed(() => searchParams.value);

    // Actions
    const fetchDataList = async (params?: Partial<SysNoticeListParams>) => {
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
            const requestParams: SysNoticeListParams = {
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                ...searchParams.value
            };

            const response: SysNoticeListResult = await getSysNoticeList(requestParams);

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

    const createData = async (data: Omit<SysNoticeData, 'id'>) => {
        try {
            const response = await createSysNotice(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const updateData = async (data: Partial<SysNoticeData>) => {
        try {
            const response = await updateSysNotice(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const deleteData = async (id: number) => {
        try {
            await deleteSysNotice(id);
            dataList.value = dataList.value.filter((item: SysNoticeData) => item.id !== id);
            // 减少总数
            total.value = Math.max(0, total.value - 1);
        } catch (error) {
            throw error;
        }
    };

    // 根据ID获取用户详情
    const getDetail = async (id: number) : Promise<SysNoticeResult> => {
        try {
            const response = await getSysNotice(id);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    const publishData = async (id: number) => {
        try {
            const response = await publishSysNotice(id);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const revokeData = async (id: number) => {
        try {
            const response = await revokeSysNotice(id);
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
        publishData,
        revokeData,
        resetSearchParams,
        getDetail
    };
};
