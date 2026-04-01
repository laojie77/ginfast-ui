<template>
    <div class="editor—wrapper" >
        <Toolbar 
            class="toolbar-container"
            :editor="editorRef" 
            :default-config="toolbarConfig" 
            :mode="mode" 
        />
        <Editor
            class="editor-container"
            v-model="content"
            :default-config="editorConfig"
            :mode="mode"
            @on-created="handleCreated"
        />
    </div>
</template>

<script setup lang="ts">
import { shallowRef, onBeforeUnmount, computed } from 'vue';
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from '@wangeditor/editor'
import "@wangeditor/editor/dist/css/style.css";
import { uploadAffixAPI } from "@/api/file";
import { handleUrl } from "@/utils/app";
import { Message } from "@arco-design/web-vue";

interface Props {
    /**
     * 编辑器内容，绑定的 v-model 值
     */
    modelValue?: string;

    /**
     * 编辑器占位符
     */
    placeholder?: string;
    /**
     * 编辑器模式: 'default' | 'simple'
     */
    mode?: 'default' | 'simple';
    /**
     * 工具栏配置
     */
    toolbarConfig?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '请输入内容...',
    mode: 'default',
    toolbarConfig: () => ({})
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
}>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容双向绑定
const content = computed({
    get(): string {
        return props.modelValue || '';
    },
    set(value: string) {
        emit('update:modelValue', value);
        emit('change', value);
    }
});

// 工具栏配置
const toolbarConfig = props.toolbarConfig || {};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    MENU_CONF: {
        uploadImage: {
            onBeforeUpload(file: File) {
                return file;
            },
            async customUpload(file: File, insertFn: any) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await uploadAffixAPI(formData);
                    insertFn(handleUrl(res.data.url), "", "");
                } catch (error) {
                    Message.error("上传图片失败");
                }
            },
        },
        uploadVideo: {
            onBeforeUpload(file: File) {
                return file;
            },
            async customUpload(file: File, insertFn: any) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await uploadAffixAPI(formData);
                    insertFn(handleUrl(res.data.url), "", "");
                } catch (error) {
                    Message.error("上传视频失败");
                }
            },
        },
    }
};

const mode = props.mode || "default";

// 编辑器创建完成回调
const handleCreated = (editor: any) => {
    editorRef.value = editor;
};

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
</script>

<style lang="scss">
.editor—wrapper {
    max-width: 900px;
    margin: 0 auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 100;

    .toolbar-container {
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 8px 12px;
    }

    .editor-container {
        overflow-y: hidden;
        background-color: #ffffff;
    }
}

.w-e-text-container .w-e-scroll {
    height: 400px !important;
    -webkit-overflow-scrolling: touch;
}
</style>
