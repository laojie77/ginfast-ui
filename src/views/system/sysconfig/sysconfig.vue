<template>
    <div class="snow-fill">
        <div class="snow-fill-inner">
            <s-layout-tools>
                <template #right>
                    <a-space>
                        <a-button type="primary" @click="onSave" v-hasPerm="['system:config:update']">
                            <template #icon>
                                <icon-save />
                            </template>
                            <span>保存配置</span>
                        </a-button>
                    </a-space>
                </template>
            </s-layout-tools>

            <a-tabs v-model:active-key="activeTab" :animation="true">
                <!-- 服务器配置 -->
                <a-tab-pane key="server" title="服务器配置">
                    <a-card :bordered="false" class="mb-4">
                        <a-form :layout="layoutMode.layout" :model="configData.system" auto-label-width>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <a-form-item field="systemLogo" label="系统Logo">
                                        <!-- 图片上传组件 -->
                                        <ImageUpload :width="50" :height="50"
                                            v-model="configData.system.systemLogo" :title="'系统Logo'"
                                            :accept="'.svg'" />
                                        <template #extra>
                                            <div>显示在登录页面和系统导航栏的网站图标（建议 .svg 格式）</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="24">
                                    <a-form-item field="systemIcon" label="系统图标">
                                        <!-- 图片上传组件 -->
                                        <ImageUpload :width="50" :height="50"
                                            v-model="configData.system.systemIcon" :title="'系统图标'"
                                            :accept="'.ico'" />
                                        <template #extra>
                                            <div>浏览器标签页显示的网站图标（建议 .ico 格式）</div>
                                        </template>
                                    </a-form-item>
                                </a-col>

                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="systemName" label="系统名称">
                                        <a-input v-model="configData.system.systemName" placeholder="请输入系统名称" />
                                        <template #extra>
                                            <div>显示在浏览器标题栏和登录界面的系统名称</div>
                                        </template>
                                    </a-form-item>
                                </a-col>

                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="systemCopyright" label="版权信息">
                                        <a-input v-model="configData.system.systemCopyright" placeholder="请输入版权信息" />
                                        <template #extra>
                                            <div>显示在页面底部的版权声明文本</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="systemRecordNo" label="备案号">
                                        <a-input v-model="configData.system.systemRecordNo" placeholder="请输入备案号" />
                                        <template #extra>
                                            <div>工信部 ICP 备案编号 如：粤ICP备12345678号</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="defaultusername" label="默认用户名">
                                        <a-input v-model="configData.system.defaultusername" placeholder="请输入默认用户名" />
                                        <template #extra>
                                            <div>系统默认登录用户名</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="defaultpassword" label="默认密码">
                                        <a-input-password v-model="configData.system.defaultpassword" placeholder="请输入默认密码" />
                                        <template #extra>
                                            <div>系统默认登录密码</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </a-card>
                </a-tab-pane>

                <!-- 验证码配置 -->
                <a-tab-pane key="captcha" title="验证码配置">
                    <a-card :bordered="false" class="mb-4">
                        <a-form  :layout="layoutMode.layout" :model="configData.captcha" auto-label-width>
                            <a-row :gutter="24">
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="open" label="启用验证码">
                                        <a-switch v-model="configData.captcha.open">
                                            <template #checked>开启</template>
                                            <template #unchecked>关闭</template>
                                        </a-switch>
                                    </a-form-item>
                                </a-col>

                            </a-row>

                            <a-row :gutter="24">
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="length" label="验证码长度">
                                        <a-input-number v-model="configData.captcha.length" :min="4" :max="8"
                                            placeholder="请输入验证码长度" />
                                        <template #extra>
                                            <div>验证码字符长度，默认4位</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                        </a-form>
                    </a-card>
                </a-tab-pane>

                <!-- 安全配置 -->
                <a-tab-pane key="safe" title="安全配置">
                    <a-card :bordered="false" class="mb-4">
                        <a-form :layout="layoutMode.layout" :model="configData.safe" auto-label-width>
                            <a-row :gutter="24">
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="loginLockThreshold" label="登录失败锁定阈值(次)">
                                        <a-input-number v-model="configData.safe.loginLockThreshold" :min="0" :max="10"
                                            placeholder="请输入登录失败次数" />
                                        <template #extra>
                                            <div>指定时间内登录失败次数达到此阈值后，账号将被锁定，0表示不限制</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="loginLockExpire" label="登录失败次数缓存时间(秒)">
                                        <a-input-number v-model="configData.safe.loginLockExpire" :min="1" :max="1440"
                                            placeholder="请输入缓存时间" />
                                        <template #extra>
                                            <div>指定时间内登录失败次数缓存时间，单位秒</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="loginLockDuration" label="账号锁定时长(秒)">
                                        <a-input-number v-model="configData.safe.loginLockDuration" :min="1" :max="1440"
                                            placeholder="请输入锁定时长" />
                                        <template #extra>
                                            <div>账号锁定时长，单位秒</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="minPasswordLength" label="密码最小长度">
                                        <a-input-number v-model="configData.safe.minPasswordLength" :min="6" :max="32"
                                            placeholder="请输入密码最小长度" />
                                        <template #extra>
                                            <div>密码最小长度，默认6位</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="requireSpecialChar" label="密码必须包含特殊字符">
                                        <a-switch v-model="configData.safe.requireSpecialChar">
                                            <template #checked>是</template>
                                            <template #unchecked>否</template>
                                        </a-switch>
                                        <template #extra>
                                            <div>是否要求密码必须包含特殊字符（如：!@#$%）</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </a-card>
                </a-tab-pane>

                <!-- 导出配置 -->
                <a-tab-pane key="platform" title="平台配置">
                    <a-card :bordered="false" class="mb-4">
                        <a-form :layout="layoutMode.layout" :model="configData.platform" auto-label-width>
                            <a-row :gutter="24">
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="exportAsyncThreshold" label="异步导出阈值">
                                        <a-input-number
                                            v-model="configData.platform.exportAsyncThreshold"
                                            :min="0"
                                            placeholder="请输入异步导出阈值"
                                        />
                                        <template #extra>
                                            <div>导出总数大于该值时走异步导出，设置为 0 可强制全部走异步，方便测试。</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="isMobile ? 24 : 12">
                                    <a-form-item field="exportCleanDays" label="导出清理天数">
                                        <a-input-number
                                            v-model="configData.platform.exportCleanDays"
                                            :min="0"
                                            placeholder="请输入导出清理天数"
                                        />
                                        <template #extra>
                                            <div>仅清理客户导出文件。设置为 0 表示每次导出前立马清理历史导出文件，大于 0 表示按天数保留。</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                              <a-col :span="isMobile ? 24 : 12">
                                <a-form-item field="customerExportWorkerCount" label="导出wor进程数量">
                                  <a-input-number
                                    v-model="configData.platform.customerExportWorkerCount"
                                    :min="0"
                                    placeholder="请输入导出wor进程数量"
                                  />
                                  <template #extra>
                                    <div>后台消费导出任务的工人线程/协程数量，0表示不设置，系统默认为2 </div>
                                  </template>
                                </a-form-item>
                              </a-col>
                              <a-col :span="isMobile ? 24 : 12">
                                <a-form-item field="watermark" label="是否开启水印">
                                  <a-switch v-model="configData.platform.watermark">
                                    <template #checked>开启</template>
                                    <template #unchecked>关闭</template>
                                  </a-switch>
                                </a-form-item>
                              </a-col>
                            </a-row>
                        </a-form>
                    </a-card>
                </a-tab-pane>

                <!-- 客户资质配置 -->
                <a-tab-pane key="customerExtra" title="客户资质配置">
                    <div class="customer-extra-container">
                        <div class="customer-extra-content">
                            <div v-for="(options, category) in configData.customerExtra" :key="category" class="category-section">
                                <a-card :bordered="false" class="category-card">
                                    <template #title>
                                        <div class="category-title">
                                            <icon-settings class="category-icon" />
                                            <span>{{ getCategoryLabel(category) }}</span>
                                        </div>
                                    </template>
                                    
                                    <a-form :layout="layoutMode.layout" :model="options" auto-label-width>
                                        <a-row :gutter="[16, 16]">
                                            <a-col v-for="(label, value) in options" :key="value" :span="isMobile ? 24 : 8">
                                                <a-form-item :label="`选项 ${value}`" class="option-item">
                                                    <a-input 
                                                        v-model="configData.customerExtra[category][value]" 
                                                        :placeholder="`请输入${getCategoryLabel(category)}选项${value}的名称`"
                                                        size="large" />
                                                </a-form-item>
                                            </a-col>
                                        </a-row>
                                        
                                        <a-divider />
                                        
                                        <div class="action-buttons">
                                            <a-space>
                                                <a-button type="primary" @click="addOption(category)" size="small">
                                                    <template #icon><icon-plus /></template>
                                                    添加选项
                                                </a-button>
                                                <a-button 
                                                    type="outline" 
                                                    status="danger" 
                                                    @click="removeLastOption(category)" 
                                                    :disabled="Object.keys(options).length <= 1"
                                                    size="small">
                                                    <template #icon><icon-minus /></template>
                                                    删除选项
                                                </a-button>
                                            </a-space>
                                        </div>
                                    </a-form>
                                </a-card>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IconPlus, IconMinus, IconSettings } from '@arco-design/web-vue/es/icon';
