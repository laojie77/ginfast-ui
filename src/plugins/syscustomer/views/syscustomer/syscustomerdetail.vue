<template>
  <div class="customer-detail-drawer">
    <a-drawer
      v-model:visible="visible"
      title="客户详情"
      placement="right"
      :width="1260"
      :footer="false"
      body-class="customer-detail-body"
      @cancel="handleClose"
    >
      <div class="detail-shell">
        <div class="serial-strip">
          <div class="serial-main">
            <span class="serial-label">客户编号：</span>
            <span class="serial-value">{{ localCustomer?.num || "-" }}</span>
          </div>

          <div class="serial-status">
            <a-dropdown @select="handleStatusSelect">
              <a-tooltip :content="getStatusDisplayText()" position="top">
                <a-tag
                  size="small"
                  :color="getStatusColor(localCustomer?.status)"
                  :class="['dropdown-tag', getStatusDisplayText().length > 20 ? 'multiline' : '']"
                >
                  {{ getStatusDisplayText() }}
                </a-tag>
              </a-tooltip>
              <template #content>
                <a-doption
                  v-for="item in props.statusOptions"
                  :key="item.value"
                  :value="Number(item.value)"
                  :style="{ color: Number(item.value) === Number(localCustomer?.status) ? '#165dff' : '' }"
                >
                  {{ item.name }}
                </a-doption>
              </template>
            </a-dropdown>

            <a-dropdown @select="handleIntentionSelect">
              <a-tooltip :content="getIntentionText(localCustomer?.intention)" position="top">
                <a-tag size="small" :color="getIntentionColor(localCustomer?.intention)" class="dropdown-tag">
                  {{ getIntentionText(localCustomer?.intention) }}
                </a-tag>
              </a-tooltip>
              <template #content>
                <a-doption
                  v-for="item in props.intentionOptions"
                  :key="item.value"
                  :value="Number(item.value)"
                  :style="{ color: Number(item.value) === Number(localCustomer?.intention) ? '#165dff' : '' }"
                >
                  {{ item.name }}
                </a-doption>
              </template>
            </a-dropdown>

            <a-dropdown @select="handleStarSelect">
              <a-tooltip :content="getStarText(localCustomer?.customerStar)" position="top">
                <a-tag size="small" :color="getStarColor(localCustomer?.customerStar)" class="dropdown-tag">
                  {{ getStarText(localCustomer?.customerStar) }}
                </a-tag>
              </a-tooltip>
              <template #content>
                <a-doption
                  v-for="item in props.starOptions"
                  :key="item.value"
                  :value="Number(item.value)"
                  :style="{ color: Number(item.value) === Number(localCustomer?.customerStar) ? '#165dff' : '' }"
                >
                  {{ item.name }}
                </a-doption>
              </template>
            </a-dropdown>

            <a-dropdown @select="handleSinglePieceTypeSelect">
              <a-tooltip :content="getSinglePieceTypeDisplayText()" position="top">
                <a-tag size="small" :color="getSinglePieceTypeColor(localCustomer?.singlePieceType)" class="dropdown-tag">
                  {{ getSinglePieceTypeDisplayText() }}
                </a-tag>
              </a-tooltip>
              <template #content>
                <a-doption
                  v-for="item in props.singlePieceTypeOptions"
                  :key="item.value"
                  :value="Number(item.value)"
                  :style="{ color: Number(item.value) === Number(localCustomer?.singlePieceType) ? '#165dff' : '' }"
                >
                  {{ item.name }}
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>

        <div class="content-shell">
          <div class="left-pane">
            <div class="panel-card customer-panel">
              <div class="customer-header">
                <a-avatar :size="68" class="customer-avatar">
                  {{ localCustomer?.name?.charAt(0) || "客" }}
                </a-avatar>
                <div class="customer-summary">
                  <div class="customer-name-row">
                    <span class="customer-name">{{ localCustomer?.name || "未命名客户" }}</span>
                    <span class="customer-sex">{{ getSexText(localCustomer?.sex) }}</span>
                  </div>
                  <div class="customer-phone">{{ localCustomer?.mobile || "-" }}</div>
                  <div class="customer-mini-tags">
                    <a-tag :color="localCustomer?.isLock === 1 ? 'red' : 'green'" size="small">
                      {{ localCustomer?.isLock === 1 ? "已锁定" : "未锁定" }}
                    </a-tag>
                    <a-tag :color="localCustomer?.isRepeat === 1 ? 'orange' : 'gray'" size="small">
                      {{ localCustomer?.isRepeat === 1 ? "重复客户" : "正常数据" }}
                    </a-tag>
                  </div>
                </div>
              </div>

              <div class="summary-grid">
                <div v-for="item in summaryItems" :key="item.label" class="summary-item">
                  <div class="summary-label">{{ item.label }}</div>
                  <div class="summary-value">{{ item.value }}</div>
                </div>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-title">客户资质</div>
              <div class="qualification-grid">
                <div v-for="property in ALL_EXTRA_PROPERTIES" :key="property" class="qualification-item">
                  <div class="qualification-label">{{ EXTRA_PROPERTY_LABELS[property] }}</div>
                  <a-select
                    :model-value="extraForm[property]"
                    :placeholder="`请选择${EXTRA_PROPERTY_LABELS[property]}`"
                    allow-clear
                    :loading="savingField === property"
                    @change="handleExtraChange(property, $event)"
                  >
                    <a-option v-for="option in getExtraPropertyOptions(property)" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>

          <div class="right-pane">
            <div class="panel-card chat-panel">
              <div class="chat-header">
                <div class="chat-title-wrap">
                  <div class="panel-title panel-title--compact">
                    跟进记录
                    <span class="panel-title-note"> 分配时间：{{ formatDisplayTime(localCustomer?.allotTime) }} </span>
                  </div>
                  <div class="chat-subtitle">最新记录显示在最下面，向上滚动查看历史记录</div>
                </div>
                <a-badge :count="followRecords.length" />
              </div>

              <div class="remarks-grid">
                <div class="remark-block">
                  <div class="remark-title">客户备注</div>
                  <div class="remark-content">{{ localCustomer?.remarks || "暂无备注" }}</div>
                </div>

                <div class="remark-block">
                  <div class="remark-title">上级评价</div>
                  <div class="remark-content">
                    {{ localCustomer?.customerComment || "暂无评价" }}
                  </div>
                </div>
              </div>

              <div ref="messagesContainer" class="chat-messages">
                <template v-if="followRecords.length">
                  <div v-for="record in followRecords" :key="record.id" class="message-item">
                    <div class="message-left">
                      <a-avatar :size="36" class="record-avatar">
                        {{ record.userName?.charAt(0) || "跟" }}
                      </a-avatar>
                    </div>
                    <div class="message-right">
                      <div class="message-top">
                        <span class="message-user">{{ record.userName || "未知用户" }}</span>
                        <span class="message-time">{{ formatDisplayTime(record.createdAt) }}</span>
                      </div>
                      <div class="message-text">{{ record.data || "-" }}</div>
                    </div>
                  </div>
                </template>

                <div v-else class="empty-records">
                  <a-empty description="暂无聊天记录" />
                </div>
              </div>

              <div class="chat-editor">
                <a-textarea v-model="newRecord" placeholder="请输入跟进内容..." :rows="4" :max-length="500" show-word-limit />
                <div class="chat-actions">
                  <span class="chat-actions-tip">发送后会自动滚动到底部</span>
                  <a-button type="primary" :loading="addingRecord" @click="handleAddRecord">
                    <template #icon>
                      <icon-plus />
                    </template>
                    发送
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { formatTime } from "@/globals";
import { useSysConfigStore } from "@/store/modules/sys-config";
import { getSysCustomer, updateSysCustomer, type SysCustomerData } from "../../api/syscustomer";
import {
  createSysCustomerTraces,
  getSysCustomerTracesList,
  type SysCustomerTracesData
} from "../../../syscustomertraces/api/syscustomertraces";

