<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false">
        <a-form :model="searchForm" :layout="layoutMode.layout" label-align="left" auto-label-width>
          <a-row :gutter="16">
            <a-col :span="isMobile ? 24 : 6">
              <!-- 查询表单-->
              <!-- 名称模糊查询（仅非数值类型支持） -->
              <a-form-item field="channelName" label="渠道名称">
                <a-input-search v-model="searchForm.channelName" placeholder="请输入名称搜索" @search="handleSearch" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 24 : 6">
              <!-- 渠道码精确查询 -->
              <a-form-item field="channelKey" label="渠道码">
                <a-input v-model="searchForm.channelKey" placeholder="请输入渠道码" />
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 24 : 6">
              <a-form-item field="hiddenCode" label="渠道公司">
                <a-input v-model="searchForm.hiddenCode" placeholder="请输入渠道公司名称" />
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 24 : 6">
              <!-- 状态选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="status" label="状态">
                <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear>
                  <a-option v-for="item in statusOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-space wrap>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleCreate" v-hasPerm="['plugins:syschannelsyschannel:add']">
                  <template #icon>
                    <icon-plus />
                  </template>
                  <span>新增数据</span>
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>

        <a-table :data="dataList" :loading="loading" :pagination="paginationConfig"
                 :bordered="{ wrapper: true, cell: true }" @page-change="handlePageChange"
                 @page-size-change="handlePageSizeChange">
          <template #columns>
            <!--                    <a-table-column title="Id" data-index="id"  :width="50"  ellipsis tooltip/>-->
            <a-table-column title="名称" data-index="channelName"  :width="100"  ellipsis tooltip/>
            <a-table-column title="渠道码" data-index="channelKey"  :width="100"  ellipsis tooltip/>
            <a-table-column title="渠道公司名称" data-index="hiddenCode"  :width="100"  ellipsis tooltip/>
            <a-table-column title="渠道密钥" data-index="secretKey"  :width="180"  ellipsis tooltip/>
            <a-table-column title="总进件数量" data-index="total"  :width="100"  ellipsis tooltip/>
            <a-table-column title="优质率" data-index="rate"  :width="80"  ellipsis tooltip/>
            <a-table-column title="状态" data-index="status" :width="70" align="center">
              <template #cell="{ record }">
                <a-tag bordered size="small" :color="record.status === 1 ? 'arcoblue' : 'red'">
                  {{ messageTypeOption[record.status]?.name }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="开始时间" data-index="startTime"  :width="100"  ellipsis tooltip/>
            <a-table-column title="结束时间" data-index="endTime"  :width="100"  ellipsis tooltip/>
<!--            <a-table-column title="数据类型" data-index="type"  :width="150"  ellipsis tooltip/>-->
<!--            <a-table-column title="短信" data-index="messageType"  :width="150"  ellipsis tooltip/>-->
<!--            <a-table-column title="是否查重" data-index="isRepeat"  :width="150"  ellipsis tooltip/>-->
            <a-table-column title="操作" :width="200" :fixed="isMobile ? undefined : 'right'">
              <template #cell="{ record }">
                <a-space>
                  <a-link status="success"
                          @click="handleCompanyConfig(record)"
                          v-hasPerm="['plugins:syschannelcompanysyschannelcompany:list']">
                    <template #icon><icon-file /></template>
                    <span>公司配置({{ record.channelCompanyList ? record.channelCompanyList.length : 0 }})</span>
                  </a-link>
                  <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syschannelsyschannel:edit']">
                    编辑
                  </a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="['plugins:syschannelsyschannel:delete']">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>

      </a-card>

      <!-- 公司配置弹窗 -->
      <a-modal v-model:visible="companyModalVisible" title="公司配置" :width="isMobile ? '95%' : 1000" @cancel="handleCompanyModalCancel">
        <a-space wrap style="margin-bottom: 16px;">
          <a-button type="primary" @click="handleCompanyCreate" v-hasPerm="['plugins:syschannelcompanysyschannelcompany:add']">
            <template #icon><icon-plus /></template>
            <span>新增配置</span>
          </a-button>
        </a-space>
        <a-table :data="currentChannelCompanyList" :loading="false" :pagination="false"
                 :bordered="{ wrapper: true, cell: true }">
          <template #columns>
            <a-table-column title="公司平台" data-index="tenantId" :width="120" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getTenantName(record.tenantId) }}
              </template>
            </a-table-column>
            <a-table-column title="城市" data-index="city" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.city }}
              </template>
            </a-table-column>
            <a-table-column title="优质率" data-index="rate" :width="100" ellipsis tooltip/>
            <a-table-column title="总进件数" data-index="quantity" :width="100" ellipsis tooltip/>
            <a-table-column title="回传" data-index="isStar" :width="100" align="center">
              <template #cell="{ record }">
                <a-tag bordered size="small" :color="record.isStar === 1 ? 'arcoblue' : 'red'">
                  {{ messageTypeOption[record.isStar]?.name }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="字段映射" data-index="fieldMappings" :width="300" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tooltip :content="formatFieldMappings(record.fieldMappings)" mini>
                  <span>{{ formatFieldMappings(record.fieldMappings, true) }}</span>
                </a-tooltip>
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="200" :fixed="isMobile ? undefined : 'right'">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleCompanyEdit(record)" v-hasPerm="['plugins:syschannelcompanysyschannelcompany:edit']">
                    编辑
                  </a-button>
                  <a-popconfirm content="确定要删除这条配置吗？" @ok="handleCompanyDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="['plugins:syschannelcompanysyschannelcompany:delete']">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <!-- 公司配置编辑/创建弹窗 -->
      <a-modal v-model:visible="companyEditModalVisible" :title="companyEditingData.id ? '编辑配置' : '新增配置'" :on-before-ok="handleCompanySave"
               @cancel="handleCompanyEditModalCancel" :width="isMobile ? '95%' : 'auto'">
        <a-form :model="companyEditingData" ref="companyFormRef" label-align="left" :layout="layoutMode.layout" :auto-label-width="true">
          <a-form-item field="tenantId" label="公司平台" :rules="[{ required: true, message: '请选择公司平台' }]">
            <a-select v-model="companyEditingData.tenantId" placeholder="请选择公司平台" style="width: 100%">
              <a-option v-for="item in tenantList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="city" label="城市" :rules="[{ required: true, message: '请选择城市' }]">
            <a-select v-model="companyEditingData.city" placeholder="请选择城市" style="width: 100%">
              <a-option v-for="item in cityOption" :key="item.value" :value="item.value">{{ item.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="isStar" label="回传">
            <a-radio-group v-model="companyEditingData.isStar">
              <a-radio v-for="item in messageTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="fieldMappings" label="字段映射配置">
            <div class="field-mappings-container">
              <div v-for="(mapping, index) in companyEditingData.fieldMappings" :key="index" class="mapping-item">
                <a-space>
                  <a-input v-model="mapping.sourceField" placeholder="源字段" style="width: 120px" />
                  <span>→</span>
                  <a-input v-model="mapping.targetField" placeholder="目标字段" style="width: 120px" />
                  <a-select v-model="mapping.mappingType" placeholder="映射类型" style="width: 120px">
                    <a-option value="direct">直接映射</a-option>
                    <a-option value="static">静态值</a-option>
                    <a-option value="transform">转换映射</a-option>
                  </a-select>
                  <a-input v-if="mapping.mappingType === 'static'" v-model="mapping.staticValue" placeholder="静态值" style="width: 120px" />
                  <a-input v-if="mapping.mappingType === 'transform'" v-model="mapping.transformRules" placeholder="转换规则" style="width: 200px" />
                  <a-button @click="removeFieldMapping(index)" status="danger" size="small">删除</a-button>
                </a-space>
              </div>
              <a-button @click="addFieldMapping" type="outline" size="small">
                <template #icon><icon-plus /></template>
                添加字段映射
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 编辑/创建弹窗 -->
      <a-modal v-model:visible="modalVisible" :title="editingData.id ? '编辑数据' : '新增数据'" :on-before-ok="handleSave"
               @cancel="handleCancel" :width="layoutMode.width">
        <a-form :model="editingData" :rules="rules" ref="formRef" :layout="layoutMode.layout">
          <a-form-item field="channelName" label="名称"><a-input v-model="editingData.channelName" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="channelKey" label="渠道码"><a-input v-model="editingData.channelKey" placeholder="请输入渠道码" />
          </a-form-item>
          <a-form-item field="hiddenCode" label="渠道公司名称"><a-input v-model="editingData.hiddenCode" placeholder="请输入渠道公司名称" />
          </a-form-item>
          <a-form-item field="starUrl" label="星级回传地址"><a-input v-model="editingData.starUrl" placeholder="请输入星级回传地址" />
          </a-form-item>
          <a-form-item field="successCodeField" label="成功码字段名">
            <a-input v-model="editingData.successCodeField"  style="width: 200px" />
            <template #extra>
              <div>渠道回传数据时，响应中表示成功状态的字段名,如code,status</div>
            </template>
          </a-form-item>
          <a-form-item field="successCode" label="成功返回码">
            <a-input v-model="editingData.successCode"  style="width: 200px" />
            <template #extra>
              <div>渠道回传数据时，用于判断响应是否成功的返回码,如：0, 1, 200</div>
            </template>
          </a-form-item>
          <a-form-item field="remark" label="备注"><a-input v-model="editingData.remark" placeholder="请输入备注" />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-radio-group v-model="editingData.status">
              <a-radio v-for="item in statusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <!--                <a-form-item field="startTime" label="开始时间"><a-date-picker value-format="YYYY-MM-DDTHH:mm:ss[Z]" v-model="editingData.startTime" placeholder="请选择开始时间" />-->
          <!--                </a-form-item>-->
          <!--                <a-form-item field="endTime" label="结束时间"><a-date-picker value-format="YYYY-MM-DDTHH:mm:ss[Z]" v-model="editingData.endTime" placeholder="请选择结束时间" />-->
          <!--                </a-form-item>-->
          <a-form-item field="workStartTime" label="工作时间">
            <a-time-picker
              type="time-range"
              v-model="workTimeRange"
              placeholder="请选择接收时间范围"
            />
            <template #extra>
              <div>数据接收开始时间和结束时间</div>
            </template>
          </a-form-item>
          <a-form-item field="type" label="数据类型">
            <a-radio-group v-model="editingData.type">
              <a-radio v-for="item in typeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="messageType" label="短信">
            <a-radio-group v-model="editingData.messageType">
              <a-radio v-for="item in messageTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="isRepeat" label="是否查重">
            <a-radio-group v-model="editingData.isRepeat">
              <a-radio v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useSysChannelPluginHook } from '../../hooks/syschannel';
import { useSysChannelCompanyPluginHook } from '../../../syschannelcompany/hooks/syschannelcompany';
import type { SysChannelData } from '../../api/syschannel';
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
import { Message } from '@arco-design/web-vue';
import { IconFile } from '@arco-design/web-vue/es/icon';
import { getTenantList } from '@/api/tenant';
const { isMobile } = useDevicesSize();

// 弹窗布局配置
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
const statusOption = ref(dictFilter("status"));
const typeOption = ref(dictFilter("type"));
const tenantList = ref<any[]>([]);
const cityOption = ref(dictFilter("city"));
const messageTypeOption = ref(dictFilter("status"));
const isStatusOption = ref(dictFilter("isStatus"));
const {
  dataList,
  loading,
  total,
  currentPage,
  pageSize,
  fetchDataList,
  createData,
  updateData,
  deleteData,
  getDetail,
  resetSearchParams
} = useSysChannelPluginHook();
const {
  currentPage: companyCurrentPage,
  pageSize: companyPageSize,
  fetchDataList: fetchCompanyDataList,
  createData: createCompanyData,
  updateData: updateCompanyData,
  deleteData: deleteCompanyData,
} = useSysChannelCompanyPluginHook();

const modalVisible = ref(false);
const companyModalVisible = ref(false);
const companyEditModalVisible = ref(false);
const formRef = ref();
const companyFormRef = ref();
const currentChannelId = ref<number | undefined>(undefined);
const currentChannelCompanyList = ref<any[]>([]);

// 搜索表单
const searchForm = reactive({
  channelName: '',
  channelKey: '',
  hiddenCode: '',
  status: undefined,
});

const editingData = reactive<Partial<SysChannelData>>({
  id: undefined,
  channelName: undefined,
  channelKey: undefined,
  hiddenCode: undefined,
  secretKey: undefined,
  starUrl: undefined,
  total: undefined,
  rate: undefined,
  remark: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  type: 1,
  messageType: undefined,
  isRepeat: undefined,
  successCode: '',
  successCodeField: '',
});


const rules = {
  channelName: [{ required: true, message: '渠道名称不能为空' }],
  channelKey: [{ required: true, message: '渠道码不能为空' }],
  status: [{ required: true, message: '状态不能为空' }],
  startTime: [{ required: true, message: '开始时间不能为空' }],
  endTime: [{ required: true, message: '结束时间不能为空' }],
  type: [{ required: true, message: '数据类型不能为空' }],
  messageType: [{ required: true, message: '短信不能为空' }],
  isRepeat: [{ required: true, message: '是否查重不能为空' }],
};

// 计算属性：用于前端时间范围选择器
const workTimeRange = computed({
  get: () => {
    if (editingData.startTime && editingData.endTime) {
      return [editingData.startTime, editingData.endTime]
    }
    return []
  },
  set: (value: string[]) => {
    if (Array.isArray(value) && value.length === 2) {
      editingData.startTime = value[0] || ''
      editingData.endTime = value[1] || ''
    } else {
      editingData.startTime = ''
      editingData.endTime = ''
    }
  }
})

// 分页配置
const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50],
}));

