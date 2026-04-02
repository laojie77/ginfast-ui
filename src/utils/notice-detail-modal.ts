import { Message, Modal } from "@arco-design/web-vue";
import { IconClockCircle, IconEye, IconNotification } from "@arco-design/web-vue/es/icon";
import { h } from "vue";
import { dictFilter, formatTime } from "@/globals";
import { getInboxDetail, markRead } from "@/plugins/sysnotice/api/sysnotice";
import type { SysNoticeData, SysNoticeInboxData } from "@/plugins/sysnotice/api/sysnotice";
import { useNoticeStoreHook, type NoticeRealtimePreview } from "@/store/modules/notice";
import { extractNoticePlainText, formatRelativeTime, getNoticeLevelTheme } from "@/utils/notice-tools";

type DictItem = {
  name?: string;
  value: string | number;
};

const STYLE_ID = "realtime-notice-detail-style";
const MODAL_CLASS = "realtime-notice-modal";

const pendingNotices: NoticeRealtimePreview[] = [];
const queuedNoticeIds = new Set<number>();
let activeNoticeId: number | null = null;
let pageScrollLockCount = 0;
let pageScrollSnapshot:
  | {
      scrollY: number;
      bodyOverflow: string;
      bodyPosition: string;
      bodyTop: string;
      bodyLeft: string;
      bodyRight: string;
      bodyWidth: string;
      htmlOverflow: string;
    }
  | null = null;

const getDictLabel = (options: DictItem[], value: unknown, fallback: string) => {
  const item = options.find(option => option.value == value);
  return item?.name || fallback;
};

const getPublisherName = (publisher?: { nickName?: string; userName?: string; username?: string }) => {
  return publisher?.nickName || publisher?.userName || publisher?.username || "-";
};

const getDetailDataFromPreview = (preview: NoticeRealtimePreview): Partial<SysNoticeInboxData> => {
  const notice: Partial<SysNoticeData> = {
    id: preview.noticeId,
    title: preview.title,
    content: preview.content,
    type: preview.type,
    level: preview.level,
    publishTime: preview.publishTime || ""
  };

  return {
    noticeId: preview.noticeId,
    readStatus: preview.readStatus ?? 0,
    readTime: "",
    notice: notice as SysNoticeData
  };
};

const ensureStyleInjected = () => {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.${MODAL_CLASS} {
  overscroll-behavior: contain;
}

.${MODAL_CLASS} .arco-modal {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  margin: 24px auto;
  border-radius: 22px;
  overflow: hidden;
  overscroll-behavior: contain;
}

.${MODAL_CLASS} .arco-modal-content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: inherit;
  overflow: hidden;
}

.${MODAL_CLASS} .arco-modal-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.${MODAL_CLASS} .arco-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  padding: 18px 30px 22px;
  border-top: 1px solid #edf1f7;
  background: rgba(255, 255, 255, 0.96);
}

.${MODAL_CLASS} .arco-modal-footer .arco-btn {
  min-width: 152px;
  height: 42px;
  border-radius: 14px;
}