type CustomerDetailData = Partial<SysCustomerData> &
  Record<string, any> & {
    id?: number;
    channelId?: number;
    userId?: number;
    extra?: string | Record<string, any>;
  };

interface SelectOption {
  value: number;
  name: string;
}

interface Props {
  visible: boolean;
  customerId?: number;
  customerData?: CustomerDetailData;
  channelOptions?: SelectOption[];
  followerOptions?: SelectOption[];
  departmentTree?: any[];
  statusOptions?: SelectOption[];
  intentionOptions?: SelectOption[];
  starOptions?: SelectOption[];
  sexOptions?: SelectOption[];
  singlePieceTypeOptions?: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  customerId: undefined,
  customerData: undefined,
  channelOptions: () => [],
  followerOptions: () => [],
  departmentTree: () => [],
  statusOptions: () => [],
  intentionOptions: () => [],
  starOptions: () => [],
  sexOptions: () => [],
  singlePieceTypeOptions: () => []
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  close: [];
  updated: [value: CustomerDetailData];
}>();

const sysConfigStore = useSysConfigStore();

const EXTRA_PROPERTIES = {
  OCCUPATION: "occupation",
  HOUSE: "house",
  CAR: "car",
  CREDIT_CARD: "creditcard",
  INSURANCE: "insurance",
  HOUSE_FUND: "housefund",
  SOCIAL_INSURANCE: "socialinsurance",
  ZHIMA_SCORE: "zhimascore",
  SALARY_MONEY: "salarymoney",
  EDUCATION: "education"
} as const;

