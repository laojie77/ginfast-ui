import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";

export interface SysCallRecordData {
    id: number;
    userId: number;
    userName: string;
    customerId: number;
    customer_id: string;
    mobile: string;
    status: number;
    type: number;
    startTime: string;
    endTime: string;
    vdieo: string;
    duration: number;
    version: string;
    createdAt: string;
    tenantId: number;
}

export type SysCallRecordListResult = BaseResult<{
    list: SysCallRecordData[];
    total: number;
}>;

export interface SysCallRecordListParams {
    pageNum: number;
    pageSize: number;
    id?: number;
    userId?: number;
    userName?: string;
    customer_id?: string;
    mobile?: string;
    status?: number;
    type?: number;
    startTime?: string;
    endTime?: string;
    vdieo?: string;
    duration?: number;
    version?: string;
    createdAt?: string;
    tenantId?: number;
}

export type SysCallRecordResult = BaseResult<SysCallRecordData>;

export const getSysCallRecordList = (params: SysCallRecordListParams) => {
    return http.request<SysCallRecordListResult>("get", baseUrlApi("plugins/syscallrecord/syscallrecord/list"), { params });
};

export const createSysCallRecord = (data: Omit<SysCallRecordData, "id">) => {
    return http.request<SysCallRecordData>("post", baseUrlApi("plugins/syscallrecord/syscallrecord/add"), { data });
};

export const updateSysCallRecord = (data: Partial<SysCallRecordData>) => {
    return http.request<SysCallRecordData>("put", baseUrlApi("plugins/syscallrecord/syscallrecord/edit"), { data });
};

export const deleteSysCallRecord = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi("plugins/syscallrecord/syscallrecord/delete"), { data: { id } });
};

export const getSysCallRecord = (id: number) => {
    return http.request<SysCallRecordResult>("get", baseUrlApi(`plugins/syscallrecord/syscallrecord/${id}`));
};
