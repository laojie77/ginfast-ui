<template>
 <div class="snow-page">
    <div class="snow-inner">
        <a-card :loading="loading" :bordered="false">
            <a-form :model="searchForm" :layout="layoutMode.layout" label-align="left" auto-label-width>
                <a-row :gutter="16">
                    <a-col :span="isMobile ? 24 : 5">
                        <!-- 查询表单-->
                        <!-- 客户编号模糊查询 -->
                        <a-form-item field="num" label="客户编号">
                            <a-input-search v-model="searchForm.num" placeholder="客户编号" @search="handleSearch" allow-clear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 4">
                        <!-- 手机号模糊查询（仅非数值类型支持） -->
                        <a-form-item field="mobile" label="手机号">
                            <a-input-search v-model="searchForm.mobile" placeholder="手机号" @search="handleSearch" allow-clear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 4">
                        <!-- 客户姓名模糊查询（仅非数值类型支持） -->
                        <a-form-item field="name" label="客户姓名">
                            <a-input-search v-model="searchForm.name" placeholder="客户姓名" @search="handleSearch" allow-clear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 需求金额精确查询 -->
                        <a-form-item field="moneyDemand" label="需求金额">
                            <a-input-number v-model="searchForm.moneyDemand" placeholder="需求金额" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 渠道来源选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="channelName" label="渠道来源">
                            <a-select v-model="searchForm.channelName" placeholder="渠道来源" allow-clear>
                                <a-option v-for="item in channelOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 跟进人精确查询 -->
                        <a-form-item field="userName" label="跟进人">
                            <a-input-number v-model="searchForm.userName" placeholder="跟进人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 星级选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="customerType" label="星级">
                            <a-select v-model="searchForm.customerType" placeholder="星级" allow-clear>
                                <a-option v-for="item in customerTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 业务阶段选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="status" label="业务阶段">
                            <a-select v-model="searchForm.status" placeholder="业务阶段" allow-clear>
                                <a-option v-for="item in statusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 客户有效选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="intention" label="客户有效">
                            <a-select v-model="searchForm.intention" placeholder="客户有效" allow-clear>
                                <a-option v-for="item in intentionOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 贷款类型选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="singlePieceType" label="贷款类型">
                            <a-select v-model="searchForm.singlePieceType" placeholder="贷款类型" allow-clear>
                                <a-option v-for="item in singlePieceTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 4">
                        <!-- 分配时间精确查询 -->
                        <a-form-item field="allotTime" label="分配时间">
                            <a-date-picker v-model="searchForm.allotTime" placeholder="分配时间" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 所属部门精确查询 -->
                        <a-form-item field="departmentId" label="所属部门">
                          <a-tree-select :data="filterTree" v-model="searchForm.departmentId" placeholder="Please select ..."/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 再分配选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isReassign" label="再分配">
                            <a-select v-model="searchForm.isReassign" placeholder="再分配" allow-clear>
                                <a-option v-for="item in isReassignOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 离职数据选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isQuit" label="离职数据">
                            <a-select v-model="searchForm.isQuit" placeholder="离职数据" allow-clear>
                                <a-option v-for="item in isQuitOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 重复标记选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isRepeat" label="重复标记">
                            <a-select v-model="searchForm.isRepeat" placeholder="重复标记" allow-clear>
                                <a-option v-for="item in isRepeatOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 星级回传选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="starStatus" label="星级回传">
                            <a-select v-model="searchForm.starStatus" placeholder="星级回传" allow-clear>
                                <a-option v-for="item in starStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 是否锁定选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isLock" label="是否锁定">
                            <a-select v-model="searchForm.isLock" placeholder="是否锁定" allow-clear>
                                <a-option v-for="item in isLockOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-space wrap>
                            <a-button type="primary" @click="handleSearch">查询</a-button>
                            <a-button @click="handleReset">重置</a-button>
                            <a-button type="primary" @click="handleCreate" v-hasPerm="['plugins:syscustomersyscustomer:add']">
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
                   <a-table-column title="客户编号" data-index="num"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="客户姓名" data-index="name"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="手机号" data-index="mobile"  :width="120"  ellipsis tooltip/>
                    <a-table-column title="需求金额" data-index="moneyDemand"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="渠道来源" data-index="channelName"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="跟进人" data-index="userName"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="星级" data-index="customerType"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="业务阶段" data-index="status"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="客户有效" data-index="intention"  :width="100"  ellipsis tooltip/>
                  <a-table-column title="客户备注" data-index="remarks"  :width="120"  ellipsis tooltip/>
                    <a-table-column title="分配时间" data-index="allotTime"  :width="120"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ record['allotTime'] ? formatTime(record['allotTime']) : "" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="所属部门" data-index="departmentId"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="所在城市" data-index="city"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="再分配" data-index="isReassign"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="离职数据" data-index="isQuit"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="重复标记" data-index="isRepeat"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="短信发送状态" data-index="isSms"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="星级回传" data-index="starStatus"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="是否锁定" data-index="isLock"  :width="80"  ellipsis tooltip/>
                    <a-table-column title="操作" :width="200" :fixed="isMobile ? undefined : 'right'">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syscustomersyscustomer:edit']">
                                    编辑
                                </a-button>
                                <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                                    <a-button size="small" status="danger" v-hasPerm="['plugins:syscustomersyscustomer:delete']">
                                        删除
                                    </a-button>
                                </a-popconfirm>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>

        </a-card>

        <!-- 编辑/创建弹窗 -->
        <a-modal v-model:visible="modalVisible" :title="editingData.id ? '编辑数据' : '新增数据'" :on-before-ok="handleSave"
            @cancel="handleCancel" :width="layoutMode.width">
            <a-form :model="editingData" :rules="rules" ref="formRef" :layout="layoutMode.layout">
                <a-form-item field="name" label="客户姓名"><a-input v-model="editingData.name" placeholder="请输入客户姓名" />
                </a-form-item>
                <a-form-item field="mobile" label="手机号"><a-input v-model="editingData.mobile" placeholder="请输入手机号" />
                </a-form-item>
                <a-form-item field="moneyDemand" label="需求金额">
                    <a-input-number v-model="editingData.moneyDemand" placeholder="请输入需求金额" />
                </a-form-item>
                <a-form-item field="channelName" label="渠道来源">
                    <a-select v-model="editingData.channelName" placeholder="请选择渠道来源">
                        <a-option v-for="item in channelOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="customerType" label="星级">
                    <a-select v-model="editingData.customerType" placeholder="请选择星级">
                        <a-option v-for="item in customerTypeOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="status" label="业务阶段">
                    <a-select v-model="editingData.status" placeholder="请选择业务阶段">
                        <a-option v-for="item in statusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="intention" label="客户有效">
                    <a-select v-model="editingData.intention" placeholder="请选择客户有效">
                        <a-option v-for="item in intentionOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="isHouse" label="房">
                    <a-radio-group v-model="editingData.isHouse">
                        <a-radio v-for="item in isHouseOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isCar" label="车">
                    <a-radio-group v-model="editingData.isCar">
                        <a-radio v-for="item in isCarOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isCompany" label="公司">
                    <a-radio-group v-model="editingData.isCompany">
                        <a-radio v-for="item in isCompanyOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isCredit" label="信用卡">
                    <a-radio-group v-model="editingData.isCredit">
                        <a-radio v-for="item in isCreditOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isInsurance" label="保单">
                    <a-radio-group v-model="editingData.isInsurance">
                        <a-radio v-for="item in isInsuranceOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isWork" label="打卡工资">
                    <a-radio-group v-model="editingData.isWork">
                        <a-radio v-for="item in isWorkOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isFund" label="公积金">
                    <a-radio-group v-model="editingData.isFund">
                        <a-radio v-for="item in isFundOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="isSocial" label="社保">
                    <a-radio-group v-model="editingData.isSocial">
                        <a-radio v-for="item in isSocialOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="sex" label="性别">
                    <a-radio-group v-model="editingData.sex">
                        <a-radio v-for="item in sexOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="remarks" label="客户备注">
                    <a-textarea v-model="editingData.remarks" placeholder="请输入客户备注" />
                </a-form-item>
                <a-form-item field="age" label="年龄">
                    <a-input-number v-model="editingData.age" placeholder="请输入年龄" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</div>  
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useSysCustomerPluginHook } from '../../hooks/syscustomer';
import type { SysCustomerData } from '../../api/syscustomer';
import { formatTime } from '@/globals';
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
import { getSysChannelCompanyList } from '../../../syschannelcompany/api/syschannelcompany';
import type { SysChannelCompanyData, SysChannelCompanyListParams } from '../../../syschannelcompany/api/syschannelcompany';
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
const customerTypeOption = ref(dictFilter("customerTypeId"));
const statusOption = ref(dictFilter("progressStatusArr"));
const intentionOption = ref(dictFilter("intentionStatusArr"));
const isHouseOption = ref(dictFilter("isStatus"));
const isCarOption = ref(dictFilter("isStatus"));
const isCompanyOption = ref(dictFilter("isStatus"));
const isCreditOption = ref(dictFilter("isStatus"));
const isInsuranceOption = ref(dictFilter("isStatus"));
const isWorkOption = ref(dictFilter("isStatus"));
const isFundOption = ref(dictFilter("isStatus"));
const isSocialOption = ref(dictFilter("isStatus"));
const singlePieceTypeOption = ref(dictFilter("singlePieceTypeArr"));
const sexOption = ref(dictFilter("gender"));
const isReassignOption = ref(dictFilter("isStatus"));
const isQuitOption = ref(dictFilter("isStatus"));
const isRepeatOption = ref(dictFilter("isStatus"));
const starStatusOption = ref(dictFilter("isStatus"));
const isLockOption = ref(dictFilter("isStatus"));