const ALL_EXTRA_PROPERTIES = Object.values(EXTRA_PROPERTIES);

const EXTRA_PROPERTY_LABELS: Record<string, string> = {
  [EXTRA_PROPERTIES.OCCUPATION]: "职业",
  [EXTRA_PROPERTIES.HOUSE]: "房产",
  [EXTRA_PROPERTIES.CAR]: "车产",
  [EXTRA_PROPERTIES.CREDIT_CARD]: "信用卡",
  [EXTRA_PROPERTIES.INSURANCE]: "商业保险",
  [EXTRA_PROPERTIES.HOUSE_FUND]: "公积金",
  [EXTRA_PROPERTIES.SOCIAL_INSURANCE]: "社保",
  [EXTRA_PROPERTIES.ZHIMA_SCORE]: "芝麻分",
  [EXTRA_PROPERTIES.SALARY_MONEY]: "月薪",
  [EXTRA_PROPERTIES.EDUCATION]: "学历"
};

const TOP_FIELD_LABELS: Record<string, string> = {
  status: "业务阶段",
  intention: "客户有效",
  customerStar: "星级",
  singlePieceType: "类型"
};

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value)
});

const CUSTOMER_EXTRA_OPTIONS = computed(() => sysConfigStore.customerExtraConfig || {});

const localCustomer = ref<CustomerDetailData>();
const savingField = ref("");
const followRecords = ref<SysCustomerTracesData[]>([]);
const newRecord = ref("");
const addingRecord = ref(false);
const messagesContainer = ref<HTMLElement>();
const extraForm = reactive<Record<string, string>>({});

const parseExtra = (extra: CustomerDetailData["extra"]) => {
  if (!extra) return {};
  if (typeof extra === "object") return { ...extra };

  try {
    return JSON.parse(extra);
  } catch (error) {
    console.error("解析客户资质失败:", error);
    return {};
  }
};

const syncExtraForm = (extra: CustomerDetailData["extra"]) => {
  const extraObj = parseExtra(extra);
  ALL_EXTRA_PROPERTIES.forEach(property => {
    extraForm[property] = extraObj[property] ? String(extraObj[property]) : "";
  });
};

