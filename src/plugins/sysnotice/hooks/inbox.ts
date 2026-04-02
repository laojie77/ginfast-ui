import { ref } from 'vue';
import type { SysNoticeInboxData } from '../api/sysnotice';
import {
    getInboxList,
    getInboxDetail as getInboxDetailAPI,
    markRead,
    markAllRead,
    getUnreadCount
} from '../api/sysnotice';

export const useInboxHook = () => {
    const dataList = ref<SysNoticeInboxData[]>([]);
    const loading = ref<boolean>(false);
    const total = ref<number>(0);
    const unreadCount = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
    const searchParams = ref<any>({});

    const fetchInboxList = async (params?: any) => {
        loading.value = true;
        try {
            if (params?.pageNum !== undefined) currentPage.value = params.pageNum;
            if (params?.pageSize !== undefined) pageSize.value = params.pageSize;
            if (params) searchParams.value = { ...searchParams.value, ...params };

            const requestParams = { pageNum: currentPage.value, pageSize: pageSize.value, ...searchParams.value };
            const response = await getInboxList(requestParams);

            dataList.value = response.data.list || [];
            total.value = response.data.total || 0;
            unreadCount.value = response.data.unreadCount || 0;
        } finally {
            loading.value = false;
        }
    };

    const markAsRead = async (noticeId: number) => {
        await markRead(noticeId);
        const item = dataList.value.find((item: SysNoticeInboxData) => item.noticeId === noticeId);
        if (item) item.readStatus = 1;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
    };

    const markAllAsRead = async () => {
        const response = await markAllRead();
        unreadCount.value = 0;
        dataList.value.forEach((item: SysNoticeInboxData) => item.readStatus = 1);
        return response;
    };

    const getInboxDetail = async (id: number): Promise<any> => {
        const response = await getInboxDetailAPI(id);
        return response;
    };

    const fetchUnreadCount = async () => {
        const response = await getUnreadCount();
        unreadCount.value = response.data.count || 0;
    };

    const resetSearchParams = () => {
        searchParams.value = {};
        currentPage.value = 1;
    };

    return {
        dataList,
        loading,
        total,
        unreadCount,
        currentPage,
        pageSize,
        searchParams,
        fetchInboxList,
        markAsRead,
        markAllAsRead,
        getInboxDetail,
        fetchUnreadCount,
        resetSearchParams
    };
};
