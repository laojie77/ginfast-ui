<template>
  <div class="notice-panel">
    <div class="notice-panel__hero">
      <div class="notice-panel__hero-main">
        <div class="notice-panel__title-row">
          <div class="notice-panel__title">通知中心</div>
          <a-tag size="small" :color="totalUnreadCount > 0 ? 'red' : 'gray'">
            {{ totalUnreadCount > 99 ? "99+" : totalUnreadCount }}
          </a-tag>
        </div>
        <div class="notice-panel__meta">
          <span class="notice-panel__meta-item">
            <span class="status-dot" :class="`is-${connectionStatus}`"></span>
            {{ connectionText }}
          </span>
<!--          <span class="notice-panel__meta-item">站内未读 {{ unreadCount }}</span>-->
          <span v-if="recentBusinessEvents.length" class="notice-panel__meta-item">
            业务提醒 {{ businessUnreadCount }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="recentBusinessEvents.length" class="notice-block">
      <div class="notice-block__head">
        <div class="notice-block__title">实时提醒</div>
        <div class="notice-block__hint">最新业务动态</div>
      </div>
      <div class="notice-list notice-list--business">
        <div
          v-for="item in recentBusinessEvents"
          :key="item.id"
          class="notice-card notice-card--business"
          :style="getBusinessCardStyle(item.scene)"
          @click="handleBusinessClick(item)"
        >
          <div class="notice-card__row">
            <span class="notice-chip notice-chip--scene">{{ getBusinessTagText(item.scene) }}</span>
            <span class="notice-card__time">{{ formatEventTime(item.timestamp) }}</span>
          </div>
          <div class="notice-card__title">{{ item.title }}</div>
          <div class="notice-card__summary">{{ getBusinessSummary(item) }}</div>
        </div>
      </div>
    </div>

    <div class="notice-block">
      <div class="notice-block__head">
        <div class="notice-block__title">未读通知</div>
        <div class="notice-block__hint" v-if="unreadCount > 0">优先展示最新未读</div>
      </div>

      <div v-if="unreadRecentNotices.length" class="notice-list notice-list--notice">
        <div
          v-for="item in unreadRecentNotices"
          :key="item.recipientId || item.noticeId"
          class="notice-card notice-card--notice"
          :style="getNoticeCardStyle(item.level)"
          @click="goInbox"
        >
          <div class="notice-card__row">
            <div class="notice-card__chips">
              <span class="notice-chip notice-chip--type">{{ getNoticeTypeLabel(item.type) }}</span>
              <span class="notice-chip notice-chip--level">{{ getNoticeLevelLabel(item.level) }}</span>
            </div>
            <span class="notice-card__time">{{ formatNoticeTime(item.publishTime) }}</span>
          </div>
          <div class="notice-card__title">{{ item.title }}</div>
          <div class="notice-card__summary">{{ getNoticeSummaryText(item.content) || "点击查看通知详情" }}</div>
        </div>
      </div>

      <div v-else class="notice-empty">当前没有未读通知</div>
    </div>

    <div class="notice-panel__footer">
      <a-button size="small" @click="handleRefresh">刷新</a-button>
      <a-button size="small" type="primary" @click="goInbox">查看全部</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { downloadAffixAPI } from "@/api/file";
import { getBaseUrl } from "@/api/utils";
import { dictFilter, formatTime } from "@/globals";
import { formatRelativeTime, getNoticeLevelTheme, getNoticeSummary } from "@/utils/notice-tools";
import { noticeWebSocketClient } from "@/utils/notice-websocket";
import { useNoticeStoreHook, type NoticeBusinessEvent, type NoticeRealtimePreview } from "@/store/modules/notice";

type DictItem = {
  name?: string;
  value: string | number;
};

const router = useRouter();
const noticeStore = useNoticeStoreHook();

const typeOption = computed<DictItem[]>(() => dictFilter("noticeType"));
const levelOption = computed<DictItem[]>(() => dictFilter("noticeLevel"));

const unreadCount = computed(() => noticeStore.unreadCount);
const businessUnreadCount = computed(() => noticeStore.businessUnreadCount);
const totalUnreadCount = computed(() => unreadCount.value + businessUnreadCount.value);
const recentNotices = computed(() => noticeStore.recentNotices);
const unreadRecentNotices = computed(() =>
  recentNotices.value.filter((item: NoticeRealtimePreview) => item.readStatus === 0)
);
const recentBusinessEvents = computed(() => noticeStore.recentBusinessEvents);
const connectionStatus = computed(() => noticeStore.connectionStatus);

const connectionText = computed(() => {
  const statusText: Record<string, string> = {
    disconnected: "未连接",
    connecting: "连接中",
    connected: "实时通知已连接",
    error: "连接异常，等待重试"
  };
  return statusText[connectionStatus.value] || "未连接";
});

const getDictLabel = (options: DictItem[], value: unknown, fallback: string) => {
  const item = options.find(option => option.value == value);
  return item?.name || fallback;
};

const getNoticeTypeLabel = (type?: number) => getDictLabel(typeOption.value, type, "通知");

const getNoticeLevelLabel = (level?: string) => getDictLabel(levelOption.value, level, "普通");

const formatNoticeTime = (time?: string) => {
  const relative = formatRelativeTime(time);
  return relative || (time ? formatTime(time) : "刚刚");
};

const formatEventTime = (timestamp?: number) => {
  if (!timestamp) {
    return "刚刚";
  }
  const isoTime = new Date(timestamp * 1000).toISOString();
  return formatRelativeTime(isoTime) || formatTime(isoTime);
};

const getNoticeSummaryText = (content?: string) => getNoticeSummary(content, 56);

const getNoticeCardStyle = (level?: string) => {
  const theme = getNoticeLevelTheme(level);
  return {
    "--notice-accent": theme.accentColor,
    "--notice-soft-bg": theme.backgroundColor,
    "--notice-soft-border": theme.borderColor,
    "--notice-soft-text": theme.textColor
  };
};

const getBusinessTagText = (scene?: string) => {
  const textMap: Record<string, string> = {
    system_internal: "系统",
    export_download: "导出",
    customer_assigned: "分配"
  };
  return textMap[scene || ""] || "提醒";
};

const getBusinessCardStyle = (scene?: string) => {
  const themeMap: Record<string, Record<string, string>> = {
    system_internal: {
      "--notice-accent": "#4080ff",
      "--notice-soft-bg": "rgba(64, 128, 255, 0.12)",
      "--notice-soft-border": "rgba(64, 128, 255, 0.22)",
      "--notice-soft-text": "#2457d6"
    },
    export_download: {
      "--notice-accent": "#00b42a",
      "--notice-soft-bg": "rgba(0, 180, 42, 0.12)",
      "--notice-soft-border": "rgba(0, 180, 42, 0.2)",
      "--notice-soft-text": "#0e7a2f"
    },
    customer_assigned: {
      "--notice-accent": "#ff7d00",
      "--notice-soft-bg": "rgba(255, 125, 0, 0.14)",
      "--notice-soft-border": "rgba(255, 125, 0, 0.22)",
      "--notice-soft-text": "#b75d0f"
    }
  };
  return themeMap[scene || ""] || getNoticeCardStyle();
};

const getBusinessSummary = (event: NoticeBusinessEvent) => {
  return getNoticeSummary(event.content, 56) || "点击查看处理详情";
};

const goInbox = () => {
  router.push("/plugins/sysnotice/sysnotice/inbox");
};

const handleRefresh = () => {
  noticeWebSocketClient.requestSync();
};

const resolveDownloadURL = (url: string) => {
  if (!url) {
    return "";
  }

  const baseUrl = getBaseUrl();
  const base = baseUrl || window.location.origin;
  return new URL(url, base).toString();
};

const handleBusinessClick = async (event: NoticeBusinessEvent) => {
  noticeStore.markBusinessSeen();

  const action = event.action;
  if (!action?.value) {
    goInbox();
    return;
  }

  if (action.kind === "route") {
    router.push(action.value);
    return;
  }

  if (action.kind === "download") {
    const affixId = Number(action.value || event.extra?.affixId);
    if (Number.isFinite(affixId) && affixId > 0) {
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
        return;
      } catch (error) {
        console.error("download notice file failed:", error);
        Message.error("下载导出文件失败，请稍后重试");
        return;
      }
    }
  }

  const target = action.openMode === "self" ? "_self" : "_blank";
  window.open(action.value, target);
};
</script>

