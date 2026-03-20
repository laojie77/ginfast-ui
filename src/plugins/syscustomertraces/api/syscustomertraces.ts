import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";


export interface SysCustomerTracesData {
    id: number; // Id
    customerId: number; // 客户
    userId: number; // 操作用户
    tenantId: number; // 所属平台公司
    data: string; // 跟进内容
    createdAt: string; // CreatedAt
    updatedAt: string; // UpdatedAt
    deletedAt: string; // DeletedAt
    userName?: string; // 用户昵称（查询时返回）
}

export type SysCustomerTracesListResult = BaseResult<{
    list: SysCustomerTracesData[];
    total: number;
}>;

export interface SysCustomerTracesListParams {
    pageNum: number;
    pageSize: number;
    id?: number; // Id
    customerId?: number; // 客户
    userId?: number; // 操作用户
    data?: string; // 跟进内容
    createdAt?: string; // CreatedAt
    updatedAt?: string; // UpdatedAt
    deletedAt?: string; // DeletedAt
}

export interface SysCustomerTracesCreateParams {
    customerId: number; // 客户
    userId?: number; // 操作用户（可选，后端会自动设置）
    data: string; // 跟进内容
}


export type SysCustomerTracesResult = BaseResult<SysCustomerTracesData>;

export const getSysCustomerTracesList = (params: SysCustomerTracesListParams) => {
    return http.request<SysCustomerTracesListResult>("get", baseUrlApi("plugins/syscustomertraces/syscustomertraces/list"), { params });
};

export const createSysCustomerTraces = (data: SysCustomerTracesCreateParams) => {
    return http.request<SysCustomerTracesData>("post", baseUrlApi("plugins/syscustomertraces/syscustomertraces/add"), { data });
};

export const updateSysCustomerTraces= (data: Partial<SysCustomerTracesData>) => {
    return http.request<SysCustomerTracesData>("put", baseUrlApi(`plugins/syscustomertraces/syscustomertraces/edit`), { data });
};

export const deleteSysCustomerTraces = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/syscustomertraces/syscustomertraces/delete`), { data: { id } });
};


export const getSysCustomerTraces = (id: number) => {
    return http.request<SysCustomerTracesResult>("get", baseUrlApi(`plugins/syscustomertraces/syscustomertraces/${id}`));
};