.realtime-notice-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: inherit;
  background:
    radial-gradient(circle at top right, rgba(64, 128, 255, 0.14), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.realtime-notice-detail__hero {
  padding: 24px 30px 22px;
  border-bottom: 1px solid #edf1f7;
  background: linear-gradient(120deg, rgba(240, 245, 255, 0.88) 0%, rgba(255, 255, 255, 0.98) 45%, rgba(235, 242, 255, 0.92) 100%);
}

.realtime-notice-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.realtime-notice-detail__badge-icon {
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

.realtime-notice-detail__badge-text {
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

.realtime-notice-detail__title {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  color: #1d2129;
  word-break: break-word;
}

.realtime-notice-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.realtime-notice-detail__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4e5969;
}

.realtime-notice-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.realtime-notice-detail__tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #e5eaf5;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  color: #4e5969;
}

.realtime-notice-detail__tags .realtime-notice-detail__tag:last-child {
  border-color: var(--notice-level-border, #d9dee8);
  background: var(--notice-level-bg, rgba(255, 255, 255, 0.88));
  color: var(--notice-level-text, #4e5969);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
}

.realtime-notice-detail__tags .realtime-notice-detail__tag:last-child::before {
  content: "";
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--notice-level-accent, #86909c);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--notice-level-accent, #86909c) 16%, white);
}

.realtime-notice-detail__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 30px;
}

.realtime-notice-detail__content-card {
  display: flex;
  align-items: stretch;
  gap: 24px;
  padding: 28px 26px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
  box-shadow: 0 18px 40px rgba(28, 47, 96, 0.06);
}

.realtime-notice-detail__content-accent {
  width: 4px;
  border-radius: 999px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #2f65f5 0%, #9d4dff 100%);
}

.realtime-notice-detail__content {
  flex: 1;
  min-width: 0;
}

.realtime-notice-detail__content--scrollable {
  min-height: 0;
}

.realtime-notice-detail__list {
  margin: 0;
  padding-left: 18px;
  font-size: 16px;
  line-height: 1.9;
  color: #1d2129;
}

.realtime-notice-detail__list li::marker {
  color: #2f65f5;
}

.realtime-notice-detail__list li + li {
  margin-top: 10px;
}

.realtime-notice-detail__html {
  font-size: 15px;
  line-height: 1.9;
  color: #1d2129;
  word-break: break-word;
}

.realtime-notice-detail__html--scrollable {
  max-height: clamp(220px, 50vh, 520px);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-right: 8px;
}

.realtime-notice-detail__html p {
  margin: 0;
}

.realtime-notice-detail__html p + p,
.realtime-notice-detail__html p + ul,
.realtime-notice-detail__html p + ol,
.realtime-notice-detail__html ul + p,
.realtime-notice-detail__html ol + p,
.realtime-notice-detail__html ul + ul,
.realtime-notice-detail__html ol + ol {
  margin-top: 10px;
}

.realtime-notice-detail__html ul,
.realtime-notice-detail__html ol {
  padding-left: 20px;
}

.realtime-notice-detail__html img {
  max-width: 100%;
  border-radius: 12px;
}

.realtime-notice-detail__empty {
  font-size: 15px;
  color: #86909c;
}

.realtime-notice-detail__footer {
  flex-shrink: 0;
  padding: 0 30px 6px;
}

.realtime-notice-detail__footer-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b778c;
}

@media (max-width: 767px) {
  .${MODAL_CLASS} .arco-modal {
    max-height: calc(100vh - 32px);
    margin: 16px auto;
  }

  .${MODAL_CLASS} .arco-modal-footer {
    padding: 16px;
  }

  .${MODAL_CLASS} .arco-modal-footer .arco-btn {
    flex: 1;
    min-width: 0;
  }

  .realtime-notice-detail__hero,
  .realtime-notice-detail__body,
  .realtime-notice-detail__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .realtime-notice-detail__hero {
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .realtime-notice-detail__title {
    font-size: 20px;
  }

  .realtime-notice-detail__content-card {
    gap: 14px;
    padding: 20px 16px;
  }
}
`;

  document.head.appendChild(style);
};

const lockPageScroll = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  if (pageScrollLockCount > 0) {
    pageScrollLockCount += 1;
    return;
  }

  const { body, documentElement } = document;
  pageScrollSnapshot = {
    scrollY: window.scrollY,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    htmlOverflow: documentElement.style.overflow
  };

  documentElement.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${window.scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  pageScrollLockCount = 1;
};

const unlockPageScroll = () => {
  if (typeof document === "undefined" || typeof window === "undefined" || pageScrollLockCount === 0) {
    return;
  }

  pageScrollLockCount -= 1;
  if (pageScrollLockCount > 0) {
    return;
  }

  const snapshot = pageScrollSnapshot;
  const { body, documentElement } = document;

  body.style.overflow = snapshot?.bodyOverflow || "";
  body.style.position = snapshot?.bodyPosition || "";
  body.style.top = snapshot?.bodyTop || "";
  body.style.left = snapshot?.bodyLeft || "";
  body.style.right = snapshot?.bodyRight || "";
  body.style.width = snapshot?.bodyWidth || "";
  documentElement.style.overflow = snapshot?.htmlOverflow || "";

  if (snapshot) {
    window.scrollTo({ top: snapshot.scrollY });
  }

  pageScrollSnapshot = null;
};

const renderDetailContent = (detail: Partial<SysNoticeInboxData>) => {
  const notice = detail.notice;
  const typeLabel = getDictLabel(dictFilter("noticeType") as DictItem[], notice?.type, "公告");
  const levelLabel = getDictLabel(dictFilter("noticeLevel") as DictItem[], notice?.level, "普通");
  const theme = getNoticeLevelTheme(notice?.level);
  const contentRaw = notice?.content?.trim() || "";
  const contentText = extractNoticePlainText(contentRaw);
  const showHtml = /<\/?[a-z][\s\S]*>/i.test(contentRaw) && Boolean(contentText);
  const textLines = showHtml
    ? []
    : contentText
        .split(/\r?\n+/)
        .map(line => line.replace(/^[\s\-*•]+/, "").trim())
        .filter(Boolean);

  const publishMeta = notice?.publishTime
    ? (() => {
        const relative = formatRelativeTime(notice.publishTime);
        const absolute = formatTime(notice.publishTime);
        return relative ? `${relative} / ${absolute}` : absolute;
      })()
    : "发布时间未记录";

  const readMeta = detail.readStatus === 0 ? "未读" : detail.readTime ? `已读 / ${formatTime(detail.readTime)}` : "已读";

  const levelTagStyle = {
    "--notice-level-text": theme.textColor,
    "--notice-level-bg": theme.backgroundColor,
    "--notice-level-border": theme.borderColor,
    "--notice-level-accent": theme.accentColor
  };

  return h("div", { class: "realtime-notice-detail" }, [
    h("div", { class: "realtime-notice-detail__hero" }, [
      h("div", { class: "realtime-notice-detail__badge" }, [
        h("span", { class: "realtime-notice-detail__badge-icon" }, [h(IconNotification)]),
        h("span", { class: "realtime-notice-detail__badge-text" }, String(typeLabel))
      ]),
      h("h3", { class: "realtime-notice-detail__title" }, notice?.title || "通知详情"),
      h("div", { class: "realtime-notice-detail__meta" }, [
        h("span", { class: "realtime-notice-detail__meta-item" }, [h(IconClockCircle), h("span", publishMeta)]),
        h("span", { class: "realtime-notice-detail__meta-item" }, [h(IconEye), h("span", readMeta)])
      ]),
      h("div", { class: "realtime-notice-detail__tags", style: levelTagStyle }, [
        h("span", { class: "realtime-notice-detail__tag" }, `发布人 ${getPublisherName(notice?.publisher)}`),
        h("span", { class: "realtime-notice-detail__tag" }, `等级 ${String(levelLabel)}`)
      ])
    ]),
      h("div", { class: "realtime-notice-detail__body" }, [
        h("div", { class: "realtime-notice-detail__content-card" }, [
          h("span", { class: "realtime-notice-detail__content-accent" }),
        h("div", { class: ["realtime-notice-detail__content", showHtml && "realtime-notice-detail__content--scrollable"] }, [
          showHtml
            ? h("div", {
                class: ["realtime-notice-detail__html", "realtime-notice-detail__html--scrollable"],
                innerHTML: contentRaw
              })
            : textLines.length
              ? h(
                  "ul",
                  { class: "realtime-notice-detail__list" },
                  textLines.map((line, index) => h("li", { key: `${detail.noticeId || "detail"}-${index}` }, line))
                )
              : h("div", { class: "realtime-notice-detail__empty" }, "暂无通知内容")
        ])
      ])
    ]),
    h("div", { class: "realtime-notice-detail__footer" }, [
      h("div", { class: "realtime-notice-detail__footer-tip" }, [
        h(IconEye),
        h("span", "点击下方按钮后将自动标记为已读")
      ])
    ])
  ]);
};

const showNextNotice = async () => {
  if (activeNoticeId !== null || pendingNotices.length === 0) {
    return;
  }

  const preview = pendingNotices.shift();
  if (!preview) {
    return;
  }

  queuedNoticeIds.delete(preview.noticeId);
  activeNoticeId = preview.noticeId;
  ensureStyleInjected();
  lockPageScroll();

  let detailData = getDetailDataFromPreview(preview);

  try {
    const response = await getInboxDetail(preview.noticeId);
    if (response?.data) {
      detailData = {
        ...detailData,
        ...response.data,
        notice: {
          ...(detailData.notice || {}),
          ...(response.data.notice || {})
        }
      };
    }
  } catch (error) {
    console.warn("load realtime notice detail failed:", error);
  }

  Modal.open({
    title: "",
    hideTitle: true,
    content: () => renderDetailContent(detailData),
    width: typeof window !== "undefined" && window.innerWidth < 768 ? "95vw" : "780px",
    footer: true,
    hideCancel: false,
    closable: false,
    maskClosable: false,
    escToClose: false,
    modalClass: MODAL_CLASS,
    cancelText: "我知道了",
    okText: "关闭则表示阅读",
    cancelButtonProps: {
      type: "secondary"
    },
    okButtonProps: {
      type: "primary"
    },
    onBeforeOk: async () => {
      try {
        await markRead(preview.noticeId);
        useNoticeStoreHook().applyRead(preview.noticeId);
        return true;
      } catch {
        Message.error("标记通知已读失败，请稍后重试");
        return false;
      }
    },
    onClose: () => {
      unlockPageScroll();
      activeNoticeId = null;
      void showNextNotice();
    }
  });
};

export const openRealtimeNoticeDetail = (preview?: NoticeRealtimePreview | null) => {
  if (!preview?.noticeId) {
    return;
  }

  if (preview.readStatus === 1 || activeNoticeId === preview.noticeId || queuedNoticeIds.has(preview.noticeId)) {
    return;
  }

  pendingNotices.push(preview);
  queuedNoticeIds.add(preview.noticeId);
  void showNextNotice();
};
