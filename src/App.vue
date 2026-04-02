<template>
    <div>
        <router-view />
      <a-tooltip :content="isPlaying ? '关闭提醒将不再进行客户跟进播报' : '开启客户跟进语音播报'" v-if="isLoggedIn">
        <div
          class="audio-float-btn"
          :class="{ playing: isPlaying }"
          @click="toggleAudio"
        >
          <icon-sound :class="{ active: isPlaying }" />
        </div>
      </a-tooltip>
    </div>
</template>

<script setup lang="ts">
import { useThemeMethods } from "@/hooks/useThemeMethods";
import { useSysConfigStore } from "@/store/modules/sys-config";
import { watch, onMounted, ref, computed } from "vue";
import { audioManager } from "@/utils/audio-manager";
import { useUserStore } from "@/store/modules/user";
import { useNoticeStore } from "@/store/modules/notice";
import { noticeWebSocketClient } from "@/utils/notice-websocket";
import { IconSound } from '@arco-design/web-vue/es/icon';
import { Modal } from '@arco-design/web-vue';

// 初始化主题
const onTheme = () => {
    let { initTheme } = useThemeMethods();
    initTheme();
};
onTheme();

// 初始化系统配置
const initSysConfig = () => {
    const sysConfigStore = useSysConfigStore();
    // 获取系统配置，不等待完成，避免阻塞应用启动
    sysConfigStore.getConfig().then(() => {
        // 设置网站图标
        setFavicon(sysConfigStore.systemIcon);
        // 设置网站标题
        setTitle(sysConfigStore.systemConfig.systemName);
    }).catch((error: unknown) => {
        console.warn("获取系统配置失败，将使用默认配置:", error);
    });
};

// 设置网站图标
const setFavicon = (iconUrl: string) => {
    if (!iconUrl) {
        // 如果没有传入图标，使用默认图标
        setDefaultFavicon();
        return;
    }

    // 创建测试图片来验证图标是否可加载
    const testImg = new Image();
    testImg.onload = () => {
        // 图标加载成功，移除现有的favicon并设置新图标
        const links = document.querySelectorAll("link[rel='icon']");
        links.forEach(link => {
            link.remove();
        });

        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = iconUrl;
        document.head.appendChild(link);
    };
    testImg.onerror = () => {
        // 图标加载失败，使用默认图标
        console.warn(`图标加载失败: ${iconUrl}，使用默认图标`);
        setDefaultFavicon();
    };
    testImg.src = iconUrl;
};

// 设置默认图标的辅助方法
const setDefaultFavicon = () => {
    const defaultIconUrl = 'src/assets/sys/default.ico';
    const links = document.querySelectorAll("link[rel='icon']");
    links.forEach(link => {
        link.remove();
    });

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = defaultIconUrl;
    document.head.appendChild(link);
};

// 设置网站标题
const setTitle = (title: string) => {
    if (title) {
        document.title = title;
    }
};

// 监听系统配置变化
const sysConfigStore = useSysConfigStore();
watch(
    () => sysConfigStore.systemIcon,
    (newIcon) => {
        if (newIcon) {
            setFavicon(newIcon);
        }
    },
    { immediate: true }
);

// 监听系统名称变化
watch(
    () => sysConfigStore.systemConfig.systemName,
    (newName) => {
        if (newName) {
            setTitle(newName);
        }
    },
    { immediate: true }
);

initSysConfig();

// 音频控制
const userStore = useUserStore();
const noticeStore = useNoticeStore();
const isLoggedIn = computed(() => userStore.account.id > 0);
const isPlaying = ref(false);

const toggleAudio = () => {
    isPlaying.value = audioManager.toggle();
};

// 显示授权弹窗
const showPermissionModal = () => {
    Modal.confirm({
        title: '提示',
        content: '是否开启语音播报？',
        okText: '开启',
        cancelText: '不再提示',
        onOk: () => {
            isPlaying.value = audioManager.toggle();
        },
        onCancel: () => {
            localStorage.setItem('audio_no_prompt', 'true');
        }
    });
};

// 页面加载时处理
onMounted(() => {
    if (!isLoggedIn.value) return;

    const noPrompt = localStorage.getItem('audio_no_prompt') === 'true';

    // 设置播放失败回调
    audioManager.onPlayError = () => {
        isPlaying.value = false;
        localStorage.setItem('audio_playing', 'false');
        if (!noPrompt) {
            showPermissionModal();
        }
    };

    // 首次登录弹窗
    if (!audioManager.hasInteracted() && !noPrompt) {
        showPermissionModal();
    } else if (audioManager.isPlaying()) {
        audioManager.play();
        isPlaying.value = true;
    }
});

watch(
    () => [isLoggedIn.value, userStore.account.id, userStore.account.tenantID],
    ([loggedIn, userId, tenantId], previous) => {
        if (loggedIn && userId > 0) {
            if (previous && (previous[1] !== userId || previous[2] !== tenantId)) {
                noticeWebSocketClient.disconnect();
            }
            noticeWebSocketClient.ensureConnected();
            return;
        }
        noticeWebSocketClient.disconnect();
        noticeStore.reset();
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.audio-float-btn {
  position: fixed;
  right: 50px;
  bottom: 100px;
  width: 50px;
  height: 50px;
  background: #999;          // 未播放时的颜色（灰色示例）
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  z-index: 9999;

  &:hover {
    background: #bbb;        // 未播放时的 hover 颜色（可选）
  }

  // 播放时的样式
  &.playing {
    background: #165dff;     // 播放时的颜色（蓝色示例）
    &:hover {
      background: #4080ff;   // 播放时的 hover 颜色
    }
  }

  :deep(svg) {
    font-size: 24px;
    color: #fff;
  }

  .active {
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
</style>
