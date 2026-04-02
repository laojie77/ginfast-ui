export type NoticeLevelTheme = {
  tagColor: string;
  className: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  accentColor: string;
};

const defaultLevelTheme: NoticeLevelTheme = {
  tagColor: "gray",
  className: "is-normal",
  textColor: "#4e5969",
  backgroundColor: "rgba(255, 255, 255, 0.88)",
  borderColor: "#d9dee8",
  accentColor: "#86909c"
};

const noticeLevelThemeMap: Record<string, NoticeLevelTheme> = {
  H: {
    tagColor: "red",
    className: "is-high",
    textColor: "#b71d18",
    backgroundColor: "rgba(245, 63, 63, 0.12)",
    borderColor: "rgba(245, 63, 63, 0.24)",
    accentColor: "#f53f3f"
  },
  M: {
    tagColor: "orange",
    className: "is-medium",
    textColor: "#b75d0f",
    backgroundColor: "rgba(255, 125, 0, 0.14)",
    borderColor: "rgba(255, 125, 0, 0.24)",
    accentColor: "#ff7d00"
  },
  L: {
    tagColor: "arcoblue",
    className: "is-low",
    textColor: "#2457d6",
    backgroundColor: "rgba(64, 128, 255, 0.12)",
    borderColor: "rgba(64, 128, 255, 0.2)",
    accentColor: "#4080ff"
  }
};

const decodeHtmlEntities = (text: string) => {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
};

export const getNoticeLevelTheme = (level?: string | null): NoticeLevelTheme => {
  if (!level) {
    return defaultLevelTheme;
  }
  return noticeLevelThemeMap[level] || defaultLevelTheme;
};

export const extractNoticePlainText = (content?: string | null) => {
  if (!content) {
    return "";
  }

  return decodeHtmlEntities(
    content
      .trim()
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const getNoticeSummary = (content?: string | null, maxLength: number = 48) => {
  const plainText = extractNoticePlainText(content).replace(/\s+/g, " ");
  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

export const formatRelativeTime = (value?: string | number | Date | null) => {
  if (!value) {
    return "";
  }

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
