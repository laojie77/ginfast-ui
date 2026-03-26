import type { SysCustomerData, SysCustomerStatusTraceUpdateParams } from "../api/syscustomer";
import { parseCustomerExtra } from "./customer-status.ts";

const STATUS_TRACE_PREFIX = "变更业务阶段状态：";
const INTENTION_TRACE_PREFIX = "变更客户有效状态：";
const STAR_TRACE_PREFIX = "变更客户星级：";
const LEFT_PAREN = "（";
const RIGHT_PAREN = "）";

const normalizeLabel = (value?: string) => value || "-";

const wrapSuffix = (value?: string) => {
  const text = (value || "").trim();
  return text ? `${LEFT_PAREN}${text}${RIGHT_PAREN}` : "";
};

export const buildStatusTraceData = (beforeLabel?: string, afterLabel?: string, remark?: string) => {
  return `${STATUS_TRACE_PREFIX}${normalizeLabel(beforeLabel)}->${normalizeLabel(afterLabel)}${wrapSuffix(remark)}`;
};

export const buildIntentionTraceData = (beforeLabel?: string, afterLabel?: string, validLabel?: string) => {
  return `${INTENTION_TRACE_PREFIX}${normalizeLabel(beforeLabel)}->${normalizeLabel(afterLabel)}${wrapSuffix(validLabel)}`;
};

export const buildCustomerStarTraceData = (beforeLabel?: string, afterLabel?: string) => {
  return `${STAR_TRACE_PREFIX}${normalizeLabel(beforeLabel)}->${normalizeLabel(afterLabel)}`;
};

type CustomerStatusPayloadSource = {
  id: number;
  status?: number | null;
  extra?: SysCustomerData["extra"];
};

type CustomerIntentionPayloadSource = {
  id: number;
  intention?: number | null;
  extra?: SysCustomerData["extra"];
};

type CustomerStarPayloadSource = {
  id: number;
  customerStar?: number | null;
};

export const buildStatusTraceUpdatePayload = (
  record: CustomerStatusPayloadSource,
  nextStatus: number,
  progressRemark: string,
  getStatusName: (value?: number | null) => string
): SysCustomerStatusTraceUpdateParams => {
  const extraObj = parseCustomerExtra(record.extra);
  extraObj.progress_remark = progressRemark;

  return {
    customerId: record.id,
    status: Number(nextStatus),
    progressRemark,
    extra: JSON.stringify(extraObj),
    data: buildStatusTraceData(getStatusName(record.status), getStatusName(Number(nextStatus)), progressRemark)
  };
};

export const buildIntentionTraceUpdatePayload = (
  record: CustomerIntentionPayloadSource,
  nextIntention: number,
  getIntentionName: (value?: number | null) => string,
  getCustomerValidName: (validId?: number) => string,
  validId?: number
): SysCustomerStatusTraceUpdateParams => {
  const extraObj = parseCustomerExtra(record.extra);
  if (validId) {
    extraObj.intention_valid_id = validId;
  }

  return {
    customerId: record.id,
    intention: Number(nextIntention),
    intentionValidId: validId ?? 0,
    extra: JSON.stringify(extraObj),
    data: buildIntentionTraceData(
      getIntentionName(record.intention),
      getIntentionName(Number(nextIntention)),
      getCustomerValidName(validId)
    )
  };
};

export const buildCustomerStarUpdatePayload = (
  record: CustomerStarPayloadSource,
  nextCustomerStar: number,
  getCustomerStarName: (value?: number | null) => string
): SysCustomerStatusTraceUpdateParams => {
  return {
    customerId: record.id,
    customerStar: Number(nextCustomerStar),
    data: buildCustomerStarTraceData(getCustomerStarName(record.customerStar), getCustomerStarName(Number(nextCustomerStar)))
  };
};
