<template>
    <div class="header_setting" :class="isMobile && 'head-absolute-fix'">
        <!-- 国际化 -->
<!--        <a-dropdown trigger="hover" @select="onLange">-->
<!--            <a-button size="mini" type="text" class="icon_btn" id="system-language">-->
<!--                <template #icon>-->
<!--                    <icon-language :size="18" />-->
<!--                </template>-->
<!--            </a-button>-->
<!--            <template #content>-->
<!--                <a-doption :disabled="language === 'zh-CN'">{{ $t(`system.zh-CN`) }}</a-doption>-->
<!--                <a-doption :disabled="language === 'en-US'">{{ $t(`system.en-US`) }}</a-doption>-->
<!--            </template>-->
<!--        </a-dropdown>-->
        <!-- 切换黑夜模式 -->
        <a-tooltip :content="$t(`system.${!darkMode ? 'switch-to-night-mode' : 'switch-to-daytime-mode'}`)">
            <a-button size="mini" type="text" class="icon_btn" id="system-dark" @click="onNightMode">
                <template #icon>
                    <icon-sun-fill :size="18" v-if="!darkMode" />
                    <icon-moon-fill :size="18" v-else />
                </template>
            </a-button>
        </a-tooltip>
        <!-- 通知 -->
        <a-popover position="bottom" trigger="click" @popup-visible-change="handleNoticeVisibleChange">
            <a-badge :count="totalNoticeCount" :max-count="99" class="notice-badge">
                <a-button size="mini" type="text" class="icon_btn notice" id="system-notice">
                    <template #icon>
                        <icon-notification :size="18" />
                    </template>
                </a-button>
            </a-badge>
            <template #content>
                <Notice />
            </template>
        </a-popover>
        <!-- 全屏 -->
        <a-tooltip :content="$t(`system.${fullScreen ? 'full-screen' : 'exit-full-screen'}`)">
            <a-button size="mini" type="text" class="icon_btn" id="system-fullscreen" @click="onFullScreen">
                <template #icon>
                    <icon-fullscreen :size="18" v-if="fullScreen" />
                    <icon-fullscreen-exit :size="18" v-else />
                </template>
            </a-button>
        </a-tooltip>
        <!-- 系统设置 -->
        <a-tooltip :content="$t(`system.system-settings`)">
            <a-button size="mini" type="text" class="icon_btn" id="system-settings" @click="onSystemSetting">
                <template #icon>
                    <icon-settings :size="18" />
                </template>
            </a-button>
        </a-tooltip>
        <!-- 主题设置 -->
        <a-tooltip :content="$t(`system.theme-settings`)">
            <a-button size="mini" type="text" class="icon_btn" id="system-theme" @click="onThemeSetting">
                <template #icon>
                    <icon-skin :size="18" />
                </template>
            </a-button>
        </a-tooltip>
        <!-- 公司管理 -->
        <a-dropdown trigger="hover" v-if="showGlobalTenant || showTenantSwitch">
            <a-button size="mini" type="text" class="tenant-btn" id="system-tenant">
                <template #icon>
                    <s-svg-icon :name="'home'" :size="18" />
                </template>
                <span class="tenant-text">{{ $t("system.switch-tenant") }}</span>
            </a-button>
            <template #content>
                <!-- 全局公司 -->
                <a-doption v-if="showGlobalTenant" @click="switchToGlobalTenant">
                    <template #default>
                        <s-svg-icon :name="'home'" :size="18" />
                        <span class="margin-left-text">{{ $t('system.global-tenant') }}</span>
                    </template>
                </a-doption>
                <!-- 切换公司 -->
                <template v-if="showTenantSwitch">
                    <a-doption v-for="tenant in switchableTenants" :key="tenant.id" @click="switchTenant(tenant)">
                        <template #default>
                            <s-svg-icon :name="'switch'" :size="18" />
                            <span class="margin-left-text">{{ tenant.name }}</span>
                        </template>
                    </a-doption>
                </template>
            </template>
        </a-dropdown>
        <!-- 我的 -->
        <a-dropdown trigger="hover" :popup-max-height="false">
            <div class="my_setting" id="system-my-setting">
                <a-image width="32" height="32" fit="cover" :src="account.avatar" class="my_image" />
                <span class="user-nickname">{{ account.nickName }}</span>
                <div class="icon_down">
                    <icon-down style="stroke-width: 3" />
                </div>
            </div>
            <template #content>
                <!-- 个人中心 -->
                <a-doption @click="onPerson(1)">
                    <template #default>
                        <s-svg-icon :name="'user'" :size="18" />
                        <span class="margin-left-text">{{ $t(`system.personal-information`) }}</span>
                    </template>
                </a-doption>
                <!-- 修改密码 -->
                <a-doption @click="onPerson(2)">
                    <template #default>
                        <s-svg-icon :name="'lock-pwd'" :size="18" />
                        <span class="margin-left-text">{{ $t(`system.change-password`) }}</span>
                    </template>
                </a-doption>
                <!-- 全局公司 -->