const syncLocalCustomer = (customer?: CustomerDetailData) => {
  localCustomer.value = customer ? { ...customer } : undefined;
  syncExtraForm(customer?.extra);
};

const formatAmount = (value?: string | number) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return String(value);
};

const formatDisplayTime = (value?: string) => {
  return value ? formatTime(value) || "-" : "-";
};

const getTextByOptions = (options: SelectOption[], value?: number) => {
  return options.find(item => Number(item.value) === Number(value))?.name || "-";
};

const getStatusText = (status?: number) => getTextByOptions(props.statusOptions, status);
const getIntentionText = (intention?: number) => getTextByOptions(props.intentionOptions, intention);
const getStarText = (star?: number) => getTextByOptions(props.starOptions, star);
const getSexText = (sex?: number) => getTextByOptions(props.sexOptions, sex);
const getSinglePieceTypeText = (type?: number) => getTextByOptions(props.singlePieceTypeOptions, type);
const getChannelName = (channelId?: number) => getTextByOptions(props.channelOptions, channelId);
const getFollowerName = (userId?: number) => getTextByOptions(props.followerOptions, userId);

const getDepartmentName = (departmentId?: number) => {
  if (!departmentId || !props.departmentTree.length) return "-";

  const findDepartmentName = (nodes: any[]): string => {
    for (const node of nodes) {
      if (node.id === departmentId) {
        return node.name;
      }
      if (node.children?.length) {
        const result = findDepartmentName(node.children);
        if (result) return result;
      }
    }
    return "";
  };

  return findDepartmentName(props.departmentTree) || "-";
};

const getStatusColor = (status?: number) => {
  if (status === undefined) return "";
  return status === 0 ? "" : status === 7 ? "green" : "arcoblue";
};

const getIntentionColor = (intention?: number) => {
  if (intention === undefined) return "";
  return intention === 0 ? "" : intention === 1 ? "green" : intention === 2 ? "red" : "orange";
};

const getStarColor = (star?: number) => {
  if (star === undefined) return "";
  return [0, 1, 2].includes(Number(star)) ? "red" : "arcoblue";
};

const getSinglePieceTypeColor = (type?: number) => {
  return type === undefined || type === null ? "" : "arcoblue";
};

const getStatusDisplayText = () => {
  const statusName = getStatusText(localCustomer.value?.status);
  const extraObj = parseExtra(localCustomer.value?.extra);
  const progressRemark = String(extraObj.progress_remark || "").trim();
  return progressRemark ? `${statusName} - ${progressRemark}` : statusName;
};

const getSinglePieceTypeDisplayText = () => {
  return localCustomer.value?.singlePieceType === undefined || localCustomer.value?.singlePieceType === null
    ? "NULL"
    : getSinglePieceTypeText(localCustomer.value?.singlePieceType);
};

const getExtraPropertyOptions = (property: string) => {
  const optionMap = CUSTOMER_EXTRA_OPTIONS.value[property] || {};
  return Object.entries(optionMap).map(([value, label]) => ({
    value,
    label: String(label)
  }));
};

const summaryItems = computed(() => [
  { label: "跟进人", value: getFollowerName(localCustomer.value?.userId) },
  { label: "渠道来源", value: getChannelName(localCustomer.value?.channelId) },
  { label: "所属部门", value: getDepartmentName(localCustomer.value?.departmentId) },
  { label: "所在城市", value: localCustomer.value?.city || "-" },
  { label: "需求金额", value: formatAmount(localCustomer.value?.moneyDemand) },
  { label: "年龄", value: formatAmount(localCustomer.value?.age) }
]);

const scrollMessagesToBottom = () => {
  nextTick(() => {
    if (!messagesContainer.value) return;
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  });
};

const refreshCustomerDetail = async () => {
  if (!localCustomer.value?.id) return;

  const detail = await getSysCustomer(localCustomer.value.id);
  syncLocalCustomer(detail.data as CustomerDetailData);
  emit("updated", detail.data as CustomerDetailData);
};