// 获取数据列表
const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params: any = {
    pageNum,
    pageSize: pageSizeVal,
  };
  if (searchForm.channelName) {
    params.channelName = searchForm.channelName;
  }
  if (searchForm.channelKey) {
    params.channelKey = searchForm.channelKey;
  }
  if (searchForm.hiddenCode) {
    params.hiddenCode = searchForm.hiddenCode;
  }
  if (searchForm.status) {
    params.status = searchForm.status;
  }
  await fetchDataList(params);
};

// 加载公司配置数据
const loadCompanyData = async (pageNum: number = companyCurrentPage.value, pageSizeVal: number = companyPageSize.value) => {
  if (!currentChannelId.value) return;
  const params: any = {
    channelId: currentChannelId.value,
    pageNum,
    pageSize: pageSizeVal,
  };
  await fetchCompanyDataList(params);
};

// 处理分页变化
const handlePageChange = (page: number) => {
  loadData(page, pageSize.value);
};

// 处理页面大小变化
const handlePageSizeChange = (size: number) => {
  loadData(1, size); // 页码重置为1
};

// 搜索处理
const handleSearch = () => {
  loadData(1); // 搜索时重置到第一页
};

// 重置搜索
const handleReset = () => {
  searchForm.channelName = '';
  searchForm.channelKey = '';
  searchForm.hiddenCode = '';
  searchForm.status = undefined;
  resetSearchParams();
  loadData(1);
};

