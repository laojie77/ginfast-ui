import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";

export interface SysCustomerTracesData {
  id: number;
  customerId: number;
  customerNum?: string;
  userId: number;
  tenantId: number;
  data: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  userName?: string;
}

export type SysCustomerTracesListResult = BaseResult<{
  list: SysCustomerTracesData[];
  total: number;
}>;

export interface SysCustomerTracesListParams {
  pageNum: number;
  pageSize: number;
  id?: number;
  customerId?: number;
  customerNum?: string;
  userId?: number;
  data?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface SysCustomerTracesCreateParams {
  customerId: number;
  userId?: number;
  data: string;
}

export type SysCustomerTracesResult = BaseResult<SysCustomerTracesData>;

export const getSysCustomerTracesList = (params: SysCustomerTracesListParams) => {
  return http.request<SysCustomerTracesListResult>("get", baseUrlApi("plugins/syscustomertraces/syscustomertraces/list"), { params });
};

export const createSysCustomerTraces = (data: SysCustomerTracesCreateParams) => {
  return http.request<SysCustomerTracesData>("post", baseUrlApi("plugins/syscustomertraces/syscustomertraces/add"), { data });
};

export const updateSysCustomerTraces = (data: Partial<SysCustomerTracesData>) => {
  return http.request<SysCustomerTracesData>("put", baseUrlApi("plugins/syscustomertraces/syscustomertraces/edit"), { data });
};

export const deleteSysCustomerTraces = (id: number) => {
  return http.request<BaseResult>("delete", baseUrlApi("plugins/syscustomertraces/syscustomertraces/delete"), { data: { id } });
};

export const getSysCustomerTraces = (id: number) => {
  return http.request<SysCustomerTracesResult>("get", baseUrlApi(`plugins/syscustomertraces/syscustomertraces/${id}`));
};
