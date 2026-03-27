<template>
  <!--
    列表页和详情页都需要这组状态弹窗。
    这里保持纯展示 + 事件回传，避免子组件直接修改父级传入的对象。
  -->
  <div class="customer-trace-manage-modals">
    <a-modal
      :visible="props.statusModalVisible"
      title="更新业务阶段"
      :on-before-ok="props.onStatusSave"
      :width="props.statusModalWidth"
      @cancel="props.onStatusCancel"
    >
      <a-form :model="props.statusUpdateForm">
        <a-form-item :label="props.statusLabel">
          <a-tag size="small" :color="props.statusTagColor">
            {{ props.statusTagText }}
          </a-tag>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            :model-value="props.statusUpdateForm.progressRemark"
            placeholder="请输入进度备注"
            :rows="4"
            @update:model-value="handleStatusProgressRemarkChange"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :visible="props.validModalVisible"
      :title="props.validModalTitle"
      :on-before-ok="handleValidSave"
      :width="600"
      @cancel="props.onValidCancel"
    >
      <div class="customer-valid-header">
        <span class="customer-valid-header__title">{{ props.validModalTitle }}</span>
        <a-button type="text" :style="{ color: '#165dff' }" v-hasPerm="props.managePermission" @click="props.onManageValid">
          管理
        </a-button>
      </div>
      <a-form ref="validFormRef" :model="props.validUpdateForm">
        <a-form-item
          field="validId"
          :label="props.validModalTitle"
          :rules="[{ required: true, message: `请选择${props.validModalTitle}` }]"
        >
          <a-select
            :model-value="props.validUpdateForm.validId"
            :placeholder="`请选择${props.validModalTitle}`"
            allow-clear
            @update:model-value="handleValidIdChange"
          >
            <a-option v-for="item in props.customerValidOptions" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :visible="props.manageValidModalVisible"
      :title="`${props.validModalTitle}管理`"
      :footer="false"
      :width="800"
      @cancel="props.onCloseManageValid"
    >
      <div class="customer-valid-actions">
        <a-button type="primary" @click="props.onCreateValid">
          <template #icon>
            <icon-plus />
          </template>
          新增
        </a-button>
      </div>
      <a-table
        :data="props.customerValidList"
        :loading="props.validLoading"
        :pagination="false"
        :bordered="{ wrapper: true, cell: true }"
      >
        <template #columns>
          <a-table-column title="类型" data-index="type" :width="100">
            <template #cell="{ record }">
              <a-tag size="small">{{ getValidTypeText(record.type) }}</a-tag>
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
                <a-button size="small" @click="props.onEditValid(record)">编辑</a-button>
                <a-popconfirm content="确定要删除这条数据吗？" @ok="props.onDeleteValid(record.id)">
                  <a-button size="small" status="danger">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-modal>

    <a-modal
      :visible="props.editValidModalVisible"
      :title="props.editingValid.id ? `编辑${props.validModalTitle}` : `新增${props.validModalTitle}`"
      :on-before-ok="handleSaveValidItem"
      :width="400"
      @cancel="props.onCancelEditValid"
    >
      <a-form ref="editValidFormRef" :model="props.editingValid" :rules="props.validRules">
        <a-form-item label="类型">
          <a-input :model-value="getValidTypeText(props.editingValid.type)" disabled />
        </a-form-item>
        <a-form-item field="name" label="名称">
          <a-input
            :model-value="props.editingValid.name"
            placeholder="请输入名称"
            @update:model-value="handleEditingValidNameChange"
          />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
            :model-value="props.editingValid.status"
            placeholder="请选择状态"
            @update:model-value="handleEditingValidStatusChange"
          >
            <a-option :value="1">启用</a-option>
            <a-option :value="0">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CustomerValidData } from "@/api/customervalid";

interface FormInstanceLike {
  validate?: () => Promise<unknown>;
}

interface Props {
  statusModalVisible: boolean;
  validModalVisible: boolean;
  manageValidModalVisible: boolean;
  editValidModalVisible: boolean;
  statusUpdateForm: {
    newStatus?: number;
    progressRemark: string;
  };
  validUpdateForm: {
    validId?: number;
  };
  validModalTitle: string;
  statusLabel?: string;
  statusTagText: string;
  statusTagColor?: string;
  statusModalWidth?: number;
  managePermission?: string[];
  customerValidOptions: CustomerValidData[];
  validLoading: boolean;
  customerValidList: CustomerValidData[];
  editingValid: Partial<CustomerValidData>;
  validRules: Record<string, unknown>;
  onStatusSave: () => boolean | Promise<boolean>;
  onStatusCancel: () => void;
  onValidSave: (formInstance?: FormInstanceLike) => boolean | Promise<boolean>;
  onValidCancel: () => void;
  onManageValid: () => void;
  onCloseManageValid: () => void;
  onCreateValid: () => void;
  onEditValid: (record: CustomerValidData) => void;
  onDeleteValid: (id: number) => void | Promise<void>;
  onSaveValidItem: (formInstance?: FormInstanceLike) => boolean | Promise<boolean>;
  onCancelEditValid: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  statusLabel: "新状态",
  statusTagColor: "",
  statusModalWidth: 400,
  managePermission: () => ["plugins:syscustomersyscustomer:addValids"]
});

const emit = defineEmits<{
  "update:status-progress-remark": [value: string];
  "update:valid-id": [value: number | undefined];
  "update:editing-valid-name": [value: string];
  "update:editing-valid-status": [value: number | undefined];
}>();

const validFormRef = ref<FormInstanceLike>();
const editValidFormRef = ref<FormInstanceLike>();

const toOptionalNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

const getValidTypeText = (type?: number) => {
  if (type === 1) return "有效客户";
  if (type === 2) return "无效客户";
  if (type === 3) return "黑名单";
  return "未知";
};

const handleStatusProgressRemarkChange = (value: string | number | undefined) => {
  emit("update:status-progress-remark", String(value ?? ""));
};

const handleValidIdChange = (value: unknown) => {
  emit("update:valid-id", toOptionalNumber(value));
};

const handleEditingValidNameChange = (value: string | number | undefined) => {
  emit("update:editing-valid-name", String(value ?? ""));
};

const handleEditingValidStatusChange = (value: unknown) => {
  emit("update:editing-valid-status", toOptionalNumber(value));
};

const handleValidSave = () => props.onValidSave(validFormRef.value);

const handleSaveValidItem = () => props.onSaveValidItem(editValidFormRef.value);
</script>

<style scoped lang="scss">
.customer-valid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.customer-valid-header__title {
  font-weight: 500;
}

.customer-valid-actions {
  margin-bottom: 16px;
}
</style>
