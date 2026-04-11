<template>
  <div class="layout-main-shell">
    <div class="layout-main-watermark">
      <a-layout-content class="layout-main-content">
        <Tabs v-if="isTabs" />
        <router-view v-slot="{ Component, route }">
          <s-main-transition>
            <keep-alive :include="cacheRoutes">
              <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" v-if="refreshPage" />
            </keep-alive>
          </s-main-transition>
        </router-view>
      </a-layout-content>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from "@/layout/components/Tabs/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRouteConfigStore } from "@/store/modules/route-config";

const themeStore = useThemeConfig();
let { refreshPage, isTabs } = storeToRefs(themeStore);
const routerStore = useRouteConfigStore();
const { cacheRoutes } = storeToRefs(routerStore);

// Component wrapper cache for keep-alive route instances.
const wrapperMap = new Map();
const createComponentWrapper = (component: any, route: any) => {
  if (!component) return;
  const wrapperName = route.fullPath;
  let wrapper = wrapperMap.get(wrapperName);
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) };
    wrapperMap.set(wrapperName, wrapper);
  }
  return h(wrapper);
};
</script>

<style lang="scss" scoped>
.layout-main-shell,
.layout-main-watermark,
.layout-main-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.layout-main-shell,
.layout-main-content {
  overflow: hidden;
}

.layout-main-watermark,
.layout-main-content {
  flex: 1;
}

// Narrow the main content scrollbar a bit.
:deep(.arco-scrollbar-thumb-direction-vertical .arco-scrollbar-thumb-bar) {
  width: 4px;
  margin-left: 8px;
}
</style>
