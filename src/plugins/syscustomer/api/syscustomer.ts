import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";


export interface SysCustomerData {
    id: number; // 主键ID
    num: string; // 客户编号
    name: string; // 客户姓名
    mobile: string; // 手机号
    mdMobile: string; // 手机号MD5值，用于隐私查询
    moneyDemand: number; // 需求金额
    channelName: number; // 渠道来源
    userName: number; // 跟进人
  customerStar: number; // 星级
    status: number; // 业务阶段
    intention: number; // 客户有效
    lastTime: string; // 最后操作时间
    isHouse: number; // 房
    isCar: number; // 车
    isCompany: number; // 公司
    isCredit: number; // 信用卡
    isInsurance: number; // 保单
    isWork: number; // 打卡工资
    isFund: number; // 公积金
    isSocial: number; // 社保
    isTax: number; // 营业税
    singlePieceType: number; // 贷款类型
    sex: number; // 性别
    allotTime: string; // 分配时间
    departmentId: number; // 所属部门
    tenantId: number; // 所属公司ID
    remarks: string; // 客户备注
    age: number; // 年龄
    city: string; // 所在城市
    customerComment: string; // 上级评价
    source: string; // 渠道编码
    newData: number; // 新数据
    distributionTime: string; // 分配时间
    redistributionTime: string; // 再分配时间
    isReassign: number; // 再分配
    batchId: number; // 导入批次ID
    isRead: number; // 是否已读
    isPublic: number; // 公共池
    isQuit: number; // 离职数据
    isRepeat: number; // 重复标记
    isRubbish: number; // 是否垃圾库：1是
    remarkTime: string; // 最后备注时间
    dispatchTime: string; // 待调度时间
    isRemind: number; // 是否提醒
    isSms: number; // 短信发送状态
    starStatus: number; // 星级回传
    isExchange: number; // 待流转标记：1待流转
    publicTypeTime: string; // 抓取公共池时间
    publicType: number; // 抓取类型
    isLock: number; // 是否锁定
    createdAt: string; // CreatedAt
    updatedAt: string; // UpdatedAt
    deletedAt: string; // DeletedAt
}

export type SysCustomerListResult = BaseResult<{
    list: SysCustomerData[];
    total: number;
}>;

export interface SysCustomerListParams {
    pageNum: number;
    pageSize: number;
    num?: string; // 客户编号
    id?: number; // 主键ID
    name?: string; // 客户姓名
    mobile?: string; // 手机号
    mdMobile?: string; // 手机号MD5值，用于隐私查询
    moneyDemand?: number; // 需求金额
    channelName?: number; // 渠道来源
    userName?: number; // 跟进人
  customerStar?: number; // 星级
    status?: number; // 业务阶段
    intention?: number; // 客户有效
    lastTime?: string; // 最后操作时间
    isHouse?: number; // 房
    isCar?: number; // 车
    isCompany?: number; // 公司
    isCredit?: number; // 信用卡
    isInsurance?: number; // 保单
    isWork?: number; // 打卡工资
    isFund?: number; // 公积金
    isSocial?: number; // 社保
    isTax?: number; // 营业税
    singlePieceType?: number; // 贷款类型
    sex?: number; // 性别
    allotTime?: string; // 分配时间
    departmentId?: number; // 所属部门
    tenantId?: number; // 所属公司ID
    remarks?: string; // 客户备注
    age?: number; // 年龄
    city?: string; // 所在城市
    customerComment?: string; // 上级评价
    source?: string; // 渠道编码
    newData?: number; // 新数据
    distributionTime?: string; // 分配时间
    redistributionTime?: string; // 再分配时间
    isReassign?: number; // 再分配
    batchId?: number; // 导入批次ID
    isRead?: number; // 是否已读
    isPublic?: number; // 公共池
    isQuit?: number; // 离职数据
    isRepeat?: number; // 重复标记
    isRubbish?: number; // 是否垃圾库：1是
    remarkTime?: string; // 最后备注时间
    dispatchTime?: string; // 待调度时间
    isRemind?: number; // 是否提醒
    isSms?: number; // 短信发送状态
    starStatus?: number; // 星级回传
    isExchange?: number; // 待流转标记：1待流转
    publicTypeTime?: string; // 抓取公共池时间
    publicType?: number; // 抓取类型
    isLock?: number; // 是否锁定
    createdAt?: string; // CreatedAt
    updatedAt?: string; // UpdatedAt
    deletedAt?: string; // DeletedAt
}


export type SysCustomerResult = BaseResult<SysCustomerData>;

export const getSysCustomerList = (params: SysCustomerListParams) => {
    return http.request<SysCustomerListResult>("get", baseUrlApi("plugins/syscustomer/syscustomer/list"), { params });
};

export const createSysCustomer = (data: Omit<SysCustomerData, 'id'>) => {
    return http.request<SysCustomerData>("post", baseUrlApi("plugins/syscustomer/syscustomer/add"), { data });
};

export const updateSysCustomer= (data: Partial<SysCustomerData>) => {
    return http.request<SysCustomerData>("put", baseUrlApi(`plugins/syscustomer/syscustomer/edit`), { data });
};

export const deleteSysCustomer = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/syscustomer/syscustomer/delete`), { data: { id } });
};


export const getSysCustomer = (id: number) => {
    return http.request<SysCustomerResult>("get", baseUrlApi(`plugins/syscustomer/syscustomer/${id}`));
};
