import { ref } from "vue";
import { getDictOptionName } from "@/globals";
import { getCustomerValidList, type CustomerValidData, type CustomerValidListParams } from "@/api/customervalid";

export interface CustomerSelectOption {
  value: number | string;
  name: string;
}

type CustomerExtra = string | Record<string, unknown> | null | undefined;

interface CustomerStatusLike {
  status?: number | null;
  extra?: CustomerExtra;
}

interface CustomerIntentionLike {
  intention?: number | null;
  extra?: CustomerExtra;
}

interface CustomerStarLike {
  customerStar?: number | null;
}

export const parseCustomerExtra = (extra?: CustomerExtra) => {
  if (!extra) {
    return {} as Record<string, unknown>;
  }

  if (typeof extra === "object") {
    return { ...extra };
  }

  try {
    return JSON.parse(extra);
  } catch (error) {
    console.error("解析客户 extra 字段失败:", error);
    return {} as Record<string, unknown>;
  }
};

export const getCustomerStarOptionName = (options: CustomerSelectOption[], value?: number | null, fallback = "未定级") => {
  if (value == null) {
    return fallback;
  }

  return getDictOptionName(options, value, fallback);
};

export const getCustomerStatusColor = (status?: number | null) => {
  if (status == null) {
    return "";
  }

  return status === 0 ? "" : status === 7 ? "green" : "arcoblue";
};

export const getCustomerIntentionColor = (intention?: number | null) => {
  if (intention == null) {
    return "";
  }

  return intention === 0 ? "" : intention === 1 ? "green" : intention === 2 ? "red" : "orange";
};

export const getCustomerStarTagColor = (star?: number | null) => {
  if (star == null) {
    return "";
  }

  return [0, 1, 2].includes(Number(star)) ? "red" : "arcoblue";
};

export const getCustomerProgressRemark = (extra?: CustomerExtra) => {
  const extraObj = parseCustomerExtra(extra);
  return String(extraObj.progress_remark || "")
    .trim()
    .replace(/\s*-\s*$/, "");
};

export const getCustomerIntentionValidId = (extra?: CustomerExtra) => {
  const extraObj = parseCustomerExtra(extra);
  const validId = Number(extraObj.intention_valid_id);
  return Number.isFinite(validId) && validId > 0 ? validId : undefined;
};

export const getCustomerStatusDisplayText = (record: CustomerStatusLike, statusOptions: CustomerSelectOption[]) => {
  const statusName = getDictOptionName(statusOptions, record.status, "");
  const progressRemark = getCustomerProgressRemark(record.extra);
  return progressRemark ? `${statusName} - ${progressRemark}` : statusName;
};

export const getCustomerIntentionDisplayText = (
  record: CustomerIntentionLike,
  intentionOptions: CustomerSelectOption[],
  validOptionsMap: Map<number, CustomerValidData>
) => {
  const intentionName = getDictOptionName(intentionOptions, record.intention, "");
  if (Number(record.intention) === 0) {
    return intentionName;
  }

  const validId = getCustomerIntentionValidId(record.extra);
  const validName = validId ? validOptionsMap.get(validId)?.name || "" : "";
  return validName ? `${intentionName} - ${validName}` : intentionName;
};

export const getCustomerStarDisplayText = (record: CustomerStarLike, starOptions: CustomerSelectOption[], fallback = "未定级") =>
  getCustomerStarOptionName(starOptions, record.customerStar, fallback);

export const getCustomerValidModalTitle = (intention?: number) => {
  switch (intention) {
    case 1:
      return "有效说明";
    case 2:
      return "无效说明";
    case 3:
      return "黑名单";
    default:
      return "客户有效";
  }
};

export const useCustomerValidOptions = () => {
  const customerValidOptions = ref<CustomerValidData[]>([]);
  const allCustomerValidOptionsMap = ref<Map<number, CustomerValidData>>(new Map());

  const getCustomerValidName = (validId?: number) => {
    if (!validId) {
      return "";
    }

    return allCustomerValidOptionsMap.value.get(validId)?.name || "";
  };

  const filterCustomerValidOptions = (type?: number) => {
    if (!allCustomerValidOptionsMap.value.size) {
      customerValidOptions.value = [];
      return;
    }

    const allOptions = Array.from(allCustomerValidOptionsMap.value.values());
    customerValidOptions.value = type === undefined ? allOptions : allOptions.filter(item => item.type === type);
  };

  const loadCustomerValidOptions = async (type: number, params: Partial<CustomerValidListParams> = {}) => {
    try {
      const response = await getCustomerValidList({ type, pageSize: 100, ...params });
      customerValidOptions.value = response.data.list || [];
    } catch (error) {
      console.error("加载客户有效性标签选项失败:", error);
      customerValidOptions.value = [];
    }
  };

  const loadAllCustomerValidOptions = async (params: Partial<CustomerValidListParams> = {}) => {
    try {
      const response = await getCustomerValidList({ pageSize: 1000, ...params });
      const allOptions = response.data.list || [];
      allCustomerValidOptionsMap.value = new Map<number, CustomerValidData>(
        allOptions.map((item: CustomerValidData) => [item.id, item])
      );
    } catch (error) {
      console.error("加载客户有效性标签映射失败:", error);
    }
  };

  return {
    customerValidOptions,
    allCustomerValidOptionsMap,
    getCustomerValidName,
    filterCustomerValidOptions,
    loadCustomerValidOptions,
    loadAllCustomerValidOptions
  };
};
