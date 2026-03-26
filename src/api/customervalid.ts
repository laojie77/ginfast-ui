import { http } from "@/utils/http";
import { BaseResult } from "@/api/types.ts";

// 客户有效性标签数据类型
export interface CustomerValidData {
  id: number;
  type: number;
  name: string;
  status: number;
  tenantId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 客户有效性标签列表查询参数
export interface CustomerValidListParams {
  pageNum?: number;
  pageSize?: number;
  type?: number;
  name?: string;
  status?: number;
}

// 客户有效性标签创建参数
export interface CustomerValidCreateParams {
  type: number;
  name: string;
  status: number;
}

// 客户有效性标签更新参数
export interface CustomerValidUpdateParams {
  id: number;
  type: number;
  name: string;
  status: number;
}

export type CustomerValidListResult = BaseResult<{
  list: CustomerValidData[];
  total: number;
  pageNum: number;
  pageSize: number;
}>;

// 获取客户有效性标签列表
export const getCustomerValidList = (params: CustomerValidListParams) => {
  return http.request<CustomerValidListResult>("get", "/api/customerValid/list", { params });
};

// 创建客户有效性标签
export const createCustomerValid = (data: CustomerValidCreateParams) => {
  return http.request<BaseResult<CustomerValidData>>("post", "/api/customerValid/add", { data });
};

// 更新客户有效性标签
export const updateCustomerValid = (data: CustomerValidUpdateParams) => {
  return http.request<BaseResult<CustomerValidData>>("put", "/api/customerValid/edit", { data });
};

// 删除客户有效性标签
export const deleteCustomerValid = (id: number) => {
  return http.request<BaseResult>("delete", "/api/customerValid/delete", { data: { id } });
};

// 获取客户有效性标签详情
export const getCustomerValid = (id: number) => {
  return http.request<BaseResult<CustomerValidData>>("get", `/api/customerValid/${id}`);
};
