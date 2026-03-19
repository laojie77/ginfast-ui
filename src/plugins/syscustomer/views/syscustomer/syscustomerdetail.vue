<template>
  <div class="customer-detail-drawer">
    <a-drawer
      v-model:visible="visible"
      title="客户详情"
      placement="right"
      :width="1200"
      :footer="false"
      @cancel="handleClose"
    >
      <div class="detail-container">
        <!-- 顶部客户基本信息 -->
        <div class="top-section">
          <a-card class="info-card" :bordered="false">
            <div class="customer-header">
              <a-avatar :size="80" style="background-color: #165dff;">
                {{ customerData?.name?.charAt(0) || 'N' }}
              </a-avatar>
              <div class="customer-basic">
                <h2>{{ customerData?.name || '未知客户' }}</h2>
                <div class="customer-tags">
                  <a-tag :color="getStatusColor(customerData?.status)">
                    {{ getStatusText(customerData?.status) }}
                  </a-tag>
                  <a-tag :color="getIntentionColor(customerData?.intention)">
                    {{ getIntentionText(customerData?.intention) }}
                  </a-tag>
                  <a-tag :color="getStarColor(customerData?.customerStar)">
                    {{ getStarText(customerData?.customerStar) }}
                  </a-tag>
                </div>
              </div>
              <div class="customer-meta">
                <div class="meta-item">
                  <span class="meta-label">客户编号</span>
                  <span class="meta-value">{{ customerData?.num || '-' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">手机号</span>
                  <span class="meta-value">{{ customerData?.mobile || '-' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">需求金额</span>
                  <span class="meta-value highlight">{{ customerData?.moneyDemand || '-' }}</span>
                </div>
              </div>
            </div>

            <a-divider style="margin: 20px 0;" />

            <div class="info-grid">
              <div class="info-item">
                <span class="label">渠道来源</span>
                <span class="value">{{ getChannelName(customerData?.channelId) }}</span>
              </div>
              <div class="info-item">
                <span class="label">跟进人</span>
                <span class="value">{{ getFollowerName(customerData?.userId) }}</span>
              </div>
              <div class="info-item">
                <span class="label">所属部门</span>
                <span class="value">{{ getDepartmentName(customerData?.departmentId) }}</span>
              </div>
              <div class="info-item">
                <span class="label">所在城市</span>
                <span class="value">{{ customerData?.city || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">性别</span>
                <span class="value">{{ getSexText(customerData?.sex) }}</span>
              </div>
              <div class="info-item">
                <span class="label">年龄</span>
                <span class="value">{{ customerData?.age || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">贷款类型</span>
                <span class="value">{{ getSinglePieceTypeText(customerData?.singlePieceType) }}</span>
              </div>
              <div class="info-item">
                <span class="label">分配时间</span>
                <span class="value">{{ formatTime(customerData?.allotTime) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">是否锁定</span>
                <a-tag :color="customerData?.isLock === 1 ? 'red' : 'green'" size="small">
                  {{ customerData?.isLock === 1 ? '已锁定' : '未锁定' }}
                </a-tag>
              </div>
              <div class="info-item">
                <span class="label">再分配</span>
                <a-tag :color="customerData?.isReassign === 1 ? 'arcoblue' : 'red'" size="small">
                  {{ customerData?.isReassign === 1 ? '是' : '否' }}
                </a-tag>
              </div>
              <div class="info-item">
                <span class="label">重复标记</span>
                <a-tag :color="customerData?.isRepeat === 1 ? 'arcoblue' : 'red'" size="small">
                  {{ customerData?.isRepeat === 1 ? '是' : '否' }}
                </a-tag>
              </div>
            </div>

            <a-divider style="margin: 20px 0;" />

            <div class="remarks-section">
              <div class="label">客户备注</div>
              <div class="remarks-content">
                {{ customerData?.remarks || '暂无备注' }}
              </div>
            </div>
          </a-card>
        </div>

        <!-- 底部内容区 -->
        <div class="bottom-section">
          <!-- 左侧客户资质 -->
          <div class="qualification-section">
            <a-card class="info-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-file />
                  <span>客户资质</span>
                </div>
              </template>
              
              <div class="qualification-list">
                <div v-for="property in ALL_EXTRA_PROPERTIES" :key="property" class="qualification-item">
                  <div class="qualification-label">{{ EXTRA_PROPERTY_LABELS[property] }}</div>
                  <div class="qualification-value">{{ getExtraPropertyDisplayValue(property) }}</div>
                </div>
              </div>
            </a-card>
          </div>

          <!-- 右侧跟进记录 -->
          <div class="follow-records">
            <a-card class="records-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-file />
                  <span>跟进记录</span>
                  <a-badge :count="followRecords.length" :offset="[10, 0]" />
                </div>
              </template>

              <div class="chat-container">
                <!-- 聊天记录列表 -->
                <div class="chat-messages" ref="messagesContainer">
                  <div 
                    v-for="record in followRecords" 
                    :key="record.id"
                    class="message-item"
                  >
                    <div class="message-header">
                      <a-avatar :size="32" style="background-color: #00d084;">
                        {{ record.userName?.charAt(0) || 'U' }}
                      </a-avatar>
                      <div class="message-info">
                        <span class="user-name">{{ record.userName || '未知用户' }}</span>
                        <span class="message-time">{{ formatTime(record.createdAt) }}</span>
                      </div>
                    </div>
                    <div class="message-content">
                      <div class="message-text">{{ record.data }}</div>
                    </div>
                  </div>

                  <div v-if="followRecords.length === 0" class="empty-records">
                    <a-empty description="暂无跟进记录" />
                  </div>
                </div>

                <!-- 输入框 -->
                <div class="chat-input">
                  <a-textarea
                    v-model="newRecord"
                    placeholder="请输入跟进记录..."
                    :rows="3"
                    :max-length="500"
                    show-word-limit
                  />
                  <div class="input-actions">
                    <a-button type="primary" @click="handleAddRecord" :loading="addingRecord">
                      <template #icon>
                        <icon-plus />
                      </template>
                      发送
                    </a-button>
                  </div>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import { 
  IconUser, 
  IconFile, 
  IconSettings, 
  IconPlus
} from '@arco-design/web-vue/es/icon';
import type { SysCustomerData } from '../../api/syscustomer';
import { formatTime } from '@/globals';
import { useSysConfigStore } from '@/store/modules/sys-config';
import { getSysCustomerTracesList, createSysCustomerTraces } from '../../../syscustomertraces/api/syscustomertraces';
import type { SysCustomerTracesData } from '../../../syscustomertraces/api/syscustomertraces';

// Props
interface Props {
  visible: boolean;
  customerId?: number;
  customerData?: SysCustomerData;
  channelOptions?: Array<{value: number, name: string}>;
  followerOptions?: Array<{value: number, name: string}>;
  departmentTree?: any[];
  statusOptions?: Array<{value: number, name: string}>;
  intentionOptions?: Array<{value: number, name: string}>;
  starOptions?: Array<{value: number, name: string}>;
  sexOptions?: Array<{value: number, name: string}>;
  singlePieceTypeOptions?: Array<{value: number, name: string}>;
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

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'close': [];
}>();

// 系统配置
const sysConfigStore = useSysConfigStore();

// Extra字段属性定义常量
const EXTRA_PROPERTIES = {
  OCCUPATION: 'occupation',
  HOUSE: 'house',
  CAR: 'car',
  CREDIT_CARD: 'creditcard',
  INSURANCE: 'insurance',
  HOUSE_FUND: 'housefund',
  SOCIAL_INSURANCE: 'socialinsurance',
  ZHIMA_SCORE: 'zhimascore',
  SALARY_MONEY: 'salarymoney',
  EDUCATION: 'education'
} as const;

const ALL_EXTRA_PROPERTIES = Object.values(EXTRA_PROPERTIES);

const EXTRA_PROPERTY_LABELS = {
  [EXTRA_PROPERTIES.OCCUPATION]: '职业',
  [EXTRA_PROPERTIES.HOUSE]: '房产',
  [EXTRA_PROPERTIES.CAR]: '车产',
  [EXTRA_PROPERTIES.CREDIT_CARD]: '信用卡',
  [EXTRA_PROPERTIES.INSURANCE]: '商业保险',
  [EXTRA_PROPERTIES.HOUSE_FUND]: '公积金',
  [EXTRA_PROPERTIES.SOCIAL_INSURANCE]: '社保',
  [EXTRA_PROPERTIES.ZHIMA_SCORE]: '芝麻分',
  [EXTRA_PROPERTIES.SALARY_MONEY]: '月薪',
  [EXTRA_PROPERTIES.EDUCATION]: '学历'
} as const;

const CUSTOMER_EXTRA_OPTIONS = computed(() => sysConfigStore.customerExtraConfig);

// 跟进记录数据
const followRecords = ref<SysCustomerTracesData[]>([]);
const newRecord = ref('');
const addingRecord = ref(false);
const messagesContainer = ref<HTMLElement>();

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 获取状态相关信息
const getStatusColor = (status?: number) => {
  if (status === undefined) return '';
  return status === 0 ? '' : status === 7 ? 'green' : 'arcoblue';
};

const getStatusText = (status?: number) => {
  return props.statusOptions.find(item => item.value === status)?.name || '未知';
};

const getIntentionColor = (intention?: number) => {
  if (intention === undefined) return '';
  return intention === 1 ? 'green' : intention === 2 ? 'red' : intention === 3 ? 'red' : 'orange';
};

const getIntentionText = (intention?: number) => {
  return props.intentionOptions.find(item => item.value === intention)?.name || '未知';
};

const getStarColor = (star?: number) => {
  if (star === undefined) return '';
  return [0, 1, 2].includes(star) ? 'red' : 'arcoblue';
};

const getStarText = (star?: number) => {
  return props.starOptions.find(item => item.value === star)?.name || '未知';
};

const getSexText = (sex?: number) => {
  return props.sexOptions.find(item => item.value === sex)?.name || '未知';
};

const getSinglePieceTypeText = (type?: number) => {
  return props.singlePieceTypeOptions.find(item => item.value === type)?.name || '-';
};

// 获取渠道名称
const getChannelName = (channelId?: number) => {
  return props.channelOptions.find(item => item.value === channelId)?.name || '-';
};

// 获取跟进人名称
const getFollowerName = (userId?: number) => {
  return props.followerOptions.find(item => item.value === userId)?.name || '-';
};

// 获取部门名称
const getDepartmentName = (departmentId?: number) => {
  if (!departmentId || !props.departmentTree.length) return '-';
  
  const findDepartmentName = (nodes: any[]): string => {
    for (const node of nodes) {
      if (node.id === departmentId) {
        return node.name;
      }
      if (node.children && node.children.length > 0) {
        const result = findDepartmentName(node.children);
        if (result) return result;
      }
    }
    return '';
  };
  
  return findDepartmentName(props.departmentTree) || '-';
};

// 获取extra属性显示值
const getExtraPropertyDisplayValue = (property: string) => {
  if (!props.customerData?.extra) return '-';
  
  try {
    const extraObj = typeof props.customerData.extra === 'string' 
      ? JSON.parse(props.customerData.extra) 
      : props.customerData.extra;
    
    const value = extraObj[property];
    if (!value) return '-';
    
    const options = CUSTOMER_EXTRA_OPTIONS.value[property];
    return options?.[value] || value;
  } catch (error) {
    console.error('解析extra字段失败:', error);
    return '-';
  }
};

// 加载跟进记录
const loadFollowRecords = async () => {
  if (!props.customerId) return;
  
  try {
    const response = await getSysCustomerTracesList({
      customerId: props.customerId,
      pageNum: 1,
      pageSize: 100
    });
    followRecords.value = response.data.list || [];
  } catch (error) {
    console.error('加载跟进记录失败:', error);
    followRecords.value = [];
  }
};

// 添加跟进记录
const handleAddRecord = async () => {
  if (!newRecord.value.trim()) {
    Message.warning('请输入跟进内容');
    return;
  }
  
  if (!props.customerId) {
    Message.error('客户ID不存在');
    return;
  }
  
  addingRecord.value = true;
  
  try {
    const recordData = {
      customerId: props.customerId,
      data: newRecord.value
      // userId 不传，后端会自动设置当前用户ID
    };
    
    await createSysCustomerTraces(recordData);
    
    // 重新加载跟进记录
    await loadFollowRecords();
    
    // 清空输入
    newRecord.value = '';
    
    // 滚动到底部
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
    
    Message.success('跟进记录添加成功');
  } catch (error) {
    console.error('添加跟进记录失败:', error);
    Message.error('添加跟进记录失败');
  } finally {
    addingRecord.value = false;
  }
};

// 关闭抽屉
const handleClose = () => {
  emit('close');
};

// 监听客户ID变化，重新加载数据
watch(() => props.customerId, (newId) => {
  if (newId && props.visible) {
    loadFollowRecords();
  }
}, { immediate: true });

// 监听抽屉显示状态
watch(() => props.visible, (visible) => {
  if (visible && props.customerId) {
    loadFollowRecords();
  }
});
</script>

<style scoped lang="scss">
.customer-detail-drawer {
  .detail-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    gap: 16px;
  }

  // 顶部基本信息区
  .top-section {
    flex-shrink: 0;

    .info-card {
      .customer-header {
        display: flex;
        align-items: center;
        gap: 24px;

        .customer-basic {
          flex: 1;

          h2 {
            margin: 0 0 12px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1d2129;
          }

          .customer-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
        }

        .customer-meta {
          display: flex;
          gap: 32px;

          .meta-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;

            .meta-label {
              font-size: 12px;
              color: #86909c;
            }

            .meta-value {
              font-size: 16px;
              font-weight: 600;
              color: #1d2129;

              &.highlight {
                color: #165dff;
                font-size: 18px;
              }
            }
          }
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px 24px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .label {
          font-size: 13px;
          color: #86909c;
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: #1d2129;
          font-weight: 500;
        }
      }

      .remarks-section {
        .label {
          font-size: 13px;
          color: #86909c;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .remarks-content {
          font-size: 14px;
          color: #1d2129;
          line-height: 1.6;
          padding: 16px;
          background: linear-gradient(135deg, #f7f8fa 0%, #ffffff 100%);
          border-left: 3px solid #165dff;
          border-radius: 6px;
          min-height: 60px;
        }
      }
    }
  }

  // 底部内容区
  .bottom-section {
    flex: 1;
    display: flex;
    gap: 16px;
    min-height: 0;
  }

  // 左侧客户资质（1/3宽度）
  .qualification-section {
    width: 33.333%;
    display: flex;
    flex-direction: column;

    .info-card {
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.arco-card-body) {
        flex: 1;
        overflow-y: auto;
      }

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 15px;
      }
    }

    .qualification-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .qualification-item {
      padding: 14px;
      background: linear-gradient(135deg, #f7f8fa 0%, #ffffff 100%);
      border-radius: 8px;
      border: 1px solid #e5e6eb;
      transition: all 0.3s ease;

      &:hover {
        border-color: #165dff;
        box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
        transform: translateY(-2px);
      }

      .qualification-label {
        font-size: 12px;
        color: #86909c;
        font-weight: 500;
        margin-bottom: 6px;
      }

      .qualification-value {
        font-size: 15px;
        color: #1d2129;
        font-weight: 600;
      }
    }
  }

  // 右侧跟进记录（2/3宽度）
  .follow-records {
    width: 66.667%;
    display: flex;
    flex-direction: column;

    .records-card {
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.arco-card-body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px;
        min-height: 0;
      }

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 15px;
      }
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      margin-bottom: 16px;
      background-color: #f9fafc;
      border-radius: 8px;

      .message-item {
        margin-bottom: 16px;
        padding: 14px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;

          .message-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;

            .user-name {
              font-size: 14px;
              font-weight: 600;
              color: #1d2129;
            }

            .message-time {
              font-size: 12px;
              color: #86909c;
            }
          }
        }

        .message-content {
          .message-text {
            font-size: 14px;
            color: #4e5969;
            line-height: 1.6;
            padding-left: 42px;
          }
        }
      }

      .empty-records {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        min-height: 200px;
      }
    }

    .chat-input {
      flex-shrink: 0;
      border-top: 2px solid #e5e6eb;
      padding-top: 16px;

      .input-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 12px;
      }
    }
  }
}

// 滚动条样式
.chat-messages::-webkit-scrollbar,
.qualification-list::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track,
.qualification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb,
.qualification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.qualification-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