<style lang="scss" scoped>
.notice-panel {
  width: 372px;
  padding: 2px 0 0;
}

.notice-panel__hero {
  margin-bottom: 12px;
  padding: 2px 2px 10px;
  border-bottom: 1px solid #edf1f7;
}

.notice-panel__hero-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notice-panel__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notice-panel__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-1, #1d2129);
}

.notice-panel__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.notice-panel__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid #edf1f7;
  border-radius: 999px;
  background: #f7f8fa;
  font-size: 12px;
  color: var(--color-text-2, #4e5969);
}

.notice-block + .notice-block {
  margin-top: 12px;
}

.notice-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.notice-block__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-1, #1d2129);
}

.notice-block__hint {
  font-size: 12px;
  color: var(--color-text-3, #86909c);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9cdd4;

  &.is-connecting {
    background: #ff7d00;
  }

  &.is-connected {
    background: #00b42a;
  }

  &.is-error {
    background: #f53f3f;
  }
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 2px;
  overflow-y: auto;
}

.notice-list--business {
  max-height: 200px;
}

.notice-list--notice {
  max-height: min(420px, calc(100vh - 240px));
}

.notice-card {
  position: relative;
  padding: 11px 12px 12px 14px;
  border: 1px solid var(--notice-soft-border, #e5e6eb);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 251, 255, 0.96) 100%),
    var(--notice-soft-bg, rgba(255, 255, 255, 0.9));
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(15, 35, 95, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.notice-card::before {
  content: "";
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 4px;
  border-radius: 999px;
  background: var(--notice-accent, #4080ff);
}

.notice-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(15, 35, 95, 0.1);
}

.notice-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.notice-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.notice-chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--notice-soft-bg, rgba(64, 128, 255, 0.12));
  color: var(--notice-soft-text, #2457d6);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.notice-chip--type {
  border: 1px solid color-mix(in srgb, var(--notice-accent, #4080ff) 18%, white);
  background: rgba(255, 255, 255, 0.84);
}

.notice-card__time {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-text-3, #86909c);
}

.notice-card__title {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--color-text-1, #1d2129);
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.notice-card__summary {
  font-size: 12px;
  line-height: 1.55;
  color: var(--color-text-2, #4e5969);
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.notice-empty {
  padding: 24px 14px;
  border: 1px dashed #d9dee8;
  border-radius: 14px;
  background: #f7f8fa;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-3, #86909c);
}

.notice-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #edf1f7;
}
</style>