const saveCustomerPatch = async (patch: CustomerDetailData, fieldKey: string, successText: string) => {
  if (!localCustomer.value?.id) {
    Message.error("客户信息不存在");
    return;
  }

  const previousCustomer = localCustomer.value ? { ...localCustomer.value } : undefined;
  localCustomer.value = { ...localCustomer.value, ...patch };
  savingField.value = fieldKey;

  try {
    await updateSysCustomer(localCustomer.value);
    await refreshCustomerDetail();
    Message.success(successText);
  } catch (error) {
    console.error(`更新${fieldKey}失败:`, error);
    syncLocalCustomer(previousCustomer);
    Message.error(`${successText}失败`);
  } finally {
    savingField.value = "";
  }
};

const handleTopFieldChange = async (field: keyof CustomerDetailData, value: unknown) => {
  if (value === undefined || value === null || !localCustomer.value?.id) return;

  const nextValue = Number(value);
  if (Number(localCustomer.value[field]) === nextValue) return;

  await saveCustomerPatch({ [field]: nextValue }, String(field), `已更新${TOP_FIELD_LABELS[String(field)]}`);
};

const handleStatusSelect = async (value: string | number) => {
  await handleTopFieldChange("status", value);
};

const handleIntentionSelect = async (value: string | number) => {
  await handleTopFieldChange("intention", value);
};

const handleStarSelect = async (value: string | number) => {
  await handleTopFieldChange("customerStar", value);
};

const handleSinglePieceTypeSelect = async (value: string | number) => {
  await handleTopFieldChange("singlePieceType", value);
};

const handleExtraChange = async (property: string, value: unknown) => {
  if (!localCustomer.value?.id) return;

  const nextValue = value ? String(value) : "";
  if (extraForm[property] === nextValue) return;

  const extraObj = parseExtra(localCustomer.value.extra);
  if (nextValue) {
    extraObj[property] = nextValue;
  } else {
    delete extraObj[property];
  }

  extraForm[property] = nextValue;

  await saveCustomerPatch({ extra: JSON.stringify(extraObj) }, property, `已更新${EXTRA_PROPERTY_LABELS[property]}`);
};

const sortFollowRecords = (records: SysCustomerTracesData[]) => {
  return [...records].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA !== timeB) return timeA - timeB;
    return a.id - b.id;
  });
};

const loadFollowRecords = async () => {
  if (!props.customerId) return;

  try {
    const response = await getSysCustomerTracesList({
      customerId: props.customerId,
      pageNum: 1,
      pageSize: 100
    });
    followRecords.value = sortFollowRecords(response.data.list || []);
    scrollMessagesToBottom();
  } catch (error) {
    console.error("加载跟进记录失败:", error);
    followRecords.value = [];
  }
};

const handleAddRecord = async () => {
  if (!newRecord.value.trim()) {
    Message.warning("请输入跟进内容");
    return;
  }

  if (!props.customerId) {
    Message.error("客户 ID 不存在");
    return;
  }

  addingRecord.value = true;

  try {
    await createSysCustomerTraces({
      customerId: props.customerId,
      data: newRecord.value.trim()
    });
    newRecord.value = "";
    await loadFollowRecords();
    Message.success("跟进记录添加成功");
  } catch (error) {
    console.error("添加跟进记录失败:", error);
    Message.error("添加跟进记录失败");
  } finally {
    addingRecord.value = false;
  }
};

const handleClose = () => {
  visible.value = false;
  emit("close");
};

