import { formatTime } from "@/globals";

export interface CustomerTraceDisplayItem {
  createdAt?: string | null;
  userName?: string | null;
  data?: string | null;
}

export const formatRemarkDisplay = (remarks?: string | null) => {
  if (!remarks?.trim()) return "";

  return remarks
    .split(/\s*[,\uFF0C]\s*/)
    .filter(Boolean)
    .join("\n");
};

const formatTraceDisplay = (trace?: CustomerTraceDisplayItem | null) => {
  if (!trace) return "";

  const parts = [
    trace.createdAt ? formatTime(trace.createdAt) : "",
    trace.userName?.trim() || "",
    trace.data?.trim() || ""
  ].filter(Boolean);

  return parts.join(" - ");
};

export const formatCustomerRemarkDisplay = (
  remarks?: string | null,
  customerTracesList?: CustomerTraceDisplayItem[] | null
) => {
  const formattedRemarks = formatRemarkDisplay(remarks);
  if (formattedRemarks) return formattedRemarks;

  if (!Array.isArray(customerTracesList) || customerTracesList.length === 0) {
    return "";
  }

  return customerTracesList
    .map(formatTraceDisplay)
    .filter(Boolean)
    .join("\n");
};
