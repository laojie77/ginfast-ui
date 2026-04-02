<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false" class="inbox-card">
        <template #extra>
          <a-button type="primary" @click="handleMarkAllRead" :disabled="unreadCount === 0">全部已读</a-button>
        </template>

        <a-space wrap class="search-bar">
          <a-input-search
            v-model="searchForm.title"
            placeholder="请输入通知标题搜索"
            style="width: 240px"
            allow-clear
            @search="handleSearch"
          />
          <a-select v-model="searchForm.type" placeholder="请选择通知类型" style="width: 220px" allow-clear>
            <a-option v-for="item in typeOption" :key="item.value" :value="Number(item.value)">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-select v-model="searchForm.level" placeholder="请选择通知等级" style="width: 220px" allow-clear>
            <a-option v-for="item in levelOption" :key="item.value" :value="item.value">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-select v-model="searchForm.readStatus" placeholder="请选择阅读状态" style="width: 220px" allow-clear>
            <a-option :value="0">未读</a-option>
            <a-option :value="1">已读</a-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>

        <a-table
          :data="dataList"
          :loading="loading"
          :pagination="paginationConfig"
          :bordered="{ wrapper: true, cell: true }"
          class="notice-table"
          :row-class="getRowClass"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #columns>
            <a-table-column title="通知标题" data-index="notice.title" :width="220" ellipsis tooltip>
              <template #cell="{ record }">
                <a-space>
                  <a-badge v-if="record.readStatus === 0" dot />
                  <a-link class="notice-link" @click="handleView(record)">{{ record.notice?.title }}</a-link>
                </a-space>
              </template>
            </a-table-column>
            <a-table-column title="通知类型" :width="120">
              <template #cell="{ record }">
                {{ getDictLabel(typeOption, record.notice?.type) }}
              </template>
            </a-table-column>
            <a-table-column title="通知等级" :width="120">
              <template #cell="{ record }">
                <a-tag :color="getLevelColor(record.notice?.level)">
                  {{ getDictLabel(levelOption, record.notice?.level) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="发布人" :width="140">
              <template #cell="{ record }">
                {{ getPublisherName(record.notice?.publisher) }}
              </template>
            </a-table-column>
            <a-table-column title="发布时间" :width="180">
              <template #cell="{ record }">
                {{ record.notice?.publishTime ? formatTime(record.notice.publishTime) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="阅读状态" data-index="readStatus" :width="110">
              <template #cell="{ record }">
                <a-tag v-if="record.readStatus === 0" color="red">未读</a-tag>
                <a-tag v-else color="green">已读</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="阅读时间" data-index="readTime" :width="180">
              <template #cell="{ record }">
                {{ record.readTime ? formatTime(record.readTime) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="160">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleView(record)">查看</a-button>
                  <a-button
                    v-if="record.readStatus === 0"
                    size="small"
                    type="primary"
                    @click="handleMarkRead(record.noticeId)"
                  >
                    标记已读
                  </a-button>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>

      <a-modal
        :visible="viewVisible"
        :footer="false"
        :closable="false"
        :width="isMobile ? '95vw' : '780px'"
        :body-style="{ padding: 0, overflow: 'hidden' }"
        :unmount-on-close="true"
        class="crm-modal inbox-detail-modal"
        @update:visible="handleDetailVisibleChange"
      >
        <div class="notice-detail">
          <div class="notice-detail__hero">
            <button class="notice-detail__close" type="button" @click="closeDetailModal">
              <icon-close />
            </button>

            <div class="notice-detail__badge">
              <span class="notice-detail__badge-icon">
                <icon-notification />
              </span>
              <span class="notice-detail__badge-text">{{ detailTypeLabel }}</span>
            </div>

            <h3 class="notice-detail__title">{{ viewData.notice?.title || "通知详情" }}</h3>

            <div class="notice-detail__meta">
              <span class="notice-detail__meta-item">
                <icon-clock-circle />
                <span>{{ detailPublishMeta }}</span>
              </span>
              <span class="notice-detail__meta-item">
                <icon-eye />
                <span>{{ detailReadMeta }}</span>
              </span>
            </div>

            <div class="notice-detail__tags" :style="detailLevelTagStyle">
              <span class="notice-detail__tag">发布人 {{ getPublisherName(viewData.notice?.publisher) }}</span>
              <span class="notice-detail__tag">等级 {{ detailLevelLabel }}</span>
            </div>
          </div>

          <div class="notice-detail__body">
            <div class="notice-detail__content-card">
              <span class="notice-detail__content-accent" />
              <div :class="['notice-detail__content', { 'notice-detail__content--scrollable': detailHtmlVisible }]">
                <div v-if="detailHtmlVisible" class="notice-detail__html notice-detail__html--scrollable" v-html="detailContentHtml" />
                <ul v-else-if="detailTextLines.length" class="notice-detail__list">
                  <li v-for="(line, index) in detailTextLines" :key="`${viewData.noticeId || 'detail'}-${index}`">
                    {{ line }}
                  </li>
                </ul>
                <div v-else class="notice-detail__empty">暂无通知内容</div>
              </div>
            </div>
          </div>

          <div class="notice-detail__footer">
            <div class="notice-detail__footer-tip">
              <icon-eye />
              <span>{{ detailFooterText }}</span>
            </div>
            <a-button class="notice-detail__footer-btn" @click="closeDetailModal">关闭</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { dictFilter, formatTime } from "@/globals";
import { extractNoticePlainText, formatRelativeTime, getNoticeLevelTheme } from "@/utils/notice-tools";
import type { SysNoticeInboxData } from "../../api/sysnotice";
import { useInboxHook } from "../../hooks/inbox";

type DictItem = {
  name: string;
  value: string | number;
};

const typeOption = ref<DictItem[]>(dictFilter("noticeType"));
const levelOption = ref<DictItem[]>(dictFilter("noticeLevel"));
const isMobile = ref(false);
const viewVisible = ref(false);
const viewData = ref<Partial<SysNoticeInboxData>>({});

const searchForm = reactive<{
  title: string;
  type: number | undefined;
  level: string | undefined;
  readStatus: number | undefined;
}>({
  title: "",
  type: undefined,
  level: undefined,
  readStatus: undefined
});

const {
  dataList,
  loading,
  total,
  unreadCount,
  currentPage,
  pageSize,
  fetchInboxList,
  markAsRead,
  markAllAsRead,
  getInboxDetail,
  resetSearchParams
} = useInboxHook();

const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50]
}));

const detailTypeLabel = computed(() => String(getDictLabel(typeOption.value, viewData.value.notice?.type) || "公告"));

const detailLevelLabel = computed(() => String(getDictLabel(levelOption.value, viewData.value.notice?.level) || "普通"));

const detailLevelTheme = computed(() => getNoticeLevelTheme(viewData.value.notice?.level));

const detailLevelTagStyle = computed(() => ({
  "--notice-level-text": detailLevelTheme.value.textColor,
  "--notice-level-bg": detailLevelTheme.value.backgroundColor,
  "--notice-level-border": detailLevelTheme.value.borderColor,
  "--notice-level-accent": detailLevelTheme.value.accentColor
}));

const detailContentRaw = computed(() => viewData.value.notice?.content?.trim() || "");

const legacyDetailContentText = computed(() => {
  return decodeHtml(
    detailContentRaw.value
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, "")
  ).trim();
});

// Keep the legacy helpers referenced without eagerly evaluating the computed result.

const detailContentText = computed(() => extractNoticePlainText(detailContentRaw.value));

const detailHtmlVisible = computed(() => /<\/?[a-z][\s\S]*>/i.test(detailContentRaw.value) && Boolean(detailContentText.value));

const detailContentHtml = computed(() => detailContentRaw.value);

const detailTextLines = computed(() => {
  if (detailHtmlVisible.value) {
    return [];
  }

  return detailContentText.value
    .split(/\r?\n+/)
    .map(line => line.replace(/^[\s\-*•]+/, "").trim())
    .filter(Boolean);
});

const detailPublishMeta = computed(() => {
  const publishTime = viewData.value.notice?.publishTime;
  if (!publishTime) {
    return "发布时间未记录";
  }

  const relative = formatRelativeTime(publishTime);
  const absolute = formatTime(publishTime);
  return relative ? `${relative} · ${absolute}` : absolute;
});

const detailReadMeta = computed(() => {
  if (viewData.value.readStatus === 0) {
    return "未读";
  }
  return viewData.value.readTime ? `已读  · ${formatTime(viewData.value.readTime)}` : "已读";
});

const detailFooterText = computed(() => {
  if (viewData.value.readStatus === 0) {
    return "当前仍是未读状态";
  }

  return viewData.value.readTime ? `您已于 ${formatRelativeTime(viewData.value.readTime)} 阅读此通知` : "您已阅读此通知";
});

const getDictLabel = (options: DictItem[], value: unknown) => {
  const item = options.find(option => option.value == value);
  return item?.name || value || "-";
};

const getLevelColor = (level?: string) => {
  const colors: Record<string, string> = {
    H: "red",
    M: "orange",
    L: "blue"
  };
  return level ? colors[level] || "gray" : "gray";
};

const getPublisherName = (publisher?: { nickName?: string; userName?: string; username?: string }) => {
  return publisher?.nickName || publisher?.userName || publisher?.username || "-";
};

const getRowClass = (record: SysNoticeInboxData) => {
  return record.readStatus === 0 ? "unread-row" : "";
};

const decodeHtml = (text: string) => {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
};

const legacyFormatRelativeTime = (value: string) => {
  const targetTime = new Date(value).getTime();
  if (Number.isNaN(targetTime)) {
    return "";
  }

  const diff = Date.now() - targetTime;
  if (diff <= 0) {
    return "刚刚";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "刚刚";
  }
  if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  }
  if (diff < 30 * day) {
    return `${Math.floor(diff / day)}天前`;
  }
  return "";
};

