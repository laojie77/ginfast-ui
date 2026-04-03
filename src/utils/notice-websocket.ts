import { Button, Message, Notification, Space } from "@arco-design/web-vue";
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

const resolveDownloadURL = (url: string) => {
  if (!url) {
    return "";
  }

  const baseUrl = getBaseUrl();
  const base = baseUrl || window.location.origin;
  return new URL(url, base).toString();
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

const openExportReadyNotification = (event: NoticeBusinessEvent) => {
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
          openExportReadyNotification(data);
        } else {
          noticeStore.applyBusinessEvent(data);
          if (data.title) {
            Message.info(data.title);
          }
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
