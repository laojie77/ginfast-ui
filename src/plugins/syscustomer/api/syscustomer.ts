import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
import type { BaseResult } from "@/api/types";

export type CustomerListScene =
  | "all"
  | "my"
  | "public"
  | "exchange"
  | "reassign"
  | "locked"
  | "intention2"
  | "intention3"
  | "status0";

export interface SysCustomerTraceData {
  id?: number | string;
  customerId?: number;
  userId?: number;
  tenantId?: number;
  data?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  userName?: string;
  avatar?: string;
}

export interface SysCustomerData {
  id: number;
  num: string;
  name: string;
  mobile: string;
  mdMobile: string;
  moneyDemand: number;
  channelName: number;
  userName: number;
  customerStar: number | null;
  status: number;
  intention: number;
  lastTime: string;
  isHouse: number;
  isCar: number;
  isCompany: number;
  isCredit: number;
  isInsurance: number;
  isWork: number;
  isFund: number;
  isSocial: number;
  isTax: number;
  singlePieceType: number;
  sex: number;
  allotTime: string;
  deptId: number;
  tenantId: number;
  remarks: string;
  age: number;
  city: string;
  customerComment: string;
  source: string;
  newData: number;
  distributionTime: string;
  redistributionTime: string;
  isReassign: number;
  batchId: number;
  isRead: number;
  isPublic: number;
  isQuit: number;
  isRepeat: number;
  isRubbish: number;
  dispatchTime: string;
  isRemind: number;
  isSms: number;
  starStatus: number;
  isExchange: number;
  publicTypeTime: string;
  publicType: number;
  isLock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  channelId?: number;
  userId?: number;
  extra?: string | Record<string, unknown>;
  extraData?: Record<string, unknown>;
  customerTracesList?: SysCustomerTraceData[];
}

export interface SysCustomerCreateParams {
  name?: string;
  mobile: string;
  moneyDemand?: number;
  channelId: number;
  customerStar?: number | null;
  status?: number | null;
  intention?: number | null;
  extra?: string;
  sex?: number | null;
  deptId?: number;
  remarks?: string;
  age?: number | null;
  from?: number | null;
}

export type SysCustomerUpdateParams = Partial<SysCustomerData> & {
  id?: number;
  channelId?: number;
  userId?: number;
  extra?: string | Record<string, unknown>;
  extraData?: Record<string, unknown>;
};

export type SysCustomerListResult = BaseResult<{
  list: SysCustomerData[];
  total: number;
}>;

export type SysCustomerExportSubmitResult = BaseResult<{
  mode: "sync" | "async";
  total: number;
  message?: string;
  taskId?: number;
  status?: string;
  existing?: boolean;
}>;

export type SysCustomerExportTaskResult = BaseResult<{
  id: number;
  status: "queued" | "running" | "success" | "failed" | "canceled";
  total: number;
  processed: number;
  progress: number;
  affixId?: number;
  fileName?: string;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
}>;

export interface SysCustomerImportFailure {
  row: number;
  name?: string;
  mobile?: string;
  message: string;
}

export type SysCustomerImportSubmitResult = BaseResult<{
  batchId: number;
  status: "pending" | "running" | "canceling" | "canceled" | "success" | "partial" | "failed";
  existing?: boolean;
  message?: string;
}>;

export type SysCustomerImportBatchResult = BaseResult<{
  id: number;
  status: "pending" | "running" | "canceling" | "canceled" | "success" | "partial" | "failed";
  startRow: number;
  resumeRow?: number;
  interrupted: boolean;
  totalCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  progress: number;
  remark?: string;
  errorMessage?: string;
  failures?: SysCustomerImportFailure[];
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  fileName?: string;
}>;

