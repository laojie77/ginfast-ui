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
              <a-tooltip :content="getIntentionDisplayText()" position="top">
                <a-tag
                  size="small"
                  :color="getIntentionColor(localCustomer?.intention)"
                  :class="['dropdown-tag', getIntentionDisplayText().length > 20 ? 'multiline' : '']"
                >
                  {{ getIntentionDisplayText() }}
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
                <a-tag
                  size="small"
                  :color="getSinglePieceTypeColor(localCustomer?.singlePieceType)"
                  :class="['dropdown-tag', getSinglePieceTypeDisplayText().length > 20 ? 'multiline' : '']"
                >
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
                    <a-tooltip :content="localCustomer?.isLock === 1 ? '点击解锁客户' : '点击锁定客户'" position="top">
                      <a-tag 
                        :color="localCustomer?.isLock === 1 ? 'red' : 'green'" 
                        size="small"
                        @click="handleToggleLock"
                        style="cursor: pointer;"
                      >
                        {{ localCustomer?.isLock === 1 ? "已锁定" : "未锁定" }}
                      </a-tag>
                    </a-tooltip>
                    <a-tag :color="localCustomer?.isRepeat === 1 ? 'red' : 'gray'" size="small">
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
            <div class="remarks-grid">
              <div class="remark-block">
                <div class="remark-title">客户备注</div>
                <div class="remark-content">
                  <template v-if="localCustomer?.remarks">
                    <div 
                      v-for="(remark, index) in formatRemarks(localCustomer.remarks)" 
                      :key="index" 
                      class="remark-item"
                    >
                      <div class="remark-header">
                        <span class="remark-time">{{ remark.time }} - {{ remark.name }}</span>
                      </div>
                      <div class="remark-text">{{ remark.text }}</div>
                    </div>
                  </template>
                  <div v-else class="remark-empty">暂无备注</div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-pane">
            <div class="panel-card chat-panel">
              <div class="remarks-grid">
                <div class="remark-block">
                  <div class="remark-title">上级评价</div>
                  <div class="remark-content">
                    {{ localCustomer?.customerComment || "暂无评价" }}
                  </div>
                </div>
              </div>
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
      <a-modal
        v-model:visible="statusModalVisible"
        :title="getStatusModalTitle()"
        :on-before-ok="handleStatusSave"
        @cancel="handleStatusCancel"
        :width="420"
      >
        <a-form :model="statusUpdateForm">
          <a-form-item :label="TOP_FIELD_LABELS.status">
            <a-tag size="small" :color="getStatusColor(statusUpdateForm.newStatus)">
              {{ getStatusText(statusUpdateForm.newStatus) }}
            </a-tag>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea v-model="statusUpdateForm.progressRemark" placeholder="请输入进度备注" :rows="4" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="validModalVisible"
        :title="getValidModalTitle()"
        :on-before-ok="handleValidSave"
        @cancel="handleValidCancel"
        :width="600"
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
          <span style="font-weight: 500">{{ getValidModalTitle() }}</span>
          <a-button
            type="text"
            @click="handleManageValid"
            style="color: #165dff"
            v-hasPerm="['plugins:syscustomersyscustomer:addValids']"
            >管理</a-button
          >
        </div>
        <a-form :model="validUpdateForm" ref="validFormRef">
          <a-form-item
            field="validId"
            :label="getValidModalTitle()"
            :rules="[{ required: true, message: `请选择${getValidModalTitle()}` }]"
          >
            <a-select v-model="validUpdateForm.validId" :placeholder="`请选择${getValidModalTitle()}`" allow-clear>
              <a-option v-for="item in customerValidOptions" :key="item.id" :value="item.id">{{ item.name }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 客户有效性标签管理弹窗 -->
      <a-modal v-model:visible="manageValidModalVisible" :title="getValidModalTitle() + '管理'" :footer="false" :width="800">
        <div style="margin-bottom: 16px">
          <a-button type="primary" @click="handleCreateValid">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
        </div>
        <a-table :data="customerValidList" :loading="validLoading" :pagination="false" :bordered="{ wrapper: true, cell: true }">
          <template #columns>
            <a-table-column title="类型" data-index="type" :width="100">
              <template #cell="{ record }">
                <a-tag size="small">
                  {{ record.type === 1 ? "有效客户" : record.type === 2 ? "无效客户" : record.type === 3 ? "黑名单" : "未知" }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="名称" data-index="name" />
            <a-table-column title="状态" data-index="status" :width="100">
              <template #cell="{ record }">
                <a-tag size="small" :color="record.status === 1 ? 'green' : 'red'">
                  {{ record.status === 1 ? "启用" : "禁用" }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="150">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleEditValid(record)">编辑</a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDeleteValid(record.id)">
                    <a-button size="small" status="danger">删除</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <!-- 客户有效性标签编辑弹窗 -->
      <a-modal
        v-model:visible="editValidModalVisible"
        :title="editingValid.id ? `编辑${getValidModalTitle()}` : `新增${getValidModalTitle()}`"
        :on-before-ok="handleSaveValid"
        @cancel="handleCancelEditValid"
        :width="400"
      >
        <a-form :model="editingValid" :rules="validRules" ref="editValidFormRef">
          <a-form-item label="类型">
            <a-input
              :model-value="
                editingValid.type === 1
                  ? '有效客户'
                  : editingValid.type === 2
                    ? '无效客户'
                    : editingValid.type === 3
                      ? '黑名单'
                      : '未知'
              "
              disabled
            />
          </a-form-item>
          <a-form-item field="name" label="名称">
            <a-input v-model="editingValid.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-select v-model="editingValid.status" placeholder="请选择状态">
              <a-option :value="1">启用</a-option>
              <a-option :value="0">禁用</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { getCustomerValidList, createCustomerValid, updateCustomerValid, deleteCustomerValid, type CustomerValidData } from "@/api/customervalid";
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
const statusModalVisible = ref(false);
const validModalVisible = ref(false);
const validOptionsLoading = ref(false);
const customerValidOptions = ref<CustomerValidData[]>([]);
const allCustomerValidOptionsMap = ref<Map<number, CustomerValidData>>(new Map());

// 客户有效性标签管理相关
const manageValidModalVisible = ref(false);
const editValidModalVisible = ref(false);
const editValidFormRef = ref();
const validLoading = ref(false);
const customerValidList = ref<CustomerValidData[]>([]);
const editingValid = reactive<Partial<CustomerValidData>>({
  id: undefined,
  type: 1,
  name: "",
  status: 1
});

const validRules = {
  name: [{ required: true, message: "请输入名称" }],
  status: [{ required: true, message: "请选择状态" }]
};
const statusUpdateForm = reactive<{
  currentStatus?: number;
  newStatus?: number;
  progressRemark: string;
}>({
  currentStatus: undefined,
  newStatus: undefined,
  progressRemark: ""
});
const validUpdateForm = reactive<{
  currentIntention?: number;
  newIntention?: number;
  validId?: number;
}>({
  currentIntention: undefined,
  newIntention: undefined,
  validId: undefined
});

// 格式化备注内容，按逗号分割并解析时间戳和内容
const formatRemarks = (remarks: string) => {
  if (!remarks || !remarks.trim()) return [];
  
  // 按逗号分割，过滤空字符串
  const remarkItems = remarks.split(',').filter(item => item.trim());
  
  return remarkItems.map(item => {
    const trimmedItem = item.trim();
    
    // 尝试解析格式：时间戳 - 姓名：内容
    const timeSeparatorIndex = trimmedItem.indexOf(' - ');
    const nameSeparatorIndex = trimmedItem.indexOf('：');
    
    if (timeSeparatorIndex !== -1 && nameSeparatorIndex !== -1 && nameSeparatorIndex > timeSeparatorIndex) {
      const time = trimmedItem.substring(0, timeSeparatorIndex).trim();
      const name = trimmedItem.substring(timeSeparatorIndex + 3, nameSeparatorIndex).trim();
      const text = trimmedItem.substring(nameSeparatorIndex + 1).trim();
      
      return {
        time: time,
        name: name,
        text: text
      };
    } else {
      // 如果格式不匹配，直接显示整个内容
      return {
        time: '',
        name: '',
        text: trimmedItem
      };
    }
  });
};

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

const getProgressRemark = () => {
  const extraObj = parseExtra(localCustomer.value?.extra);
  let progressRemark = String(extraObj.progress_remark || "").trim();
  
  // 移除可能的多余连字符（与列表视图保持一致）
  progressRemark = progressRemark.replace(/\s*-\s*$/, "");
  
  return progressRemark;
};

const getIntentionValidId = () => {
  const extraObj = parseExtra(localCustomer.value?.extra);
  const validId = Number(extraObj.intention_valid_id);
  return Number.isFinite(validId) && validId > 0 ? validId : undefined;
};

const getStatusDisplayText = () => {
  const statusName = getStatusText(localCustomer.value?.status);
  const progressRemark = getProgressRemark();
  return progressRemark ? `${statusName} - ${progressRemark}` : statusName;
};

const getIntentionDisplayText = () => {
  const intentionName = getIntentionText(localCustomer.value?.intention);
  if (Number(localCustomer.value?.intention) === 0) {
    return intentionName;
  }

  const validId = getIntentionValidId();
  const validName = validId ? allCustomerValidOptionsMap.value.get(validId)?.name || "" : "";
  return validName ? `${intentionName} - ${validName}` : intentionName;
};

const getSinglePieceTypeDisplayText = () => {
  if (localCustomer.value?.singlePieceType === undefined || localCustomer.value?.singlePieceType === null) {
    return "贷款类型：未设置";
  }

  const typeName = getSinglePieceTypeText(localCustomer.value?.singlePieceType);
  return `贷款类型：${typeName === "-" ? "未知" : typeName}`;
};

const getStatusModalTitle = () => {
  return statusUpdateForm.currentStatus === statusUpdateForm.newStatus ? "添加/修改进度备注" : "更新业务阶段";
};

const getValidModalTitle = () => {
  switch (validUpdateForm.newIntention) {
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
  const newStatus = Number(value);
  const currentStatus = Number(localCustomer.value?.status);
  
  if (newStatus === currentStatus) {
    // 相同状态，打开备注弹窗
    statusUpdateForm.currentStatus = currentStatus;
    statusUpdateForm.newStatus = newStatus;
    statusUpdateForm.progressRemark = getProgressRemark();
    statusModalVisible.value = true;
  } else {
    // 不同状态，打开状态变更弹窗
    statusUpdateForm.currentStatus = currentStatus;
    statusUpdateForm.newStatus = newStatus;
    statusUpdateForm.progressRemark = "";
    statusModalVisible.value = true;
  }
};

const handleIntentionSelect = async (value: string | number) => {
  const newIntention = Number(value);
  const currentIntention = Number(localCustomer.value?.intention);
  
  if (newIntention === 0) {
    // intention=0 待确认，不弹窗，直接更新
    await handleTopFieldChange("intention", value);
    return;
  }
  
  // 设置表单数据（不缓存上次选择，直接重置）
  validUpdateForm.currentIntention = currentIntention;
  validUpdateForm.newIntention = newIntention;
  validUpdateForm.validId = undefined; // 重置选择，让用户重新选择
  
  // 从已加载的所有选项中筛选对应类型
  filterCustomerValidOptions(newIntention);
  validModalVisible.value = true;
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

const handleStatusSave = async () => {
  if (!localCustomer.value?.id) {
    Message.error("客户信息不存在");
    return false;
  }

  try {
    // 更新状态
    if (statusUpdateForm.newStatus !== undefined) {
      await handleTopFieldChange("status", statusUpdateForm.newStatus);
    }

    // 更新进度备注
    const extraObj = parseExtra(localCustomer.value.extra);
    if (statusUpdateForm.progressRemark.trim()) {
      extraObj.progress_remark = statusUpdateForm.progressRemark.trim();
    } else {
      delete extraObj.progress_remark;
    }

    await saveCustomerPatch({ extra: JSON.stringify(extraObj) }, "progress_remark", "已更新进度备注");
    
    statusModalVisible.value = false;
    return true;
  } catch (error) {
    console.error("保存业务阶段失败:", error);
    Message.error("保存业务阶段失败");
    return false;
  }
};

const handleValidSave = async () => {
  if (!localCustomer.value?.id) {
    Message.error("客户信息不存在");
    return false;
  }

  if (!validUpdateForm.validId) {
    Message.error("请选择有效说明");
    return false;
  }

  try {
    // 更新客户有效性
    if (validUpdateForm.newIntention !== undefined) {
      await handleTopFieldChange("intention", validUpdateForm.newIntention);
    }

    // 更新有效说明ID
    const extraObj = parseExtra(localCustomer.value.extra);
    extraObj.intention_valid_id = validUpdateForm.validId;

    await saveCustomerPatch({ extra: JSON.stringify(extraObj) }, "intention_valid_id", "已更新有效说明");
    
    validModalVisible.value = false;
    return true;
  } catch (error) {
    console.error("保存客户有效失败:", error);
    Message.error("保存客户有效失败");
    return false;
  }
};

const handleStatusCancel = () => {
  statusModalVisible.value = false;
  statusUpdateForm.currentStatus = undefined;
  statusUpdateForm.newStatus = undefined;
  statusUpdateForm.progressRemark = "";
};

const handleValidCancel = () => {
  validModalVisible.value = false;
  validUpdateForm.currentIntention = undefined;
  validUpdateForm.newIntention = undefined;
  validUpdateForm.validId = undefined;
};

// 打开客户有效性标签管理
const handleManageValid = () => {
  // 加载对应类型的客户有效性标签列表
  loadCustomerValidListByType(validUpdateForm.newIntention);
  manageValidModalVisible.value = true;
};

// 加载指定类型的客户有效性标签列表
const loadCustomerValidListByType = async (type?: number) => {
  validLoading.value = true;
  try {
    const params: any = { pageSize: 100 };
    if (type) {
      params.type = type;
    }
    const response = await getCustomerValidList(params);
    customerValidList.value = response.data.list || [];
  } catch (error) {
    console.error("加载客户有效性标签列表失败:", error);
    customerValidList.value = [];
  } finally {
    validLoading.value = false;
  }
};

// 创建客户有效性标签
const handleCreateValid = () => {
  Object.assign(editingValid, {
    id: undefined,
    type: validUpdateForm.newIntention || 1,
    name: "",
    status: 1
  });
  editValidModalVisible.value = true;
};

// 编辑客户有效性标签
const handleEditValid = (record: CustomerValidData) => {
  Object.assign(editingValid, record);
  editValidModalVisible.value = true;
};

// 删除客户有效性标签
const handleDeleteValid = async (id: number) => {
  try {
    await deleteCustomerValid(id);
    Message.success("删除成功");
    await loadCustomerValidListByType(validUpdateForm.newIntention);
    // 重新加载所有标签映射
    await loadAllCustomerValidOptions();
    // 如果当前正在选择有效性标签，重新加载选项
    if (validModalVisible.value && validUpdateForm.newIntention) {
      filterCustomerValidOptions(validUpdateForm.newIntention);
    }
  } catch (error) {
    console.error("删除失败:", error);
    Message.error("删除失败");
  }
};

// 保存客户有效性标签
const handleSaveValid = async () => {
  try {
    const form = editValidFormRef.value;
    if (!form) {
      return false;
    }
    
    const errors = await form.validate();
    if (errors) {
      return false;
    }
    
    if (editingValid.id) {
      // 编辑
      await updateCustomerValid(editingValid.id, editingValid);
      Message.success("编辑成功");
    } else {
      // 新增
      await createCustomerValid(editingValid);
      Message.success("新增成功");
    }
    
    // 重新加载列表
    await loadCustomerValidListByType(validUpdateForm.newIntention);
    // 重新加载所有标签映射
    await loadAllCustomerValidOptions();
    // 如果当前正在选择有效性标签，重新加载选项
    if (validModalVisible.value && validUpdateForm.newIntention) {
      filterCustomerValidOptions(validUpdateForm.newIntention);
    }
    
    editValidModalVisible.value = false;
    return true;
  } catch (error) {
    console.error("保存失败:", error);
    Message.error("保存失败");
    return false;
  }
};

// 取消编辑客户有效性标签
const handleCancelEditValid = () => {
  editValidModalVisible.value = false;
  Object.assign(editingValid, {
    id: undefined,
    type: 1,
    name: "",
    status: 1
  });
};

// 切换锁定状态
const handleToggleLock = async () => {
  if (!localCustomer.value?.id) {
    Message.error("客户信息不存在");
    return;
  }

  try {
    const newLockStatus = localCustomer.value.isLock === 1 ? 0 : 1;
    
    // 更新本地数据
    localCustomer.value.isLock = newLockStatus;
    
    // 调用API更新数据 - 传递完整的对象而不是单独的参数
    await updateSysCustomer({ ...localCustomer.value, isLock: newLockStatus });
    
    if (newLockStatus === 1) {
      Message.success(`已锁定客户：${localCustomer.value.name}`);
    } else {
      Message.success(`已解锁客户：${localCustomer.value.name}`);
    }
    
    // 通知父组件数据已更新
    emit("updated", localCustomer.value);
  } catch (error) {
    console.error("切换锁定状态失败:", error);
    Message.error("切换锁定状态失败");
  }
};

const filterCustomerValidOptions = (type?: number) => {
  if (!allCustomerValidOptionsMap.value.size) {
    customerValidOptions.value = [];
    return;
  }
  
  // 从已加载的所有选项中筛选对应类型
  const allOptions = Array.from(allCustomerValidOptionsMap.value.values());
  if (type === undefined) {
    customerValidOptions.value = allOptions;
  } else {
    customerValidOptions.value = allOptions.filter(item => item.type === type);
  }
};

const loadAllCustomerValidOptions = async () => {
  try {
    // 加载所有类型的客户有效性选项（不限制type）
    const response = await getCustomerValidList({ 
      status: 1,
      pageSize: 1000 
    });
    const allOptions = response.data.list || [];
    allCustomerValidOptionsMap.value = new Map(allOptions.map(item => [item.id, item]));
  } catch (error) {
    console.error("加载客户有效选项失败:", error);
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
      await loadAllCustomerValidOptions();
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
  margin-bottom: 14px;
}

.remark-block {
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e8ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.remark-title {
  color: #1d2129;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8ecef;
}

.remark-content {
  color: #1d2129;
  font-size: 14px;
  line-height: 1.6;
}

.remark-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}

.remark-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.remark-item:first-child {
  padding-top: 0;
}

.remark-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.remark-time {
  color: #86909c;
  font-size: 12px;
  font-weight: 500;
  background: #f2f3f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.remark-text {
  color: #4e5969;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}

.remark-empty {
  color: #86909c;
  font-size: 13px;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
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