import { useSysConfigStore } from '@/store/modules/sys-config';
// 引入图片上传组件
import ImageUpload from '@/components/upload/image-upload.vue';
import { useDevicesSize } from "@/hooks/useDevicesSize";

const { isMobile } = useDevicesSize();
const layoutMode = computed(() => {
  let info = {
    mobile: {
      width: "95%",
      layout: "vertical"
    },
    desktop: {
      width: "40%",
      layout: "horizontal"
    }
  };
  return isMobile.value ? info.mobile : info.desktop;
});

const activeTab = ref('server');

// 使用系统配置 store
const sysConfigStore = useSysConfigStore();

// 配置数据（使用 store 中的数据）
const configData = ref({
    system: sysConfigStore.systemConfig,
    captcha: sysConfigStore.captchaConfig,
    safe: sysConfigStore.safeConfig,
    platform: sysConfigStore.platformConfig,
    customerExtra: {}
});

// 客户资质类别标签映射
const categoryLabels = {
    occupation: '职业',
    house: '房产',
    car: '车产',
    creditcard: '信用卡',
    insurance: '商业保险',
    housefund: '公积金',
    socialinsurance: '社保',
    zhimascore: '芝麻分',
    salarymoney: '月薪',
    education: '学历'
};

// 获取类别标签
const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || category;
};

