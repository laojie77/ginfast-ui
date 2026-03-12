import { ref, computed } from 'vue';
import type { SysChannelCompanyData, SysChannelCompanyListParams, SysChannelCompanyListResult, SysChannelCompanyResult } from '../api/syschannelcompany';
import {
    getSysChannelCompanyList,
    createSysChannelCompany,
    updateSysChannelCompany,
    deleteSysChannelCompany,
    getSysChannelCompany
} from '../api/syschannelcompany';

export const useSysChannelCompanyPluginHook = () => {
    // State
    const dataList = ref<SysChannelCompanyData[]>([]);
    const loading = ref<boolean>(false);
    const total = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
    const searchParams = ref<Partial<SysChannelCompanyListParams>>({});

    // Computed
    const getDataList = computed(() => dataList.value);
    const isLoading = computed(() => loading.value);
    const getTotal = computed(() => total.value);
    const getCurrentPage = computed(() => currentPage.value);
    const getPageSize = computed(() => pageSize.value);
    const getSearchParams = computed(() => searchParams.value);

    // Actions
    const fetchDataList = async (params?: Partial<SysChannelCompanyListParams>) => {
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
            const requestParams: SysChannelCompanyListParams = {
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                ...searchParams.value
            };

            const response: SysChannelCompanyListResult = await getSysChannelCompanyList(requestParams);

            // 根据返回的数据结构处理
            if (response?.data?.list && Array.isArray(response.data.list)) {
                dataList.value = response.data.list;
                total.value = response.data.total || 0;
            } else {
                // 如果没有数据或格式不正确，清空列表
                dataList.value = [];
                total.value = 0;
            }
        } finally {
            loading.value = false;
        }
    };

    const createData = async (data: Omit<SysChannelCompanyData, 'id'>) => {
        try {
            const response = await createSysChannelCompany(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const updateData = async (data: Partial<SysChannelCompanyData>) => {
        try {
            const response = await updateSysChannelCompany(data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const deleteData = async (id: number) => {
        try {
            await deleteSysChannelCompany(id);
            dataList.value = dataList.value.filter((item: SysChannelCompanyData) => item.id !== id);
            // 减少总数
            total.value = Math.max(0, total.value - 1);
        } catch (error) {
            throw error;
        }
    };

    // 根据ID获取用户详情
    const getDetail = async (id: number) : Promise<SysChannelCompanyResult> => {
        try {
            const response = await getSysChannelCompany(id);
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