// 新增数据
const handleCreate = () => {
  // 重置表单数据
  Object.assign(editingData, {
    id: undefined,
    channelName: undefined,
    channelKey: undefined,
    hiddenCode: undefined,
    secretKey: undefined,
    starUrl: undefined,
    total: undefined,
    rate: undefined,
    remark: undefined,
    status: 1,
    startTime: undefined,
    endTime: undefined,
    type: 1,
    messageType: 0,
    isRepeat: 1,
    successCode: '',
    successCodeField: '',
  });
  modalVisible.value = true;
};

// 编辑数据
const handleEdit = async (record: SysChannelData) => {
  // 获取详情
  const detail = await getDetail(record.id);
  // 赋值给编辑数据
  Object.assign(editingData, detail.data);
  // 设置当前渠道ID并加载公司配置
  currentChannelId.value = record.id;
  // await loadCompanyData();
  modalVisible.value = true;
};

// 删除数据
const handleDelete = async (id: number) => {
  try {
    await deleteData(id);
    // 重新加载当前页数据
    await loadData();
    // 显示删除成功消息
    // 这里可以使用项目的消息提示机制
  } catch (error) {
    // 显示删除失败消息
    console.error('删除失败:', error);
  }
};

// 公司配置编辑数据
const companyEditingData = reactive({
  id: undefined,
  channelId: undefined,
  tenantId: undefined,
  city: undefined,
  quantity: 0,
  isStar: 0,
  fieldMappings: []
});

