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
