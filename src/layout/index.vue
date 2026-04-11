<template>
  <div>
    <s-lang-provider>
      <a-watermark :content="watermarkContent" v-bind="watermarkConfig">
        <component :is="layouts[layoutType]" />
      </a-watermark>
    </s-lang-provider>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useSysConfigStore } from "@/store/modules/sys-config";
import { useUserStore } from "@/store/modules/user";

const themeStore = useThemeConfig();
const { layoutType, watermarkStyle, watermarkRotate, watermarkGap } = storeToRefs(themeStore);
const sysConfigStore = useSysConfigStore();
const { platformConfig } = storeToRefs(sysConfigStore);
const userStore = useUserStore();
const { account } = storeToRefs(userStore);

// 引入组件-异步组件
const layouts: any = {
  layoutDefaults: defineAsyncComponent(() => import("@/layout/layout-defaults/index.vue")),
  layoutHead: defineAsyncComponent(() => import("@/layout/layout-head/index.vue")),
  layoutMixing: defineAsyncComponent(() => import("@/layout/layout-mixing/index.vue"))
};

const getPhoneTail = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.slice(-4);
};

const watermarkContent = computed(() => {
  if (!platformConfig.value?.watermark || account.value.isWatermark == null || account.value.isWatermark == 0) return undefined;

  const tenantName = account.value.tenantName?.trim() || account.value.defaultTenant?.name?.trim() || "";
  const phoneTail = getPhoneTail(account.value.phone);

  const content = [tenantName, phoneTail].filter(Boolean).join(" ");
  return content || undefined;
});

const watermarkConfig = computed(() => {
  return {
    font: watermarkStyle.value,
    rotate: watermarkRotate.value,
    gap: watermarkGap.value
  };
});
</script>

<style lang="scss" scoped></style>
