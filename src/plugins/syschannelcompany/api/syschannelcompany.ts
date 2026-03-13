import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";


export interface SysChannelCompanyData {
    id: number; // Id
    channelId: number; // 渠道ID
    channelName: string; // 渠道名称
    hiddenName: string; // 渠道隐藏名称
    tenantId: number; // 公司平台
    city: string; // 城市
    rate: number; // 优质率
    quantity: number; // 总进件数
    isStar: number; // 是否回传
    fieldMappings: string; // 字段映射配置
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
    deletedAt: string; // 删除时间
}

export type SysChannelCompanyListResult = BaseResult<{
    list: SysChannelCompanyData[];
    total: number;
}>;

export interface SysChannelCompanyListParams {
    pageNum: number;
    pageSize: number;
    id?: number; // Id
    channelId?: number; // 渠道ID
    tenantId?: number; // 公司平台
    city?: string; // 城市
    rate?: number; // 优质率
    quantity?: number; // 总进件数
    isStar?: number; // 是否回传
    fieldMappings?: string; // 字段映射配置
    createdAt?: string; // 创建时间
    updatedAt?: string; // 更新时间
    deletedAt?: string; // 删除时间
}


export type SysChannelCompanyResult = BaseResult<SysChannelCompanyData>;

export const getSysChannelCompanyList = (params: SysChannelCompanyListParams) => {
    return http.request<SysChannelCompanyListResult>("get", baseUrlApi("plugins/syschannelcompany/syschannelcompany/list"), { params });
};

export const createSysChannelCompany = (data: Omit<SysChannelCompanyData, 'id'>) => {
    return http.request<SysChannelCompanyData>("post", baseUrlApi("plugins/syschannelcompany/syschannelcompany/add"), { data });
};

export const updateSysChannelCompany= (data: Partial<SysChannelCompanyData>) => {
    return http.request<SysChannelCompanyData>("put", baseUrlApi(`plugins/syschannelcompany/syschannelcompany/edit`), { data });
};

export const deleteSysChannelCompany = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/syschannelcompany/syschannelcompany/delete`), { data: { id } });
};


export const getSysChannelCompany = (id: number) => {
    return http.request<SysChannelCompanyResult>("get", baseUrlApi(`plugins/syschannelcompany/syschannelcompany/${id}`));
};