<!--                <a-doption v-if="showGlobalTenant" @click="switchToGlobalTenant">-->
<!--                    <template #default>-->
<!--                        <s-svg-icon :name="'home'" :size="18" />-->
<!--                        <span class="margin-left-text">{{ $t('system.global-tenant') }}</span>-->
<!--                    </template>-->
<!--                </a-doption>-->
<!--                &lt;!&ndash; 切换公司 &ndash;&gt;-->
<!--                <a-dropdown v-if="showTenantSwitch" trigger="hover" position="right">-->
<!--                    <a-doption>-->
<!--                        <template #default>-->
<!--                            <s-svg-icon :name="'switch'" :size="18" />-->
<!--                            <span class="margin-left-text">{{ $t('system.switch-tenant') }}</span>-->
<!--                            <icon-down style="margin-left: auto; stroke-width: 3" />-->
<!--                        </template>-->
<!--                    </a-doption>-->
<!--                    <template #content>-->
<!--                        <a-doption v-for="tenant in switchableTenants" :key="tenant.id" @click="switchTenant(tenant)">-->
<!--                            <template #default>-->
<!--                                <span>{{ tenant.name }}</span>-->
<!--                            </template>-->
<!--                        </a-doption>-->
<!--                    </template>-->
<!--                </a-dropdown>-->
                <!-- 项目地址 -->
                <a-doption @click="onProject">
                    <template #default>
                        <s-svg-icon :name="'gitee'" :size="18" />
                        <span class="margin-left-text">{{ $t(`system.project-address`) }}</span>
                    </template>
                </a-doption>
                <a-divider margin="0" />
                <!-- 退出登录 -->
                <a-doption @click="logOut">
                    <template #default>
                        <s-svg-icon :name="'exit'" :size="18" />
                        <span class="margin-left-text">{{ $t(`system.logout`) }}</span>
                    </template>
                </a-doption>
            </template>
        </a-dropdown>
    </div>
    <SystemSettings :system-open="systemOpen" @system-cancel="systemOpen = false" />
    <ThemeSettings :theme-open="themeOpen" @theme-cancel="themeOpen = false" />
</template>

<script setup lang="ts">
import Notice from "@/layout/components/Header/components/Notice/index.vue";
import SystemSettings from "@/layout/components/Header/components/system-settings/index.vue";
import ThemeSettings from "@/layout/components/Header/components/theme-settings/index.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useThemeMethods } from "@/hooks/useThemeMethods";
import { useDevicesSize } from "@/hooks/useDevicesSize";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { useNoticeStoreHook } from "@/store/modules/notice";
import { noticeWebSocketClient } from "@/utils/notice-websocket";
import { logout } from "@/api/user";
import { useUserStoreHook } from "@/store/modules/user";

const i18n = useI18n();
const router = useRouter();
const { isMobile } = useDevicesSize();
const themeStore = useThemeConfig();
const { darkMode } = storeToRefs(themeStore);
const account = useUserStoreHook().account;
const noticeStore = useNoticeStoreHook();
const totalNoticeCount = computed(() => noticeStore.unreadCount + noticeStore.businessUnreadCount);

// 判断是否显示切换公司按钮
const showTenantSwitch = computed(() => {
    return account.tenants && account.tenants.some((t: any) => t.id !== account.tenantID);
});

