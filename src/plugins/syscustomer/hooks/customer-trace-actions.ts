import { computed, reactive, ref } from "vue";
import type { SysCustomerData, SysCustomerStatusTraceUpdateParams } from "../api/syscustomer";
import { TOP_FIELD_LABELS } from "./customer-fields.ts";
import { getCustomerValidModalTitle as resolveCustomerValidModalTitle } from "./customer-status.ts";
import {
  buildCustomerStarUpdatePayload,
  buildIntentionTraceUpdatePayload,
  buildStatusTraceUpdatePayload
} from "./status-trace.ts";

type AsyncOrSync<T> = T | Promise<T>;

type TraceFieldKey = "status" | "intention" | "customerStar";

type TraceActionRecord = Partial<Pick<SysCustomerData, "status" | "intention" | "customerStar" | "extra">> & {
  id?: number;
};

interface PersistTraceContext<TRecord extends TraceActionRecord> {
  fieldKey: TraceFieldKey;
  record: TRecord;
  payload: SysCustomerStatusTraceUpdateParams;
  successText: string;
}

interface OpenStatusChangeOptions {
  progressRemark?: string;
}

interface UseCustomerTraceActionsOptions<TRecord extends TraceActionRecord> {
  getStatusName: (value?: number | null) => string;
  getIntentionName: (value?: number | null) => string;
  getCustomerStarName: (value?: number | null) => string;
  getCustomerValidName: (validId?: number) => string;
  // 页面自己决定如何持久化以及刷新视图，hook 只负责组织交互和构造 payload。
  persistTracePayload: (payload: SysCustomerStatusTraceUpdateParams, context: PersistTraceContext<TRecord>) => AsyncOrSync<void>;
  // 某些页面会在打开有效性弹窗前加载可选项，放到这里可避免把 UI 逻辑散落到页面里。
  prepareValidOptions?: (type: number) => AsyncOrSync<void>;
}

export const useCustomerTraceActions = <TRecord extends TraceActionRecord>(options: UseCustomerTraceActionsOptions<TRecord>) => {
  const statusModalVisible = ref(false);
  const validModalVisible = ref(false);

  const activeStatusRecord = ref<TRecord>();
  const activeValidRecord = ref<TRecord>();

  const statusUpdateForm = reactive({
    currentStatus: undefined as number | undefined,
    newStatus: undefined as number | undefined,
    progressRemark: ""
  });

  const validUpdateForm = reactive({
    currentIntention: undefined as number | undefined,
    newIntention: undefined as number | undefined,
    validId: undefined as number | undefined
  });

  const validModalTitle = computed(() => resolveCustomerValidModalTitle(validUpdateForm.newIntention));

  const resetStatusForm = () => {
    statusUpdateForm.currentStatus = undefined;
    statusUpdateForm.newStatus = undefined;
    statusUpdateForm.progressRemark = "";
    activeStatusRecord.value = undefined;
  };

  const resetValidForm = () => {
    validUpdateForm.currentIntention = undefined;
    validUpdateForm.newIntention = undefined;
    validUpdateForm.validId = undefined;
    activeValidRecord.value = undefined;
  };

  const closeStatusModal = () => {
    statusModalVisible.value = false;
    resetStatusForm();
  };

  const closeValidModal = () => {
    validModalVisible.value = false;
    resetValidForm();
  };

  const persistStatusPayload = async (record: TRecord, nextStatus: number, progressRemark: string) => {
    if (!record.id) {
      return;
    }

    const payload = buildStatusTraceUpdatePayload(
      record as TRecord & { id: number },
      nextStatus,
      progressRemark,
      options.getStatusName
    );
    await options.persistTracePayload(payload, {
      fieldKey: "status",
      record,
      payload,
      successText: `已更新${TOP_FIELD_LABELS.status}`
    });
  };

  const persistIntentionPayload = async (record: TRecord, nextIntention: number, validId?: number) => {
    if (!record.id) {
      return;
    }

    const payload = buildIntentionTraceUpdatePayload(
      record as TRecord & { id: number },
      nextIntention,
      options.getIntentionName,
      options.getCustomerValidName,
      validId
    );

    await options.persistTracePayload(payload, {
      fieldKey: "intention",
      record,
      payload,
      successText: `已更新${TOP_FIELD_LABELS.intention}`
    });
  };

  const persistCustomerStarPayload = async (record: TRecord, nextCustomerStar: number) => {
    if (!record.id) {
      return;
    }

    const payload = buildCustomerStarUpdatePayload(
      record as TRecord & { id: number },
      nextCustomerStar,
      options.getCustomerStarName
    );
    await options.persistTracePayload(payload, {
      fieldKey: "customerStar",
      record,
      payload,
      successText: `已更新${TOP_FIELD_LABELS.customerStar}`
    });
  };

  const openStatusChange = (record: TRecord, newStatus: number, options: OpenStatusChangeOptions = {}) => {
    activeStatusRecord.value = record;
    statusUpdateForm.currentStatus = Number(record.status);
    statusUpdateForm.newStatus = Number(newStatus);
    statusUpdateForm.progressRemark = options.progressRemark || "";
    statusModalVisible.value = true;
  };

  const openIntentionChange = async (record: TRecord, newIntention: number) => {
    if (newIntention === 0) {
      await persistIntentionPayload(record, newIntention);
      return true;
    }

    activeValidRecord.value = record;
    validUpdateForm.currentIntention = Number(record.intention);
    validUpdateForm.newIntention = Number(newIntention);
    validUpdateForm.validId = undefined;

    await options.prepareValidOptions?.(newIntention);
    validModalVisible.value = true;
    return false;
  };

  const saveStatusChange = async () => {
    const record = activeStatusRecord.value;
    if (!record || statusUpdateForm.newStatus === undefined) {
      return false;
    }

    await persistStatusPayload(record, Number(statusUpdateForm.newStatus), statusUpdateForm.progressRemark);
    closeStatusModal();
    return true;
  };

  const saveValidChange = async () => {
    const record = activeValidRecord.value;
    if (!record || validUpdateForm.newIntention === undefined || !validUpdateForm.validId) {
      return false;
    }

    await persistIntentionPayload(record, Number(validUpdateForm.newIntention), validUpdateForm.validId);
    closeValidModal();
    return true;
  };

  const updateCustomerStar = async (record: TRecord, newCustomerStar: number) => {
    if (Number(record.customerStar) === Number(newCustomerStar)) {
      return false;
    }

    await persistCustomerStarPayload(record, Number(newCustomerStar));
    return true;
  };

  return {
    statusModalVisible,
    validModalVisible,
    statusUpdateForm,
    validUpdateForm,
    validModalTitle,
    openStatusChange,
    openIntentionChange,
    saveStatusChange,
    saveValidChange,
    updateCustomerStar,
    closeStatusModal,
    closeValidModal
  };
};
