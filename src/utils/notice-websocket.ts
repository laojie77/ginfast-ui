import { Button, Message, Modal, Notification, Space } from "@arco-design/web-vue";
import { getBaseUrl } from "@/api/utils";
import { downloadAffixAPI } from "@/api/file";
import { getAccessToken, hasRefreshToken } from "@/utils/auth";
import {
  type NoticeBusinessEvent,
  useNoticeStoreHook,
  type NoticeRealtimePublishedPayload,
  type NoticeRealtimeRevokedPayload,
  type NoticeRealtimeSyncPayload,
  type NoticeRealtimeUnreadPayload
} from "@/store/modules/notice";
import { openRealtimeNoticeDetail } from "@/utils/notice-detail-modal";
import { useUserStoreHook } from "@/store/modules/user";
import router from "@/router";
import { h } from "vue";

interface SocketMessage<T = any> {
  type: string;
  message?: string;
  data?: T;
  timestamp?: number;
}

const affixListRoute = "/system/affix";
const exportNotificationDedupWindow = 15000;
const exportNotificationShownAt = new Map<string, number>();

export const customerExportTaskNoticeEventName = "customer-export-task-notice";
export const customerImportTaskNoticeEventName = "customer-import-task-notice";

export const buildCustomerImportNotificationId = (batchId: number) => `customer-import-task:${batchId}`;

export interface CustomerExportTaskNoticeDetail {
  taskId: number;
  status: "success" | "failed";
  affixId?: number;
  fileName?: string;
  total?: number;
  errorMessage?: string;
  timestamp?: number;
}

export interface CustomerImportTaskNoticeDetail {
  batchId: number;
  status: "pending" | "running" | "canceling" | "canceled" | "success" | "partial" | "failed";
  startRow: number;
  resumeRow?: number;
  interrupted: boolean;
  totalCount?: number;
  processedCount?: number;
  successCount?: number;
  failedCount?: number;
  duplicateCount?: number;
  progress?: number;
  fileName?: string;
  remark?: string;
  errorMessage?: string;
  timestamp?: number;
}

const buildImportCountSummary = (successCount: number, failedCount: number, duplicateCount: number) => {
  const parts = [`导入成功 ${successCount} 条`, `导入失败 ${failedCount} 条`];
  if (duplicateCount > 0) {
    parts.push(`重复数据：${duplicateCount}`);
  }
  return `${parts.join("，")}。`;
};

const buildAcknowledgeNotificationFooter = (handleAcknowledge: () => void) => () =>
  h(
    Space,
    { size: "mini" },
    {
      default: () => [
        h(
          Button,
          {
            type: "primary",
            size: "mini",
            onClick: handleAcknowledge
          },
          {
            default: () => "我知道了"
          }
        )
      ]
    }
  );

const buildExportNotificationDedupKey = (event: NoticeBusinessEvent, fallbackPrefix: string) => {
  const taskId = Number(event.extra?.taskId || 0);
  const affixId = Number(event.extra?.affixId || event.action?.value || 0);
  if (taskId > 0) {
    return `${fallbackPrefix}:task:${taskId}`;
  }
  if (affixId > 0) {
    return `${fallbackPrefix}:affix:${affixId}`;
  }
  if (event.id) {
    return `${fallbackPrefix}:event:${event.id}`;
  }
  return `${fallbackPrefix}:title:${String(event.title || "").trim()}`;
};

const canOpenExportNotification = (key: string) => {
  const now = Date.now();
  for (const [existingKey, shownAt] of exportNotificationShownAt.entries()) {
    if (now - shownAt > exportNotificationDedupWindow) {
      exportNotificationShownAt.delete(existingKey);
    }
  }

  const lastShownAt = exportNotificationShownAt.get(key);
  if (lastShownAt && now - lastShownAt < exportNotificationDedupWindow) {
    return false;
  }

  exportNotificationShownAt.set(key, now);
  return true;
};

const emitCustomerExportTaskNotice = (event: NoticeBusinessEvent, status: CustomerExportTaskNoticeDetail["status"]) => {
  if (typeof window === "undefined") {
    return;
  }

  const taskId = Number(event.extra?.taskId || 0);
  if (!Number.isFinite(taskId) || taskId <= 0) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CustomerExportTaskNoticeDetail>(customerExportTaskNoticeEventName, {
      detail: {
        taskId,
        status,
        affixId: Number(event.extra?.affixId || event.action?.value || 0) || undefined,
        fileName: String(event.extra?.fileName || "").trim() || undefined,
        total: Number(event.extra?.total || 0) || undefined,
        errorMessage: String(event.extra?.reason || event.content || "").trim() || undefined,
        timestamp: event.timestamp
      }
    })
  );
};