const legacyHelpers = [legacyDetailContentText, legacyFormatRelativeTime];
void legacyHelpers;

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const closeDetailModal = () => {
  handleDetailVisibleChange(false);
};

const handleDetailVisibleChange = (visible: boolean) => {
  viewVisible.value = visible;
  if (!visible) {
    viewData.value = {};
  }
};

const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params: Record<string, unknown> = {
    pageNum,
    pageSize: pageSizeVal
  };

  if (searchForm.title) {
    params.title = searchForm.title;
  }
  if (searchForm.type !== undefined) {
    params.type = searchForm.type;
  }
  if (searchForm.level) {
    params.level = searchForm.level;
  }
  if (searchForm.readStatus !== undefined) {
    params.readStatus = searchForm.readStatus;
  }

  await fetchInboxList(params);
};

const handlePageChange = (page: number) => loadData(page, pageSize.value);

const handlePageSizeChange = (size: number) => loadData(1, size);

const handleSearch = () => loadData(1);

const handleReset = () => {
  Object.assign(searchForm, {
    title: "",
    type: undefined,
    level: undefined,
    readStatus: undefined
  });
  resetSearchParams();
  loadData(1);
};

const handleView = async (record: SysNoticeInboxData) => {
  const detail = await getInboxDetail(record.noticeId);
  viewData.value = detail.data;
  viewVisible.value = true;

  if (record.readStatus === 0) {
    try {
      await markAsRead(record.noticeId);
      record.readStatus = 1;
      viewData.value = {
        ...viewData.value,
        readStatus: 1,
        readTime: viewData.value.readTime || new Date().toISOString()
      };
      await loadData();
    } catch {
      Message.error("更新阅读状态失败");
    }
  }
};