// 渠道来源选项
const channelOption = ref<{value: number, name: string}[]>([]);

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
} = useSysCustomerPluginHook();

const modalVisible = ref(false);
const formRef = ref();

// 搜索表单
const searchForm = reactive({
    num: '',
    name: '',
    mobile: '',
    moneyDemand: undefined,
    channelName: undefined,
    userName: undefined,
    customerType: undefined,
    status: undefined,
    intention: undefined,
    singlePieceType: undefined,
    allotTime: '',
    departmentId: undefined,
    city: '',
    isReassign: undefined,
    isQuit: undefined,
    isRepeat: undefined,
    starStatus: undefined,
    isLock: undefined,
});

const editingData = reactive<Partial<SysCustomerData>>({
    id: undefined,
    num: undefined,
    name: undefined,
    mobile: undefined,
    mdMobile: undefined,
    moneyDemand: undefined,
    channelName: undefined,
    userName: undefined,
    customerType: undefined,
    status: undefined,
    intention: undefined,
    lastTime: undefined,
    isHouse: undefined,
    isCar: undefined,
    isCompany: undefined,
    isCredit: undefined,
    isInsurance: undefined,
    isWork: undefined,
    isFund: undefined,
    isSocial: undefined,
    isTax: undefined,
    singlePieceType: undefined,
    sex: undefined,
    allotTime: undefined,
    departmentId: undefined,
    remarks: undefined,
    age: undefined,
    city: undefined,
    customerComment: undefined,
    source: undefined,
    newData: undefined,
    distributionTime: undefined,
    redistributionTime: undefined,
    isReassign: undefined,
    batchId: undefined,
    isRead: undefined,
    isPublic: undefined,
    isQuit: undefined,
    isRepeat: undefined,
    isRubbish: undefined,
    remarkTime: undefined,
    dispatchTime: undefined,
    isRemind: undefined,
    isSms: undefined,
    starStatus: undefined,
    isExchange: undefined,
    publicTypeTime: undefined,
    publicType: undefined,
    isLock: undefined,
});

