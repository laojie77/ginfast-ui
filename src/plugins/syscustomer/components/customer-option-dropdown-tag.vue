<template>
  <a-dropdown @select="handleSelect">
    <a-tooltip :content="tooltipText" position="top">
      <a-tag
        :size="size"
        :color="color"
        :class="['customer-option-tag', { 'customer-option-tag--multiline': isMultiline }]"
        :style="{ maxWidth }"
      >
        {{ text }}
      </a-tag>
    </a-tooltip>

    <template #content>
      <a-doption
        v-for="item in options"
        :key="item.value"
        :value="normalizeOptionValue(item.value)"
        :style="{ color: isSelected(item.value) ? '#165dff' : '' }"
      >
        {{ item.name }}
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface DropdownOption {
  value: number | string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    text: string;
    options: DropdownOption[];
    selectedValue?: number | string | null;
    tooltip?: string;
    color?: string;
    maxWidth?: string;
    multilineThreshold?: number;
    size?: "mini" | "small" | "medium" | "large";
  }>(),
  {
    selectedValue: undefined,
    tooltip: undefined,
    color: "",
    maxWidth: "220px",
    multilineThreshold: 20,
    size: "small"
  }
);

const emit = defineEmits<{
  select: [value: number | string];
}>();

const tooltipText = computed(() => props.tooltip || props.text || "-");

const isMultiline = computed(() => props.text.length > props.multilineThreshold);

// 优先保留字符串选项的原值，只在明确是数字时再做数字化，避免通用组件把任意字符串都变成 NaN。
const normalizeOptionValue = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? value : numericValue;
};

const isSelected = (value: number | string) => {
  return String(normalizeOptionValue(value)) === String(normalizeOptionValue(props.selectedValue ?? ""));
};

const handleSelect = (value: string | number) => {
  emit("select", value);
};
</script>

<style scoped lang="scss">
.customer-option-tag {
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  line-height: 1.4;
  max-height: 2.8em;
  white-space: nowrap;
}

.customer-option-tag--multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}
</style>