const handleMarkRead = async (noticeId: number) => {
  try {
    await markAsRead(noticeId);
    if (viewData.value.noticeId === noticeId) {
      viewData.value = {
        ...viewData.value,
        readStatus: 1,
        readTime: viewData.value.readTime || new Date().toISOString()
      };
    }
    Message.success("已标记为已读");
    await loadData();
  } catch {
    Message.error("操作失败");
  }
};

const handleMarkAllRead = async () => {
  try {
    await markAllAsRead();
    if (viewVisible.value) {
      viewData.value = {
        ...viewData.value,
        readStatus: 1,
        readTime: viewData.value.readTime || new Date().toISOString()
      };
    }
    Message.success("全部已读");
    await loadData();
  } catch {
    Message.error("操作失败");
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  loadData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped lang="scss">
.inbox-card {
  border-radius: 20px;
  background: linear-gradient(180deg, #fdfefe 0%, #f7faff 100%);
  box-shadow: 0 16px 40px rgba(15, 35, 95, 0.08);
}

.search-bar {
  margin-bottom: 18px;
}

.notice-link {
  font-weight: 600;
}

.notice-table :deep(.arco-table-th) {
  background: #f7f8fa;
}

.notice-table :deep(.arco-table-tr:hover .arco-table-td) {
  background: rgba(22, 93, 255, 0.03);
}

:deep(.unread-row .arco-table-td) {
  background-color: #f0f9ff;
}

.crm-modal :deep(.arco-modal) {
  border-radius: 22px;
  overflow: hidden;
}

.inbox-detail-modal :deep(.arco-modal) {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  margin: 24px auto;
}

.crm-modal :deep(.arco-modal-header) {
  border-bottom: 1px solid #e5e6eb;
  padding: 20px 24px;
  background: #fff;
}

.crm-modal :deep(.arco-modal-header .arco-modal-title) {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.inbox-detail-modal :deep(.arco-modal-header) {
  display: none;
}

.notice-detail {
  display: flex;
  flex-direction: column;
  max-height: inherit;
  background:
    radial-gradient(circle at top right, rgba(64, 128, 255, 0.14), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.notice-detail__hero {
  position: relative;
  padding: 24px 30px 22px;
  border-bottom: 1px solid #edf1f7;
  background: linear-gradient(120deg, rgba(240, 245, 255, 0.88) 0%, rgba(255, 255, 255, 0.98) 45%, rgba(235, 242, 255, 0.92) 100%);
}

.notice-detail__close {
  position: absolute;
  top: 18px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
  color: #6b778c;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(31, 56, 112, 0.08);
  transition: all 0.2s ease;
}

.notice-detail__close:hover {
  color: #1d2129;
  transform: translateY(-1px);
}

.notice-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.notice-detail__badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f65f5 0%, #6788ff 100%);
  color: #fff;
  box-shadow: 0 14px 30px rgba(47, 101, 245, 0.28);
}

.notice-detail__badge-text {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(64, 128, 255, 0.12);
  font-size: 13px;
  font-weight: 600;
  color: #2457d6;
}

.notice-detail__title {
  max-width: calc(100% - 64px);
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  color: #1d2129;
  word-break: break-word;
}

.notice-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.notice-detail__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4e5969;
}

.notice-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.notice-detail__tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #e5eaf5;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  color: #4e5969;
  transition: all 0.2s ease;
}

.notice-detail__tags .notice-detail__tag:last-child {
  border-color: var(--notice-level-border, #d9dee8);
  background: var(--notice-level-bg, rgba(255, 255, 255, 0.88));
  color: var(--notice-level-text, #4e5969);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
}

.notice-detail__tags .notice-detail__tag:last-child::before {
  content: "";
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--notice-level-accent, #86909c);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--notice-level-accent, #86909c) 16%, white);
}

.notice-detail__body {
  padding: 10px 30px;
}

.notice-detail__content-card {
  display: flex;
  gap: 24px;
  padding: 28px 26px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
  box-shadow: 0 18px 40px rgba(28, 47, 96, 0.06);
}

.notice-detail__content-accent {
  width: 4px;
  border-radius: 999px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #2f65f5 0%, #9d4dff 100%);
}

.notice-detail__content {
  flex: 1;
  min-width: 0;
}

.notice-detail__content--scrollable {
  min-height: 0;
}

.notice-detail__list {
  margin: 0;
  padding-left: 18px;
  font-size: 16px;
  line-height: 1.9;
  color: #1d2129;
}

.notice-detail__list li::marker {
  color: #2f65f5;
}

.notice-detail__list li + li {
  margin-top: 10px;
}

.notice-detail__html {
  font-size: 15px;
  line-height: 1.9;
  color: #1d2129;
  word-break: break-word;
}

.notice-detail__html--scrollable {
  max-height: clamp(220px, 50vh, 520px);
  overflow-y: auto;
  padding-right: 8px;
}

.notice-detail__html :deep(p) {
  margin: 0;
}

.notice-detail__html :deep(p + p),
.notice-detail__html :deep(p + ul),
.notice-detail__html :deep(p + ol),
.notice-detail__html :deep(ul + p),
.notice-detail__html :deep(ol + p),
.notice-detail__html :deep(ul + ul),
.notice-detail__html :deep(ol + ol) {
  margin-top: 10px;
}

.notice-detail__html :deep(ul),
.notice-detail__html :deep(ol) {
  padding-left: 20px;
}

.notice-detail__html :deep(img) {
  max-width: 100%;
  border-radius: 12px;
}

.notice-detail__empty {
  font-size: 15px;
  color: #86909c;
}

.notice-detail__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 30px;
  border-top: 1px solid #edf1f7;
  background: rgba(255, 255, 255, 0.94);
}

.notice-detail__footer-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b778c;
}

.notice-detail__footer-btn {
  min-width: 92px;
  height: 40px;
  border-radius: 14px;
}

@media (max-width: 767px) {
  .inbox-detail-modal :deep(.arco-modal) {
    max-height: calc(100vh - 32px);
    margin: 16px auto;
  }

  .search-bar {
    margin-bottom: 12px;
  }

  .notice-detail__hero,
  .notice-detail__body,
  .notice-detail__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .notice-detail__hero {
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .notice-detail__close {
    top: 14px;
    right: 14px;
    width: 38px;
    height: 38px;
  }

  .notice-detail__title {
    max-width: 100%;
    padding-right: 40px;
    font-size: 20px;
  }

  .notice-detail__content-card {
    gap: 14px;
    padding: 20px 16px;
  }

  .notice-detail__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .notice-detail__footer-tip {
    justify-content: center;
  }

  .notice-detail__footer-btn {
    width: 100%;
  }
}
</style>