const emitCustomerImportTaskNotice = (event: NoticeBusinessEvent) => {
  if (typeof window === "undefined") {
    return;
  }

  const batchId = Number(event.extra?.batchId || 0);
  if (!Number.isFinite(batchId) || batchId <= 0) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CustomerImportTaskNoticeDetail>(customerImportTaskNoticeEventName, {
      detail: {
        batchId,
        status: String(event.extra?.status || "pending") as CustomerImportTaskNoticeDetail["status"],
        startRow: Number(event.extra?.startRow || 2) || 2,
        resumeRow: Number(event.extra?.resumeRow || 0) || undefined,
        interrupted: Boolean(event.extra?.interrupted),
        totalCount: Number(event.extra?.totalCount || 0) || undefined,
        processedCount: Number(event.extra?.processedCount || 0) || undefined,
        successCount: Number(event.extra?.successCount || 0) || undefined,
        failedCount: Number(event.extra?.failedCount || 0) || undefined,
        duplicateCount: Number(event.extra?.duplicateCount || 0) || undefined,
        progress: Number(event.extra?.progress || 0) || undefined,
        fileName: String(event.extra?.fileName || "").trim() || undefined,
        remark: String(event.extra?.remark || "").trim() || undefined,
        errorMessage: String(event.extra?.errorMessage || event.content || "").trim() || undefined,
        timestamp: event.timestamp
      }
    })
  );
};

const resolveDownloadURL = (url: string) => {
  if (!url) {
    return "";
  }

  const baseUrl = getBaseUrl();
  const base = baseUrl || window.location.origin;
  return new URL(url, base).toString();
};

const buildExportReadyNotificationTitle = (event: NoticeBusinessEvent) => {
  const baseTitle = String(event.title || "导出完成").trim() || "导出完成";
  const total = Number(event.extra?.total || 0);
  if (!Number.isFinite(total) || total <= 0) {
    return baseTitle;
  }

  return `${baseTitle}：${total}条`;
};

const downloadExportAffix = async (event: NoticeBusinessEvent) => {
  const affixId = Number(event.action?.value || event.extra?.affixId);
  if (!Number.isFinite(affixId) || affixId <= 0) {
    Message.error("导出文件信息不完整");
    return;
  }

  try {
    const response = await downloadAffixAPI(affixId);
    const fileURL = resolveDownloadURL(response.data.url);
    if (!fileURL) {
      Message.error("导出文件地址无效");
      return;
    }

    const link = document.createElement("a");
    link.href = fileURL;
    if (response.data.name) {
      link.setAttribute("download", response.data.name);
    }
    link.click();
  } catch (error) {
    console.error("download export affix failed:", error);
    Message.error("下载导出文件失败，请稍后重试");
  }
};

export const openExportReadyNotification = (event: NoticeBusinessEvent) => {
  const dedupKey = buildExportNotificationDedupKey(event, "export_ready");
  if (!canOpenExportNotification(dedupKey)) {
    return;
  }

  let notificationRef: { close: () => void } | undefined;
  const fileName = String(event.extra?.fileName || "").trim();

  const handleViewList = () => {
    notificationRef?.close();
    router.push(affixListRoute);
  };

  const handleDownload = async () => {
    await downloadExportAffix(event);
    notificationRef?.close();
  };

  event.title = buildExportReadyNotificationTitle(event);

  notificationRef = Notification.success({
    title: event.title || "导出完成",
    content: fileName || "导出文件已生成",
    position: "bottomRight",
    duration: 0,
    closable: true,
    footer: () =>
      h(
        Space,
        { size: "mini" },
        {
          default: () => [
            h(
              Button,
              {
                size: "mini",
                onClick: handleViewList
              },
              {
                default: () => "查看列表"
              }
            ),
            h(
              Button,
              {
                type: "primary",
                size: "mini",
                onClick: handleDownload
              },
              {
                default: () => "直接下载"
              }
            )
          ]
        }
      )
  });
};

export const openExportFailedNotification = (event: NoticeBusinessEvent) => {
  const dedupKey = buildExportNotificationDedupKey(event, "export_failed");
  if (!canOpenExportNotification(dedupKey)) {
    return;
  }

  Modal.error({
    title: event.title || "导出失败",
    content: event.content || "导出任务执行失败，请稍后重试。",
    okText: "确定",
    hideCancel: true,
    closable: true
  });
};

export const openImportResultNotification = (event: NoticeBusinessEvent) => {
  const batchId = Number(event.extra?.batchId || 0);
  const dedupKey = batchId > 0 ? `import_result:batch:${batchId}` : `import_result:title:${String(event.title || "").trim()}`;
  if (!canOpenExportNotification(dedupKey)) {
    return;
  }

  const status = String(event.extra?.status || "");
  const successCount = Number(event.extra?.successCount || 0);
  const failedCount = Number(event.extra?.failedCount || 0);
  const duplicateCount = Number(event.extra?.duplicateCount || 0);
  const countSummary =
    successCount > 0 || failedCount > 0 || duplicateCount > 0
      ? buildImportCountSummary(successCount, failedCount, duplicateCount)
      : "";
  const errorDetail = String(event.extra?.errorMessage || "").trim();
  const fallbackDetail = String(event.content || "").trim();
  const content = errorDetail || countSummary || fallbackDetail || "客户导入任务已完成";
  let notificationRef: { close: () => void } | undefined;
  const handleAcknowledge = () => {
    notificationRef?.close();
  };
  const baseConfig = {
    title: event.title || "客户导入完成",
    content,
    id: batchId > 0 ? buildCustomerImportNotificationId(batchId) : undefined,
    position: "bottomRight" as const,
    closable: true,
    duration: 0,
    footer: buildAcknowledgeNotificationFooter(handleAcknowledge)
  };

  if (status === "failed") {
    notificationRef = Notification.error(baseConfig);
    return;
  }
  if (status === "partial") {
    notificationRef = Notification.warning(baseConfig);
    return;
  }
  notificationRef = Notification.success(baseConfig);
};

class NoticeWebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private manualClose = false;

  ensureConnected() {
    if (typeof window === "undefined") {
      return;
    }
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = getAccessToken()?.accessToken;
    const account = useUserStoreHook().account;
    if (!token || !account.id) {
      return;
    }

    const noticeStore = useNoticeStoreHook();
    noticeStore.setConnectionStatus("connecting");
    this.manualClose = false;

    const socket = new WebSocket(this.buildURL(token));
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      noticeStore.setConnectionStatus("connected");
      this.send({ type: "sync" });
    };

    socket.onmessage = event => {
      this.handleMessage(event.data);
    };

    socket.onerror = () => {
      noticeStore.setConnectionStatus("error");
    };

    socket.onclose = () => {
      if (this.socket === socket) {
        this.socket = null;
      }

      if (this.manualClose) {
        noticeStore.setConnectionStatus("disconnected");
        return;
      }

      noticeStore.setConnectionStatus("error");
      this.scheduleReconnect();
    };
  }

  disconnect() {
    this.manualClose = true;
    this.clearReconnectTimer();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    useNoticeStoreHook().setConnectionStatus("disconnected");
  }

  requestSync() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.send({ type: "sync" });
      return;
    }
    this.ensureConnected();
  }

  private send(payload: Record<string, any>) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(JSON.stringify(payload));
  }

  private handleMessage(raw: string) {
    const noticeStore = useNoticeStoreHook();

    let payload: SocketMessage;
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      console.warn("notice websocket parse error:", error);
      return;
    }

    switch (payload.type) {
      case "connected":
        noticeStore.setConnectionStatus("connected");
        break;
      case "notice_sync":
        noticeStore.syncFromServer((payload.data || {}) as NoticeRealtimeSyncPayload);
        break;
      case "notice_published": {
        const data = (payload.data || {}) as NoticeRealtimePublishedPayload;
        noticeStore.applyPublished(data);
        if (data.notice) {
          openRealtimeNoticeDetail(data.notice);
        }
        break;
      }
      case "notice_revoked":
        noticeStore.applyRevoked((payload.data || {}) as NoticeRealtimeRevokedPayload);
        break;
      case "notice_read": {
        const data = (payload.data || {}) as NoticeRealtimeUnreadPayload;
        if (data.noticeId) {
          noticeStore.applyRead(data.noticeId, data.unreadCount);
        } else {
          noticeStore.setUnreadCount(data.unreadCount || 0, "notice_read");
        }
        break;
      }
      case "notice_all_read": {
        const data = (payload.data || {}) as NoticeRealtimeUnreadPayload;
        noticeStore.applyAllRead(data.unreadCount || 0);
        break;
      }
      case "business_notice": {
        const data = (payload.data || {}) as NoticeBusinessEvent;
        if (data.scene === "export_download") {
          emitCustomerExportTaskNotice(data, "success");
          openExportReadyNotification(data);
          break;
        }
        if (data.scene === "export_failed") {
          emitCustomerExportTaskNotice(data, "failed");
          openExportFailedNotification(data);
          break;
        }
        if (data.scene === "export_queue") {
          break;
        }
        if (data.scene === "customer_import_progress") {
          emitCustomerImportTaskNotice(data);
          break;
        }
        if (data.scene === "customer_import_result") {
          emitCustomerImportTaskNotice(data);
          openImportResultNotification(data);
          break;
        }

        noticeStore.applyBusinessEvent(data);
        if (data.title) {
          Message.info(data.title);
        } else {
          Message.info("收到新的业务提醒");
        }
        break;
      }
      case "error":
        if (payload.message) {
          Message.warning(payload.message);
        }
        break;
      case "pong":
      default:
        break;
    }
  }

  private scheduleReconnect() {
    if (this.manualClose || this.reconnectTimer || !hasRefreshToken()) {
      return;
    }

    const delay = Math.min(10000, 2000 * (this.reconnectAttempts + 1));
    this.reconnectAttempts += 1;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.ensureConnected();
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private buildURL(token: string) {
    const origin = window.location.origin;
    const baseUrl = getBaseUrl();
    const base = baseUrl ? new URL(baseUrl, origin) : new URL(origin);
    const url = new URL("/api/plugins/sysnotice/ws", base);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.searchParams.set("token", token);
    return url.toString();
  }
}

export const noticeWebSocketClient = new NoticeWebSocketClient();