const rules = {
    name: [{ required: true, message: '客户姓名不能为空' }],
    mobile: [{ required: true, message: '手机号不能为空' }],
    channelName: [{ required: true, message: '渠道来源不能为空' }],
};

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
    if (searchForm.num) {
        params.num = searchForm.num;
    }
    if (searchForm.name) {
        params.name = searchForm.name;
    }
    if (searchForm.mobile) {
        params.mobile = searchForm.mobile;
    }
    if (searchForm.moneyDemand) {
        params.moneyDemand = searchForm.moneyDemand;
    }
    if (searchForm.channelName) {
        params.channelName = searchForm.channelName;
    }
    if (searchForm.userName) {
        params.userName = searchForm.userName;
    }
    if (searchForm.customerType) {
        params.customerType = searchForm.customerType;
    }
    if (searchForm.status) {
        params.status = searchForm.status;
    }
    if (searchForm.intention) {
        params.intention = searchForm.intention;
    }
    if (searchForm.singlePieceType) {
        params.singlePieceType = searchForm.singlePieceType;
    }
    if (searchForm.allotTime) {
        params.allotTime = searchForm.allotTime;
    }
    if (searchForm.departmentId) {
        params.departmentId = searchForm.departmentId;
    }
    if (searchForm.city) {
        params.city = searchForm.city;
    }
    if (searchForm.isReassign) {
        params.isReassign = searchForm.isReassign;
    }
    if (searchForm.isQuit) {
        params.isQuit = searchForm.isQuit;
    }
    if (searchForm.isRepeat) {
        params.isRepeat = searchForm.isRepeat;
    }
    if (searchForm.starStatus) {
        params.starStatus = searchForm.starStatus;
    }
    if (searchForm.isLock) {
        params.isLock = searchForm.isLock;
    }
    await fetchDataList(params);
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
    searchForm.num = '';
    searchForm.name = '';
    searchForm.mobile = '';
    searchForm.moneyDemand = undefined;
    searchForm.channelName = undefined;
    searchForm.userName = undefined;
    searchForm.customerType = undefined;
    searchForm.status = undefined;
    searchForm.intention = undefined;
    searchForm.singlePieceType = undefined;
    searchForm.allotTime = '';
    searchForm.departmentId = undefined;
    searchForm.city = '';
    searchForm.isReassign = undefined;
    searchForm.isQuit = undefined;
    searchForm.isRepeat = undefined;
    searchForm.starStatus = undefined;
    searchForm.isLock = undefined;
    resetSearchParams();
    loadData(1);
};