// 打开公司配置弹窗
const handleCompanyConfig = async (record: SysChannelData) => {
  currentChannelId.value = record.id;
  // 使用渠道数据中的 channelCompanyList，避免租户隔离导致无法查看
  currentChannelCompanyList.value = record.channelCompanyList || [];
  companyModalVisible.value = true;
};

// 公司配置相关函数
const handleCompanyModalCancel = () => {
  companyModalVisible.value = false;
  currentChannelId.value = undefined;
};

const handleCompanyEditModalCancel = () => {
  companyEditModalVisible.value = false;
};

const handleCompanyCreate = () => {
  Object.assign(companyEditingData, {
    id: undefined,
    channelId: currentChannelId.value,
    tenantId: undefined,
    city: undefined,
    quantity: 0,
    rate: 0,
    isStar: 0,
    fieldMappings: []
  });
  companyFormRef.value?.resetFields();
  companyEditModalVisible.value = true;
};

const handleCompanyEdit = async (record: any) => {
  // 从当前列表中找到对应的记录
  const detail = currentChannelCompanyList.value.find((item: any) => item.id === record.id);
  if (detail) {
    Object.assign(companyEditingData, JSON.parse(JSON.stringify(detail)));
    // 确保fieldMappings是数组格式
    if (typeof companyEditingData.fieldMappings === 'string') {
      try {
        companyEditingData.fieldMappings = JSON.parse(companyEditingData.fieldMappings);
      } catch {
        companyEditingData.fieldMappings = [];
      }
    }
    companyEditModalVisible.value = true;
  }
};