// 添加选项
const addOption = (category: string) => {
    const options = configData.value.customerExtra[category];
    const maxKey = Math.max(...Object.keys(options).map(k => parseInt(k)));
    const newKey = (maxKey + 1).toString();
    options[newKey] = '';
};

// 删除最后一个选项
const removeLastOption = (category: string) => {
    const options = configData.value.customerExtra[category];
    const keys = Object.keys(options);
    if (keys.length > 1) {
        const maxKey = Math.max(...keys.map(k => parseInt(k))).toString();
        delete options[maxKey];
    }
};

// 获取配置信息
const getConfig = async () => {
    try {
        await sysConfigStore.getConfig();
        // 更新本地引用
        configData.value = {
            system: sysConfigStore.systemConfig,
            captcha: sysConfigStore.captchaConfig,
            safe: sysConfigStore.safeConfig,
            platform: sysConfigStore.platformConfig,
            customerExtra: sysConfigStore.customerExtraConfig || {}
        };
    } catch (error) {
        console.error('获取配置失败:', error);
        arcoMessage('error', '获取配置失败');
    }
};

// 保存配置
const onSave = async () => {
    try {
        await sysConfigStore.updateConfig(configData.value);
        arcoMessage('success', '保存成功');
    } catch (error) {
        console.error('保存配置失败:', error);
        arcoMessage('error', '保存配置失败');
    }
};

onMounted(() => {
    getConfig();
});
</script>

<style lang="scss" scoped>
.mb-4 {
    margin-bottom: 1rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

:deep(.arco-card-body) {
    padding: 20px;
}

// 客户资质配置样式
.customer-extra-container {
    height: calc(100vh - 250px); // 减少高度计算，给更多显示空间
    overflow: hidden;
    
    .customer-extra-content {
        height: 100%;
        overflow-y: auto;
        padding-right: 8px;
        padding-bottom: 60px; // 增加底部padding确保最后一项完全显示
        
        // 自定义滚动条样式
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
            
            &:hover {
                background: #a8a8a8;
            }
        }
    }
}

.category-section {
    margin-bottom: 24px;

    // 确保最后一个元素也有足够的底部间距
    &:last-child {
        //margin-bottom: 40px; // 增加最后一个卡片的底部间距
    }
}

.category-card {
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border-color: #165dff;
    }
    
    :deep(.arco-card-header) {
        background: linear-gradient(135deg, #f7f8fa 0%, #ffffff 100%);
        border-bottom: 1px solid #e5e6eb;
        padding: 16px 20px;
    }
    
    :deep(.arco-card-body) {
        padding: 20px;
    }
}

.category-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #1d2129;
    
    .category-icon {
        margin-right: 8px;
        color: #165dff;
        font-size: 18px;
    }
}

.option-item {
    :deep(.arco-form-item-label) {
        font-weight: 500;
        color: #4e5969;
    }
    
    :deep(.arco-input-wrapper) {
        border-radius: 6px;
        transition: all 0.3s ease;
        
        &:hover {
            border-color: #165dff;
        }
        
        &:focus-within {
            border-color: #165dff;
            box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
        }
    }

    :deep(.arco-input) {
        background: transparent;
    }
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    
    :deep(.arco-btn) {
        border-radius: 6px;
        font-weight: 500;
        
        &.arco-btn-primary {
            background: linear-gradient(135deg, #165dff 0%, #246fff 100%);
            border: none;
            
            &:hover {
                background: linear-gradient(135deg, #0e42d2 0%, #1a5cff 100%);
            }
        }
        
        &.arco-btn-outline {
            &.arco-btn-status-danger {
                &:hover {
                    background: #fff2f0;
                }
            }
        }
    }
}

:deep(.arco-divider) {
    margin: 16px 0;
    border-color: #f2f3f5;
}

// 响应式设计
@media (max-width: 768px) {
    .customer-extra-container {
        height: calc(100vh - 150px);
    }
    
    .category-card {
        :deep(.arco-card-header) {
            padding: 12px 16px;
        }
        
        :deep(.arco-card-body) {
            padding: 16px;
        }
    }
    
    .category-title {
        font-size: 14px;
        
        .category-icon {
            font-size: 16px;
        }
    }
}
</style>