watch(
  () => props.customerData,
  customer => {
    syncLocalCustomer(customer);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.customerId,
  customerId => {
    if (customerId && props.visible) {
      loadFollowRecords();
    }
  },
  { immediate: true }
);

watch(
  () => props.visible,
  async drawerVisible => {
    if (drawerVisible) {
      if (!Object.keys(CUSTOMER_EXTRA_OPTIONS.value).length) {
        try {
          await sysConfigStore.getConfig();
        } catch (error) {
          console.error("加载资质配置失败:", error);
        }
      }

      if (props.customerId) {
        await loadFollowRecords();
      }
      scrollMessagesToBottom();
    }
  }
);
</script>

<style scoped lang="scss">
.detail-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 118px);
  background: #f7f8fa;
}

.serial-strip {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  flex-wrap: wrap;
}

.serial-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-shrink: 0;
}

.serial-label {
  color: #4e5969;
  font-size: 14px;
  flex-shrink: 0;
}

.serial-value {
  color: #1d2129;
  font-size: 20px;
  font-weight: 700;
  word-break: break-all;
}

.serial-status {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.content-shell {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 12px;
}

.left-pane,
.right-pane {
  min-height: 0;
}

.left-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-card {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 16px;
}

.panel-title {
  margin-bottom: 14px;
  color: #1d2129;
  font-size: 15px;
  font-weight: 700;
}

.panel-title--compact {
  margin-bottom: 2px;
}

.panel-title-note {
  margin-left: 10px;
  color: #86909c;
  font-size: 12px;
  font-weight: 500;
}

.customer-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-avatar {
  background: #165dff;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.customer-summary {
  min-width: 0;
}

.customer-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.customer-name {
  color: #1d2129;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  word-break: break-word;
}

.customer-sex {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background: #f2f3f5;
  border-radius: 999px;
  color: #4e5969;
  font-size: 12px;
}

.customer-phone {
  margin-top: 6px;
  color: #4e5969;
  font-size: 14px;
}

.customer-mini-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.summary-item {
  padding: 10px 12px;
  background: #f7f8fa;
  border-radius: 6px;
}

.summary-label {
  color: #86909c;
  font-size: 12px;
  margin-bottom: 4px;
}

.summary-value {
  color: #1d2129;
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
}

.qualification-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.qualification-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qualification-label {
  color: #4e5969;
  font-size: 13px;
  font-weight: 600;
}

.chat-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.chat-title-wrap {
  min-width: 0;
}

.chat-subtitle {
  color: #86909c;
  font-size: 12px;
}

.remarks-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.remark-block {
  padding: 12px;
  background: #f7f8fa;
  border-radius: 6px;
}

.remark-title {
  color: #4e5969;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.remark-content {
  color: #1d2129;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-messages {
  flex: 1;
  min-height: 560px;
  max-height: 560px;
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
}

.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.message-left {
  flex-shrink: 0;
}

.record-avatar {
  background: #14c9c9;
  color: #fff;
  font-weight: 700;
}

.message-right {
  flex: 1;
  min-width: 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
}

.message-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.message-user {
  color: #1d2129;
  font-size: 14px;
  font-weight: 700;
}

.message-time {
  color: #86909c;
  font-size: 12px;
  white-space: nowrap;
}

.message-text {
  color: #1d2129;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.empty-records {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-editor {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e6eb;
}

.chat-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chat-actions-tip {
  color: #86909c;
  font-size: 12px;
}

.dropdown-tag {
  cursor: pointer;
  display: inline-block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  line-height: 1.4;
  max-height: 2.8em;
  white-space: nowrap;
}

.dropdown-tag.multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f2f3f5;
  border-radius: 999px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 999px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a9aeb8;
}

@media (max-width: 1100px) {
  .serial-strip,
  .chat-header,
  .chat-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-shell,
  .remarks-grid {
    grid-template-columns: 1fr;
  }

  .chat-messages {
    min-height: 480px;
    max-height: 480px;
  }
}

@media (max-width: 768px) {
  .summary-grid,
  .qualification-grid {
    grid-template-columns: 1fr;
  }

  .serial-value {
    font-size: 16px;
  }

  .chat-messages {
    min-height: 380px;
    max-height: 380px;
  }
}
</style>
