import { http } from '@/utils/http';
import { baseUrlApi } from '@/api/utils';

import type { BaseResult } from '@/api/types';

export interface SysCustomerExportTasksData {
  id: number;
  tenantId: number;
  userId: number;
  userNickName: string;
  bizType: string;
  status: string;
  statusName: string;
  requestJson: string;
  snapshotMaxId: number;
  total: number;
  processed: number;
  progress: number;
  affixId: number;
  fileName: string;
  errorMessage: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type SysCustomerExportTasksListResult = BaseResult<{
  list: SysCustomerExportTasksData[];
  total: number;
}>;

export interface SysCustomerExportTasksListParams {
  pageNum: number;
  pageSize: number;
  userName?: string;
  status?: string;
  createdAt?: string[];
}

export type SysCustomerExportTasksResult = BaseResult<SysCustomerExportTasksData>;

export const getSysCustomerExportTasksList = (params: SysCustomerExportTasksListParams) => {
  return http.request<SysCustomerExportTasksListResult>(
    'get',
    baseUrlApi('plugins/syscustomerexporttasks/syscustomerexporttasks/list'),
    { params }
  );
};

export const getSysCustomerExportTasks = (id: number) => {
  return http.request<SysCustomerExportTasksResult>(
    'get',
    baseUrlApi(`plugins/syscustomerexporttasks/syscustomerexporttasks/${id}`)
  );
};