// 判断是否显示全局公司按钮
const showGlobalTenant = computed(() => {
    return (account.defaultTenant === null || account.defaultTenant === undefined) && account.tenantID > 0;
});

// 可切换的公司列表
const switchableTenants = computed(() => {
    if (!account.tenants) return [];
    return account.tenants.filter((t: any) => t.id !== account.tenantID);
});

// 切换公司
const switchTenant = async (tenant: any) => {
    Modal.confirm({
        title: i18n.t('system.switch-tenant-title'),
        content: i18n.t('system.switch-tenant-confirm', { name: tenant.name }),
        hideCancel: false,
        closable: true,
        onBeforeOk: async () => {
            try {
                await useUserStoreHook().switchTenant(tenant.id);
                await useUserStoreHook().getUserInfo();
                window.location.reload();
                return true;
            } catch (error: any) {
                console.error("切换公司失败:", error);
                return false;
            }
        }
    });
};

// 切换到全局公司
const switchToGlobalTenant = async () => {
    Modal.confirm({
        title: i18n.t('system.switch-tenant-title'),
        content: i18n.t('system.switch-global-tenant-confirm'),
        hideCancel: false,
        closable: true,
        onBeforeOk: async () => {
            try {
                await useUserStoreHook().switchTenant(0);
                await useUserStoreHook().getUserInfo();
                window.location.reload();
                return true;
            } catch (error: any) {
                console.error("切换公司失败:", error);
                return false;
            }
        }
    });
};

const handleNoticeVisibleChange = (visible: boolean) => {
    if (visible) {
        noticeStore.markBusinessSeen();
        noticeWebSocketClient.requestSync();
    }
};

// 系统设置
const systemOpen = ref(false);
const onSystemSetting = () => {
    systemOpen.value = true;
};

// 主题设置
const themeOpen = ref(false);
const onThemeSetting = () => {
    themeOpen.value = true;
};

// 全屏
const fullScreen = ref(true);
const onFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullScreen.value = false;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullScreen.value = true;
        }
    }
};

// 黑暗模式
const onNightMode = () => {
    darkMode.value = !darkMode.value;
    let { setDarkMode } = useThemeMethods();
    setDarkMode();
};

// 个人中心
const onPerson = (type: number) => {
    router.push({
        path: "/system/userinfo",
        query: {
            id: account.id,
            userName: account.username,
            type
        }
    });
};

// 项目地址
const onProject = () => {
    window.open("https://github.com/qxkjsoft/ginfast-back", "_blank");
};

// 退出登录
const logOut = () => {
    Modal.warning({
        title: "提示",
        content: "确定退出登录？",
        hideCancel: false,
        closable: true,
        onBeforeOk: async () => {
            try {
                await logout().catch((error: any) => {
                    if (!error.isCancelRequest) {
                        console.warn("退出登录API调用失败，但继续执行本地清理:", error);
                    }
                });
                await useUserStoreHook().logOut();
                router.replace("/login");
                useRouteConfigStore().resetRoute();
                return true;
            } catch {
                return false;
            }
        }
    });
};
</script>

<style lang="scss" scoped>
.head-absolute-fix {
    position: absolute;
    top: 0;
    right: $padding;
}

.header_setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    background-color: $color-bg-2;

    >.icon_btn {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: $icon-box;
        height: $icon-box;
        margin-left: $margin;
        color: $color-text-1;
        border-radius: $radius-box-1;
    }

    .my_setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 32px;
        margin-left: $margin;
        overflow: hidden;

        .my_image {
            margin-right: 8px;
            border-radius: 50%;
        }

        .user-nickname {
            white-space: nowrap;
        }

        .icon_down {
            margin: 0 0 0 5px;
            transform: rotate(0deg);
            transition: transform 0.2s;
        }
    }
}

.notice {
    position: relative;
}

.notice-badge {
    :deep(.arco-badge-number) {
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        font-size: 11px;
        font-weight: 700;
        line-height: 18px;
        box-shadow: 0 0 0 2px $color-bg-2;
    }
}

:deep(.arco-dropdown-open) {
    .icon_down {
        transform: rotate(180deg) !important;
    }
}

.margin-left-text {
    margin-left: $margin-text;
}
</style>
