import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils.ts";

import { BaseResult } from "@/api/types.ts";


export interface SysNoticeTarget {
    targetType: number; // 1:全体 2:用户 3:部门 4:角色
    targetId?: number;
    includeChildren?: boolean;
}

export interface SysNoticeData {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string; // 通知标题
    content: string; // 通知内容
    type: number; // 通知类型
    level: string; // 通知等级
    publisherId: number; // 发布人ID
    publisher?: any;
    publishStatus: number; // 发布状态 0:草稿 1:已发布 -1:已撤回
    publishTime: string; // 发布时间
    revokeTime: string; // 撤回时间
    tenantId: number;
    createBy: number;
    targets?: SysNoticeTarget[];
    recipientCount?: number;
    unreadCount?: number;
    publishNow?: boolean;
}

export interface SysNoticeInboxData {
    id: number;
    noticeId: number;
    userId: number;
    readStatus: number; // 0:未读 1:已读
    readTime: string;
    createdAt: string;
    notice: SysNoticeData;
}

export type SysNoticeListResult = BaseResult<{
    list: SysNoticeData[];
    total: number;
}>;

export interface SysNoticeListParams {
    pageNum: number;
    pageSize: number;
    id?: number; // Id
    createdAt?: string; // CreatedAt
    updatedAt?: string; // UpdatedAt
    deletedAt?: string; // DeletedAt
    title?: string; // 通知标题
    content?: string; // 通知内容
    type?: number; // 通知类型
    level?: string; // 通知等级
    publisherId?: number; // 发布人ID
    publishStatus?: number; // 发布状态
    publishTime?: string; // 发布时间
    revokeTime?: string; // 撤回时间
    tenantId?: number; // 租户ID
    createBy?: number; // 创建人ID
}


export type SysNoticeResult = BaseResult<SysNoticeData>;

export const getSysNoticeList = (params: SysNoticeListParams) => {
    return http.request<SysNoticeListResult>("get", baseUrlApi("plugins/sysnotice/sysnotice/list"), { params });
};

export const createSysNotice = (data: Omit<SysNoticeData, 'id'>) => {
    return http.request<SysNoticeData>("post", baseUrlApi("plugins/sysnotice/sysnotice/add"), { data });
};

export const updateSysNotice= (data: Partial<SysNoticeData>) => {
    return http.request<SysNoticeData>("put", baseUrlApi(`plugins/sysnotice/sysnotice/edit`), { data });
};

export const deleteSysNotice = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/sysnotice/sysnotice/delete`), { data: { id } });
};


export const getSysNotice = (id: number) => {
    return http.request<SysNoticeResult>("get", baseUrlApi(`plugins/sysnotice/sysnotice/${id}`));
};

export const publishSysNotice = (id: number) => {
    return http.request<SysNoticeResult>("post", baseUrlApi("plugins/sysnotice/sysnotice/publish"), { data: { id } });
};

export const revokeSysNotice = (id: number) => {
    return http.request<SysNoticeResult>("post", baseUrlApi("plugins/sysnotice/sysnotice/revoke"), { data: { id } });
};

export const getInboxList = (params: any) => {
    return http.request<any>("get", baseUrlApi("plugins/sysnotice/sysnotice/inbox/list"), { params });
};

export const getInboxDetail = (id: number) => {
    return http.request<any>("get", baseUrlApi(`plugins/sysnotice/sysnotice/inbox/${id}`));
};

export const markRead = (id: number) => {
    return http.request<BaseResult>("post", baseUrlApi("plugins/sysnotice/sysnotice/inbox/read"), { data: { id } });
};

export const markAllRead = () => {
    return http.request<BaseResult>("post", baseUrlApi("plugins/sysnotice/sysnotice/inbox/readAll"));
};

export const getUnreadCount = () => {
    return http.request<BaseResult<{ count: number }>>("get", baseUrlApi("plugins/sysnotice/sysnotice/inbox/unreadCount"));
};