// 新增数据
const handleCreate = () => {
    // 重置表单数据
    Object.assign(editingData, {
        id: undefined,
        name: undefined,
        mobile: undefined,
        mdMobile: undefined,
        moneyDemand: undefined,
        channelName: undefined,
        userName: undefined,
        customerType: undefined,
        status: undefined,
        intention: undefined,
        lastTime: undefined,
        isHouse: undefined,
        isCar: undefined,
        isCompany: undefined,
        isCredit: undefined,
        isInsurance: undefined,
        isWork: undefined,
        isFund: undefined,
        isSocial: undefined,
        isTax: undefined,
        singlePieceType: undefined,
        sex: undefined,
        allotTime: undefined,
        departmentId: undefined,
        remarks: undefined,
        age: undefined,
        city: undefined,
        customerComment: undefined,
        source: undefined,
        newData: undefined,
        distributionTime: undefined,
        redistributionTime: undefined,
        isReassign: undefined,
        batchId: undefined,
        isRead: undefined,
        isPublic: undefined,
        isQuit: undefined,
        isRepeat: undefined,
        isRubbish: undefined,
        remarkTime: undefined,
        dispatchTime: undefined,
        isRemind: undefined,
        isSms: undefined,
        starStatus: undefined,
        isExchange: undefined,
        publicTypeTime: undefined,
        publicType: undefined,
        isLock: undefined,
    });
    modalVisible.value = true;
};

// 编辑数据
const handleEdit = async (record: SysCustomerData) => {
    // 获取详情
    const detail = await getDetail(record.id);
    // 赋值给编辑数据
    Object.assign(editingData, detail.data);
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

// 查询渠道数据
const fetchChannelData = async () => {
    try {
        const params: SysChannelCompanyListParams = {
            pageNum: 1,
            pageSize: 1000, // 设置较大的页面大小以获取所有数据
            // 后端会自动根据当前租户过滤数据
        };
        
        const response = await getSysChannelCompanyList(params);
        
        if (response.data && Array.isArray(response.data.list)) {
            // 将渠道数据转换为选项格式，显示hiddenCode字段
            channelOption.value = response.data.list.map((item: SysChannelCompanyData) => ({
                value: item.id,
                name: item.hiddenName
            }));
        }
    } catch (error) {
        console.error('获取渠道数据失败:', error);
        channelOption.value = [];
    }
};

onMounted(async () => {
    // 初始化加载数据
    await loadData();
    // 加载渠道数据
    await fetchChannelData();
})

</script>

<style scoped lang="scss">

</style>