const handleCompanyDelete = async (id: number) => {
  try {
    await deleteCompanyData(id);
    // 删除成功后刷新渠道列表以更新 channelCompanyList
    await loadData(currentPage.value, pageSize.value);
    // 更新当前显示的公司配置列表
    const channelRecord = dataList.value.find((item: any) => item.id === currentChannelId.value);
    if (channelRecord) {
      currentChannelCompanyList.value = channelRecord.channelCompanyList || [];
    }
    Message.success('删除成功');
  } catch (error) {
    Message.error('删除失败');
    console.error('删除失败:', error);
  }
};

const handleCompanySave = async () => {
  const isValid = await companyFormRef.value?.validate();
  if (isValid) return false;
  try {
    const dataToSave = JSON.parse(JSON.stringify(companyEditingData));
    
    // 确保数据类型正确
    if (dataToSave.tenantId) {
      dataToSave.tenantId = Number(dataToSave.tenantId);
    }
    if (dataToSave.channelId) {
      dataToSave.channelId = Number(dataToSave.channelId);
    }
    if (dataToSave.quantity) {
      dataToSave.quantity = Number(dataToSave.quantity);
    }
    if (dataToSave.isStar) {
      dataToSave.isStar = Number(dataToSave.isStar);
    }
    
    // 确保fieldMappings是JSON字符串
    if (Array.isArray(dataToSave.fieldMappings)) {
      dataToSave.fieldMappings = JSON.stringify(dataToSave.fieldMappings);
    }
    
    if (companyEditingData.id) {
      await updateCompanyData(dataToSave);
    } else {
      await createCompanyData(dataToSave);
    }
    // 保存成功后刷新渠道列表以更新 channelCompanyList
    await loadData(currentPage.value, pageSize.value);
    // 更新当前显示的公司配置列表
    const channelRecord = dataList.value.find((item: any) => item.id === currentChannelId.value);
    if (channelRecord) {
      currentChannelCompanyList.value = channelRecord.channelCompanyList || [];
    }
    companyEditModalVisible.value = false;
    Message.success('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    return false;
  }
  return true;
};


// 字段映射相关函数
const addFieldMapping = () => {
  companyEditingData.fieldMappings.push({
    sourceField: '',
    targetField: '',
    mappingType: 'direct',
    staticValue: '',
    transformRules: ''
  });
};

const removeFieldMapping = (index: number) => {
  companyEditingData.fieldMappings.splice(index, 1);
};

// 格式化字段映射显示
const formatFieldMappings = (fieldMappings: any, short: boolean = false) => {
  if (!fieldMappings) return '';
  
  let mappings;
  if (typeof fieldMappings === 'string') {
    try {
      mappings = JSON.parse(fieldMappings);
    } catch {
      return '格式错误';
    }
  } else {
    mappings = fieldMappings;
  }
  
  if (!Array.isArray(mappings)) return '格式错误';
  
  if (short) {
    return mappings.map(m => `${m.sourceField}→${m.targetField}`).join(', ');
  } else {
    return mappings.map(m => {
      let mappingDesc = `${m.sourceField} → ${m.targetField} (${m.mappingType})`;
      if (m.mappingType === 'static') {
        mappingDesc += `: ${m.staticValue}`;
      } else if (m.mappingType === 'transform') {
        mappingDesc += `: ${m.transformRules}`;
      }
      return mappingDesc;
    }).join('\n');
  }
};

// 加载公司列表
const loadTenantList = async () => {
  try {
    const response = await getTenantList({ pageNum: 1, pageSize: 1000 });
    if (response.code === 0 && response.data) {
      tenantList.value = response.data.list || [];
    }
  } catch (error) {
    console.error('加载公司列表失败:', error);
  }
};

// 获取公司名称
const getTenantName = (tenantId: number) => {
  const tenant = tenantList.value.find(item => item.id === tenantId);
  return tenant ? tenant.name : `公司${tenantId}`;
};

// 保存数据
const handleSave = async () => {
  const isValid = await formRef.value?.validate();
  if (isValid) return false;
  try {
    const dataToSave = JSON.parse(JSON.stringify(editingData));
    if (editingData.id) {
      // 更新数据
      await updateData(dataToSave);
    } else {
      // 创建数据
      await createData(dataToSave);
    }
    // 重新加载数据
    await loadData();
  } catch (error) {
    console.error('保存失败:', error);
    return false;
  }
  return true;
};

// 取消操作
const handleCancel = () => {
  modalVisible.value = false;
};

onMounted(async () => {
  // 初始化加载数据
  await loadData();
  // 加载公司列表
  await loadTenantList();
})

</script>

<style scoped lang="scss">
.field-mappings-container {
  .mapping-item {
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    background-color: var(--color-fill-2);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
