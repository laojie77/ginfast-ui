import { defineStore } from "pinia";
import { ref } from "vue";
import pinia from "@/store";

export type NoticeConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface NoticeRealtimePreview {
  recipientId: number;
  noticeId: number;
  title: string;
  content: string;
  type: number;
  level: string;
  publishTime?: string;
  readStatus: number;
}

export interface NoticeRealtimeSyncPayload {
  userId: number;
  tenantId: number;
  unreadCount: number;
  recent: NoticeRealtimePreview[];
}

export interface NoticeRealtimePublishedPayload {
  notice: NoticeRealtimePreview;
  unreadCount: number;
}

export interface NoticeRealtimeUnreadPayload {
  unreadCount: number;
  reason?: string;
  noticeId?: number;
}

export interface NoticeRealtimeRevokedPayload {
  noticeId: number;
  unreadCount: number;
}

export interface NoticeBusinessAction {
  label?: string;
  kind?: string;
  value?: string;
  openMode?: string;
}

export interface NoticeBusinessEvent {
  id: string;
  scene: string;
  title: string;
  content: string;
  level?: string;
  noticeId?: number;
  timestamp?: number;
  action?: NoticeBusinessAction;
  extra?: Record<string, any>;
}

// 站内通知弹窗的“最近通知预览”最大保留条数。
// 这里控制的是右上角弹窗里可滚动查看的通知数量，不是总未读数上限。
const noticeRecentLimit = 15;

// 业务提醒分组单独保留的最大条数。
// 业务提醒和站内通知不是同一份列表，单独限制可以避免弹窗被提醒卡片挤满。
const businessRecentLimit = 8;

export const useNoticeStore = defineStore("notice", () => {
  const unreadCount = ref<number>(0);
  const recentNotices = ref<NoticeRealtimePreview[]>([]);
  const recentBusinessEvents = ref<NoticeBusinessEvent[]>([]);
  const businessUnreadCount = ref<number>(0);
  const connectionStatus = ref<NoticeConnectionStatus>("disconnected");
  const lastEventType = ref<string>("");
  const lastEventTime = ref<number>(0);

  const touch = (eventType: string) => {
    lastEventType.value = eventType;
    lastEventTime.value = Date.now();
  };

  // 对通知预览做去重和截断：
  // 1. 同一个 noticeId 只保留一条
  // 2. 最多保留 noticeRecentLimit 条，供右上角弹窗展示
  const normalizeRecent = (list: NoticeRealtimePreview[]) => {
    const seen = new Set<number>();
    return list
      .filter(item => item && item.noticeId > 0)
      .filter(item => {
        if (seen.has(item.noticeId)) {
          return false;
        }
        seen.add(item.noticeId);
        return true;
      })
      .slice(0, noticeRecentLimit);
  };

  // 新通知到达时插到最前面；如果已存在同一通知，则先移除旧项再插入。
  const upsertRecentNotice = (notice: NoticeRealtimePreview) => {
    const merged = [notice, ...recentNotices.value.filter(item => item.noticeId !== notice.noticeId)];
    recentNotices.value = normalizeRecent(merged);
  };

  // 业务提醒按业务事件 ID 去重，并限制弹窗里保留的提醒数量。
  const normalizeBusinessEvents = (list: NoticeBusinessEvent[]) => {
    const seen = new Set<string>();
    return (list || [])
      .filter(item => item && item.id)
      .filter(item => {
        if (seen.has(item.id)) {
          return false;
        }
        seen.add(item.id);
        return true;
      })
      .slice(0, businessRecentLimit);
  };

  // 业务提醒到达时同样插到最前面，保证弹窗优先显示最新事件。
  const upsertBusinessEvent = (event: NoticeBusinessEvent) => {
    const merged = [event, ...recentBusinessEvents.value.filter(item => item.id !== event.id)];
    recentBusinessEvents.value = normalizeBusinessEvents(merged);
  };

  const setConnectionStatus = (status: NoticeConnectionStatus) => {
    connectionStatus.value = status;
  };

  // WebSocket 建连或手动刷新时，用服务端快照覆盖本地通知预览。
  const syncFromServer = (payload: NoticeRealtimeSyncPayload) => {
    unreadCount.value = payload?.unreadCount || 0;
    recentNotices.value = normalizeRecent(payload?.recent || []);
    touch("notice_sync");
  };

  const setUnreadCount = (count: number, eventType: string = "unread_count_updated") => {
    unreadCount.value = Math.max(0, Number(count || 0));
    touch(eventType);
  };

  const setRecentNotices = (list: NoticeRealtimePreview[], eventType: string = "notice_recent_updated") => {
    recentNotices.value = normalizeRecent(list || []);
    touch(eventType);
  };

  // 收到“新通知发布”事件时：
  // 1. 把该通知插入弹窗预览列表
  // 2. 用服务端回传的未读数刷新铃铛徽标
  const applyPublished = (payload: NoticeRealtimePublishedPayload) => {
    if (payload?.notice) {
      upsertRecentNotice({
        ...payload.notice,
        readStatus: 0
      });
    }
    unreadCount.value = Math.max(0, Number(payload?.unreadCount || 0));
    touch("notice_published");
  };

  const applyRevoked = (payload: NoticeRealtimeRevokedPayload) => {
    recentNotices.value = recentNotices.value.filter(item => item.noticeId !== payload.noticeId);
    unreadCount.value = Math.max(0, Number(payload?.unreadCount || 0));
    touch("notice_revoked");
  };

  // 某条通知已读后，只更新本地预览状态，不从预览列表移除。
  // 这样用户在弹窗里仍能看到最近通知，只是状态变为已读。
  const applyRead = (noticeId: number, nextUnreadCount?: number) => {
    recentNotices.value = recentNotices.value.map(item =>
      item.noticeId === noticeId
        ? {
            ...item,
            readStatus: 1
          }
        : item
    );
    if (typeof nextUnreadCount === "number") {
      unreadCount.value = Math.max(0, Number(nextUnreadCount));
    } else {
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
    touch("notice_read");
  };

  const applyAllRead = (nextUnreadCount: number = 0) => {
    recentNotices.value = recentNotices.value.map(item => ({
      ...item,
      readStatus: 1
    }));
    unreadCount.value = Math.max(0, Number(nextUnreadCount || 0));
    touch("notice_all_read");
  };

  // 业务提醒不走站内通知未读数，单独维护 businessUnreadCount。
  const applyBusinessEvent = (payload: NoticeBusinessEvent) => {
    if (!payload?.id || !payload?.title) {
      return;
    }
    upsertBusinessEvent(payload);
    businessUnreadCount.value += 1;
    touch("business_notice");
  };

  const markBusinessSeen = () => {
    businessUnreadCount.value = 0;
    touch("business_seen");
  };

  const reset = () => {
    unreadCount.value = 0;
    recentNotices.value = [];
    recentBusinessEvents.value = [];
    businessUnreadCount.value = 0;
    connectionStatus.value = "disconnected";
    lastEventType.value = "";
    lastEventTime.value = 0;
  };

  return {
    unreadCount,
    recentNotices,
    recentBusinessEvents,
    businessUnreadCount,
    connectionStatus,
    lastEventType,
    lastEventTime,
    setConnectionStatus,
    syncFromServer,
    setUnreadCount,
    setRecentNotices,
    applyPublished,
    applyRevoked,
    applyRead,
    applyAllRead,
    applyBusinessEvent,
    markBusinessSeen,
    reset
  };
});

export function useNoticeStoreHook() {
  return useNoticeStore(pinia);
}
