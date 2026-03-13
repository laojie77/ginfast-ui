import { http } from '@/utils/http';
import { baseUrlApi } from "@/api/utils";

import { BaseResult } from "@/api/types";


export interface SysChannelData {
    id: number; // Id
  channelName: string; // 渠道名称
    channelKey: string; // 渠道码
    hiddenCode: string; // 渠道隐藏名称
    secretKey: string; // 渠道密钥
    institution: string; // 机构ID
    starUrl: string; // 星级回传地址
    total: number; // 总进件数量
    rate: string; // 优质率
    remark: string; // 备注
    status: number; // 状态
    startTime: string; // 开始时间
    endTime: string; // 结束时间
    type: number; // 数据类型
    messageType: number; // 短信
    isRepeat: number; // 是否查重
    successCode: string; // 成功返回码
    successCodeField: string; // 成功码字段名
}

export type SysChannelListResult = BaseResult<{
    list: SysChannelData[];
    total: number;
}>;

export interface SysChannelListParams {
    pageNum: number;
    pageSize: number;
    id?: number; // Id
  channelName?: string; // 渠道名称
    channelKey?: string; // 渠道码
    hiddenCode?: string; // 渠道隐藏名称
    secretKey?: string; // 渠道密钥
    institution?: string; // 机构ID
    starUrl?: string; // 星级回传地址
    total?: number; // 总进件数量
    rate?: string; // 优质率
    remark?: string; // 备注
    status?: number; // 状态
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    type?: number; // 数据类型
    messageType?: number; // 短信
    isRepeat?: number; // 是否查重
    successCode?: string; // 成功返回码
    successCodeField?: string; // 成功码字段名
}


export type SysChannelResult = BaseResult<SysChannelData>;

export const getSysChannelList = (params: SysChannelListParams) => {
    return http.request<SysChannelListResult>("get", baseUrlApi("plugins/syschannel/syschannel/list"), { params });
};

export const createSysChannel = (data: Omit<SysChannelData, 'id'>) => {
    return http.request<SysChannelData>("post", baseUrlApi("plugins/syschannel/syschannel/add"), { data });
};

export const updateSysChannel= (data: Partial<SysChannelData>) => {
    return http.request<SysChannelData>("put", baseUrlApi(`plugins/syschannel/syschannel/edit`), { data });
};

export const deleteSysChannel = (id: number) => {
    return http.request<BaseResult>("delete", baseUrlApi(`plugins/syschannel/syschannel/delete`), { data: { id } });
};


export const getSysChannel = (id: number) => {
    return http.request<SysChannelResult>("get", baseUrlApi(`plugins/syschannel/syschannel/${id}`));
};
