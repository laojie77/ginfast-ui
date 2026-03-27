import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";


export interface SysCallRecordData {
    id: number; // Id
    userId: number; // 业务员id
    userName: string; // 业务员姓名
    name: string; // 客户姓名
    mobile: string; // 电话
    status: number; // 状态:0等待处理,1已完成,2未接听/挂断/拒绝,3待拨号
    type: number; // 通话类型:1呼出/拨号,2呼入/接听
    startTime: string; // 开始时间
    endTime: string; // 结束时间
    vdieo: string; // 录音地址
    duration: number; // 通话时长
    version: string; // 版本
    createdAt: string; // CreatedAt
    tenantId: number; // 租户ID字段
}

export type SysCallRecordListResult = BaseResult<{
    list: SysCallRecordData[];
    total: number;
}>;

export interface SysCallRecordListParams {
    pageNum: number;
    pageSize: number;
    id?: number; // Id
    userId?: number; // 业务员id
    userName?: string; // 业务员姓名
    name?: string; // 客户姓名
    mobile?: string; // 电话
    status?: number; // 状态:0等待处理,1已完成,2未接听/挂断/拒绝,3待拨号
    type?: number; // 通话类型:1呼出/拨号,2呼入/接听
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    vdieo?: string; // 录音地址
    duration?: number; // 通话时长
    version?: string; // 版本
    createdAt?: string; // CreatedAt
    tenantId?: number; // 租户ID字段
}


export type SysCallRecordResult = BaseResult<SysCallRecordData>;

export const getSysCallRecordList = (params: SysCallRecordListParams) => {
    return http.request<SysCallRecordListResult>("get", baseUrlApi("plugins/syscallrecord/syscallrecord/list"), { params });
};

export const createSysCallRecord = (data: Omit<SysCallRecordData, 'id'>) => {
    return http.request<SysCallRecordData>("post", baseUrlApi("plugins/syscallrecord/syscallrecord/add"), { data });
};

export const updateSysCallRecord= (data: Partial<SysCallRecordData>) => {
    return http.request<SysCallRecordData>("put", baseUrlApi(`plugins/syscallrecord/syscallrecord/edit`), { data });
};

export const deleteSysCallRecord = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/syscallrecord/syscallrecord/delete`), { data: { id } });
};


export const getSysCallRecord = (id: number) => {
    return http.request<SysCallRecordResult>("get", baseUrlApi(`plugins/syscallrecord/syscallrecord/${id}`));
};