import type { CustomerListScene, SysCustomerListParams } from "../api/syscustomer.ts";

export interface CustomerListSearchForm {
  num: string;
  name: string;
  mobile: string;
  moneyDemand?: number;
  channelId?: number;
  userId?: number;
  customerStar?: number;
  status?: number;
  intention?: number;
  singlePieceType?: number;
  allotTime?: unknown;
  deptId?: number | number[];
  city: string;
  isReassign?: number;
  isQuit?: number;
  isRepeat?: number;
  starStatus?: number;
  isLock?: number;
}

type CustomerListPaging = Pick<SysCustomerListParams, "pageNum" | "pageSize">;

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== "";

const toNumber = (value: unknown) => Number(value);

const resolveDeptId = (deptId: CustomerListSearchForm["deptId"]) => {
  if (Array.isArray(deptId)) {
    return deptId.length > 0 ? deptId[deptId.length - 1] : undefined;
  }
  return deptId;
};

export const createCustomerSearchForm = (): CustomerListSearchForm => ({
  num: "",
  name: "",
  mobile: "",
  moneyDemand: undefined,
  channelId: undefined,
  userId: undefined,
  customerStar: undefined,
  status: undefined,
  intention: undefined,
  singlePieceType: undefined,
  allotTime: "",
  deptId: undefined,
  city: "",
  isReassign: undefined,
  isQuit: undefined,
  isRepeat: undefined,
  starStatus: undefined,
  isLock: undefined
});

export const buildCustomerListParams = (
  searchForm: CustomerListSearchForm,
  paging: CustomerListPaging,
  scene: CustomerListScene = "all"
): SysCustomerListParams => {
  const params: SysCustomerListParams = {
    pageNum: paging.pageNum,
    pageSize: paging.pageSize,
    scene
  };

  if (hasText(searchForm.num)) {
    params.num = searchForm.num.trim();
  }
  if (hasText(searchForm.name)) {
    params.name = searchForm.name.trim();
  }
  if (hasText(searchForm.mobile)) {
    params.mobile = searchForm.mobile.trim();
  }
  if (hasValue(searchForm.moneyDemand)) {
    params.moneyDemand = toNumber(searchForm.moneyDemand);
  }
  if (hasValue(searchForm.channelId)) {
    params.channelId = toNumber(searchForm.channelId);
  }
  if (hasValue(searchForm.userId)) {
    params.userId = toNumber(searchForm.userId);
  }
  if (hasValue(searchForm.customerStar)) {
    params.customerStar = toNumber(searchForm.customerStar);
  }
  if (hasValue(searchForm.status)) {
    params.status = toNumber(searchForm.status);
  }
  if (hasValue(searchForm.intention)) {
    params.intention = toNumber(searchForm.intention);
  }
  if (hasValue(searchForm.singlePieceType)) {
    params.singlePieceType = toNumber(searchForm.singlePieceType);
  }
  if (hasValue(searchForm.allotTime)) {
    params.allotTime = searchForm.allotTime as SysCustomerListParams["allotTime"];
  }

  const deptId = resolveDeptId(searchForm.deptId);
  if (hasValue(deptId)) {
    params.deptId = toNumber(deptId);
  }

  if (hasText(searchForm.city)) {
    params.city = searchForm.city.trim();
  }
  if (hasValue(searchForm.isReassign)) {
    params.isReassign = toNumber(searchForm.isReassign);
  }
  if (hasValue(searchForm.isQuit)) {
    params.isQuit = toNumber(searchForm.isQuit);
  }
  if (hasValue(searchForm.isRepeat)) {
    params.isRepeat = toNumber(searchForm.isRepeat);
  }
  if (hasValue(searchForm.starStatus)) {
    params.starStatus = toNumber(searchForm.starStatus);
  }
  if (hasValue(searchForm.isLock)) {
    params.isLock = toNumber(searchForm.isLock);
  }

  return params;
};

export const resetCustomerSearchForm = (searchForm: CustomerListSearchForm) => {
  Object.assign(searchForm, createCustomerSearchForm());
};