export interface SysCustomerListParams {
  pageNum: number;
  pageSize: number;
  scene?: CustomerListScene;
  num?: string;
  id?: number;
  name?: string;
  mobile?: string;
  mdMobile?: string;
  moneyDemand?: number;
  channelId?: number;
  channelName?: number;
  userId?: number;
  userName?: number;
  customerStar?: number | null;
  status?: number;
  intention?: number;
  lastTime?: string;
  isHouse?: number;
  isCar?: number;
  isCompany?: number;
  isCredit?: number;
  isInsurance?: number;
  isWork?: number;
  isFund?: number;
  isSocial?: number;
  isTax?: number;
  singlePieceType?: number;
  sex?: number;
  allotTime?: string;
  deptId?: number;
  tenantId?: number;
  remarks?: string;
  age?: number;
  city?: string;
  customerComment?: string;
  source?: string;
  newData?: number;
  distributionTime?: string;
  redistributionTime?: string;
  isReassign?: number;
  batchId?: number;
  isRead?: number;
  isPublic?: number;
  isQuit?: number;
  isRepeat?: number;
  isRubbish?: number;
  dispatchTime?: string;
  isRemind?: number;
  isSms?: number;
  starStatus?: number;
  isExchange?: number;
  publicTypeTime?: string;
  publicType?: number;
  isLock?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type SysCustomerResult = BaseResult<SysCustomerData>;

export interface SysCustomerStatusTraceUpdateParams {
  customerId: number;
  data?: string;
  status?: number;
  intention?: number;
  customerStar?: number | null;
  isRead?: number;
  progressRemark?: string;
  intentionValidId?: number;
  extra?: string | Record<string, unknown>;
}

export const getSysCustomerList = (params: SysCustomerListParams) => {
  return http.request<SysCustomerListResult>("get", baseUrlApi("plugins/syscustomer/syscustomer/list"), { params });
};

export const exportSysCustomerList = (params: Partial<SysCustomerListParams>) => {
  return http.request<Blob>("get", baseUrlApi("plugins/syscustomer/syscustomer/list"), {
    params: {
      ...params,
      export: 1
    },
    responseType: "blob"
  });
};

export const submitSysCustomerExport = (params: Partial<SysCustomerListParams>) => {
  return http.request<SysCustomerExportSubmitResult>("get", baseUrlApi("plugins/syscustomer/syscustomer/list"), {
    params: {
      ...params,
      export: "submit"
    }
  });
};

export const getSysCustomerExportTask = (taskId: number) => {
  return http.request<SysCustomerExportTaskResult>("get", baseUrlApi(`plugins/syscustomer/syscustomer/exportTask/${taskId}`));
};

export const importSysCustomerFile = (data: FormData) => {
  return http.request<SysCustomerImportSubmitResult>("post", baseUrlApi("plugins/syscustomer/syscustomer/import"), {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 10 * 60 * 1000
  });
};

export const cancelSysCustomerImportBatch = (batchId: number) => {
  return http.request<SysCustomerImportBatchResult>("post", baseUrlApi("plugins/syscustomer/syscustomer/import"), {
    data: {
      action: "cancel",
      batchId
    }
  });
};

export const getSysCustomerImportBatch = (batchId: number) => {
  return http.request<SysCustomerImportBatchResult>("get", baseUrlApi(`plugins/syscustomer/syscustomer/importBatch/${batchId}`));
};

export const getLatestSysCustomerImportBatch = () => {
  return http.request<SysCustomerImportBatchResult>("get", baseUrlApi("plugins/syscustomer/syscustomer/importBatch/latest"));
};

export const createSysCustomer = (data: SysCustomerCreateParams) => {
  return http.request<SysCustomerData>("post", baseUrlApi("plugins/syscustomer/syscustomer/add"), { data });
};

export const updateSysCustomer = (data: SysCustomerUpdateParams) => {
  return http.request<SysCustomerData>("put", baseUrlApi("plugins/syscustomer/syscustomer/edit"), { data });
};

export const deleteSysCustomer = (id: number) => {
  return http.request<BaseResult>("delete", baseUrlApi("plugins/syscustomer/syscustomer/delete"), { data: { id } });
};

export const getSysCustomer = (id: number) => {
  return http.request<SysCustomerResult>("get", baseUrlApi(`plugins/syscustomer/syscustomer/${id}`));
};

export const updateSysCustomerStatusTrace = (data: SysCustomerStatusTraceUpdateParams) => {
  return http.request<SysCustomerData>("put", baseUrlApi("plugins/syscustomer/syscustomer/updateCustomerStatusTrace"), { data });
};
