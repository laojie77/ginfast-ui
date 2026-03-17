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
                            <a-input-search v-model="searchForm.moneyDemand" placeholder="需求金额" />
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
                        <a-form-item field="userId" label="跟进人">
                            <a-select v-model="searchForm.userId" placeholder="请选择跟进人" allow-clear>
                                <a-option v-for="item in followerOptions" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 星级选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="customerStar" label="星级">
                            <a-select v-model="searchForm.customerStar" placeholder="星级" allow-clear>
                                <a-option v-for="item in customerStarOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
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
                    <a-col :span="isMobile ? 12 : 6">
                        <!-- 所属部门精确查询 -->
                        <a-form-item field="departmentId" label="所属部门">
                          <a-cascader :options="cascaderOptions" v-model="searchForm.departmentId" placeholder="请选择部门" check-strictly allow-clear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 再分配选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isReassign" label="再分配">
                            <a-select v-model="searchForm.isReassign" placeholder="再分配" allow-clear>
                                <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 离职数据选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isQuit" label="离职数据">
                            <a-select v-model="searchForm.isQuit" placeholder="离职数据" allow-clear>
                                <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 重复标记选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isRepeat" label="重复标记">
                            <a-select v-model="searchForm.isRepeat" placeholder="重复标记" allow-clear>
                                <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 星级回传选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="starStatus" label="星级回传">
                            <a-select v-model="searchForm.starStatus" placeholder="星级回传" allow-clear>
                                <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 12 : 3">
                        <!-- 是否锁定选择框查询（radio/select/checkbox统一使用select） -->
                        <a-form-item field="isLock" label="是否锁定">
                            <a-select v-model="searchForm.isLock" placeholder="是否锁定" allow-clear>
                                <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
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
                  <a-table-column title="锁定" data-index="isLock"  :width="80"  ellipsis tooltip>
                    <template #cell="{ record }">
                      <a-tooltip v-if="record.isLock === 1" content="锁定客户无法被其他人操作">
                        <icon-lock style="color: red" @click="handleToggleLock(record)" />
                      </a-tooltip>
                      <a-tooltip v-else content="锁定客户无法被其他人操作">
                        <icon-unlock style="color: green" @click="handleToggleLock(record)" />
                      </a-tooltip>
                    </template>
                  </a-table-column>
                   <a-table-column title="客户编号" data-index="num"  :width="200"  ellipsis tooltip/>
                    <a-table-column title="姓名" data-index="name"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="手机号" data-index="mobile"  :width="150"  ellipsis tooltip/>
                    <a-table-column title="渠道来源" data-index="channelName"  :width="150"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ channelOption.find(item => item.value === record.channelName)?.name || '' }}
                        </template>
                    </a-table-column>
                  <a-table-column title="业务阶段" data-index="status"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.status === 0 ? 'red' : 'arcoblue'">
                            {{ statusOption[record.status]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                  <a-table-column title="客户有效" data-index="intention"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.intention === 1 ? 'arcoblue' : 'red'">
                            {{ intentionOption[record.intention]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                  <a-table-column title="星级" data-index="customerStar"  :width="80"  ellipsis tooltip >
                    <template #cell="{ record }">
                      <a-tag  size="small" :color="[1, 2].includes(record.customerStar) ? 'red' : 'arcoblue'">
                        {{ customerStarOption[record.customerStar]?.name }}
                      </a-tag>
                    </template>
                  </a-table-column>
                    <a-table-column title="跟进人" data-index="userName"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ followerOptions.find(item => item.value === record.userId)?.name || '' }}
                        </template>
                    </a-table-column>
                  <a-table-column title="需求金额" data-index="moneyDemand"  :width="100"  ellipsis tooltip/>
                  <a-table-column title="客户备注" data-index="remarks"  :width="120"  ellipsis tooltip/>
                    <a-table-column title="分配时间" data-index="allotTime"  :width="120"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ record['allotTime'] ? formatTime(record['allotTime']) : "" }}
                        </template>
                    </a-table-column>
                    <a-table-column title="所属部门" data-index="departmentId"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                            {{ getDepartmentName(record.departmentId) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="所在城市" data-index="city"  :width="100"  ellipsis tooltip/>
                    <a-table-column title="再分配" data-index="isReassign"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.isReassign === 1 ? 'arcoblue' : 'red'">
                            {{ isStatusOption[record.isReassign]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="离职数据" data-index="isQuit"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.isQuit === 1 ? 'arcoblue' : 'red'">
                            {{ isStatusOption[record.isQuit]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="重复标记" data-index="isRepeat"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.isRepeat === 1 ? 'arcoblue' : 'red'">
                            {{ isStatusOption[record.isRepeat]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="短信" data-index="isSms"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.isSms === 1 ? 'arcoblue' : 'red'">
                            {{ isSmsOption[record.isSms]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="星级回传" data-index="starStatus"  :width="100"  ellipsis tooltip>
                        <template #cell="{ record }">
                          <a-tag  size="small" :color="record.starStatus === 1 ? 'arcoblue' : 'red'">
                            {{ taskStatusOption[record.starStatus]?.name }}
                          </a-tag>
                        </template>
                    </a-table-column>
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
                <a-form-item field="customerStar" label="星级">
                    <a-select v-model="editingData.customerStar" placeholder="请选择星级">
                        <a-option v-for="item in customerStarOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
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
                <a-form-item label="客户属性">
                    <a-space wrap>
                        <a-checkbox-group v-model="editingData.extra">
                            <a-checkbox v-for="property in ALL_EXTRA_PROPERTIES" 
                                       :key="property" 
                                       :value="property">
                                {{ EXTRA_PROPERTY_LABELS[property] }}
                            </a-checkbox>
                        </a-checkbox-group>
                    </a-space>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useSysCustomerPluginHook } from '../../hooks/syscustomer';
import type { SysCustomerData } from '../../api/syscustomer';
import { formatTime } from '@/globals';
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
import { getSysChannelCompanyList } from '../../../syschannelcompany/api/syschannelcompany';
import type { SysChannelCompanyData, SysChannelCompanyListParams } from '../../../syschannelcompany/api/syschannelcompany';
const { isMobile } = useDevicesSize();
import { UserInfoKey } from "@/utils/auth";
import { getLocalStorage } from "@/utils/app.ts";
import { userType } from "@/store/types.ts";
import { getDivisionAPI, type DivisionItem } from '@/api/department' //部门列表数据
import { getAccountListAPI, type AccountItem } from '@/api/user' //用户列表数据
const userInfo = getLocalStorage<userType>(UserInfoKey);

// Extra字段属性定义常量
const EXTRA_PROPERTIES = {
  HOUSE: 'house',
  CAR: 'car',
  COMPANY: 'company',
  CREDIT: 'credit',
  INSURANCE: 'insurance',
  WORK: 'work',
  FUND: 'fund',
  SOCIAL: 'social',
  TAX: 'tax'
} as const;

// 所有属性列表（用于循环和验证）
const ALL_EXTRA_PROPERTIES = Object.values(EXTRA_PROPERTIES);

// 属性显示名称映射
const EXTRA_PROPERTY_LABELS = {
  [EXTRA_PROPERTIES.HOUSE]: '房',
  [EXTRA_PROPERTIES.CAR]: '车',
  [EXTRA_PROPERTIES.COMPANY]: '公司',
  [EXTRA_PROPERTIES.CREDIT]: '信用卡',
  [EXTRA_PROPERTIES.INSURANCE]: '保单',
  [EXTRA_PROPERTIES.WORK]: '打卡工资',
  [EXTRA_PROPERTIES.FUND]: '公积金',
  [EXTRA_PROPERTIES.SOCIAL]: '社保',
  [EXTRA_PROPERTIES.TAX]: '营业税'
} as const;

// 数据权限判断函数
const getDataPermissionInfo = () => {
  const userRoles = userInfo?.roles || [];
  const userDepartmentId = userInfo?.department;
  
  // 检查是否有超级管理员权限 (dataScope=1)
  const hasSuperAdmin = userRoles.some(role => 
    role.createdBy === 1 && role.dataScope === 1
  );
  
  if (hasSuperAdmin) {
    return {
      hasFullPermission: true,
      allowedDepartmentIds: [], // 空数组表示全部权限
      description: '超级管理员：查看全部部门和员工'
    };
  }
  
  // 合并所有角色的权限：收集所有允许的部门ID
  const allowedDepartmentIds = new Set<number>();
  
  for (const role of userRoles) {
    const checkedDepts = role.checkedDepts ? role.checkedDepts.split(',').map(Number) : [];
    
    switch (role.dataScope) {
      case 2: // 自定义权限
        if (checkedDepts.length === 0) {
          // checkedDepts为空，查看自身部门
          if (userDepartmentId) {
            allowedDepartmentIds.add(userDepartmentId);
          }
        } else {
          // checkedDepts不为空，查看指定部门
          checkedDepts.forEach(deptId => allowedDepartmentIds.add(deptId));
        }
        break;
      case 3: // 本部门数据
        if (userDepartmentId) {
          allowedDepartmentIds.add(userDepartmentId);
        }
        break;
      case 4: // 本部门及子部门
        if (userDepartmentId) {
          allowedDepartmentIds.add(userDepartmentId);
          // 递归添加所有子部门ID
          const addChildDepartments = (nodes: DivisionItem[]) => {
            for (const node of nodes) {
              if (node.id === userDepartmentId && node.children) {
                node.children.forEach(child => {
                  allowedDepartmentIds.add(child.id);
                  if (child.children) {
                    addChildDepartments(child.children);
                  }
                });
                break;
              }
              if (node.children) {
                addChildDepartments(node.children);
              }
            }
          };
          addChildDepartments(departmentTree.value);
        }
        break;
    }
  }
  
  return {
    hasFullPermission: false,
    allowedDepartmentIds: Array.from(allowedDepartmentIds),
    description: `普通权限：查看${allowedDepartmentIds.size}个部门的员工`
  };
};
// userInfo.department 为当前自身部门
//roleIDs:[5, 6]
//roles:[
// {checkedDepts:"5,6,7"，children:null，dataScope:2,id:5,name:"主管",createdBy=4}
// {checkedDepts:""，children:null，dataScope:0,id:6,name:"员工",createdBy=4}
// ] 为多身份
// 如果dataScope=1，则为负责人显示全部部门和员工列表
// 如果dataScope=2，则显示checkedDepts下的部门
// 如果dataScope=3，则显示查询自身所属部门的所属用户创建的数据
// 如果dataScope=4，则显示查询自身所属部门及该部门下所有子级部门的所属用户创建的数据
// 如果dataScope=0，仅查看自己,不参与这个页面

// 部门树数据
const departmentTree = ref<DivisionItem[]>([]);

// 跟进人列表数据
const followerOptions = ref<{value: number, name: string}[]>([]);

// 获取部门树数据
const getDepartmentTree = async () => {
  try {
    const res = await getDivisionAPI();
    departmentTree.value = res.data.list || [];
  } catch (error) {
    console.error('获取部门数据失败:', error);
    departmentTree.value = [];
  }
};

// 根据部门ID获取跟进人列表
const getFollowerListByDepartment = async (departmentIds: number[]) => {
  try {
    let response;
    
    // 如果有部门ID，构建参数并调用API；如果没有部门ID，直接调用API获取全部员工
    if (departmentIds.length > 0) {
      // 构建参数
      const params: any = {
        pageNum: 1,
        pageSize: 100
      };
      
      // 添加部门ID参数
      departmentIds.forEach((deptId, index) => {
        params[`deptIds[${index}]`] = deptId;
      });
      
      response = await getAccountListAPI(params);
    } else {
      // 直接调用API，不传任何参数，获取全部员工
      response = await getAccountListAPI();
    }
    
    if (response.data && Array.isArray(response.data.list)) {
      // 将用户数据转换为选项格式
      followerOptions.value = response.data.list.map((item: AccountItem) => ({
        value: item.id,
        name: item.nickName
      }));
    } else {
      followerOptions.value = [];
    }
  } catch (error) {
    console.error('获取跟进人列表失败:', error);
    followerOptions.value = [];
  }
};

// 将部门数据转换为a-cascader格式
const convertToCascaderFormat = (nodes: DivisionItem[]): any[] => {
  return nodes.map(node => ({
    value: node.id,
    label: node.name,
    children: node.children && node.children.length > 0 ? convertToCascaderFormat(node.children) : undefined
  }));
};

// 根据数据权限过滤部门树并转换为cascader格式
const cascaderOptions = computed(() => {
  if (!departmentTree.value.length) return [];
  
  // 获取数据权限信息
  const permissionInfo = getDataPermissionInfo();
  
  // 如果是超级管理员，显示全部部门
  if (permissionInfo.hasFullPermission) {
    return convertToCascaderFormat(departmentTree.value);
  }
  
  // 如果没有允许的部门ID，返回空数组
  if (permissionInfo.allowedDepartmentIds.length === 0) {
    return [];
  }
  
  // 根据允许的部门ID过滤部门树
  const filterByAllowedDepartments = (nodes: DivisionItem[]): DivisionItem[] => {
    const result: DivisionItem[] = [];
    
    for (const node of nodes) {
      if (permissionInfo.allowedDepartmentIds.includes(node.id)) {
        const newNode = { ...node };
        if (node.children && node.children.length > 0) {
          newNode.children = filterByAllowedDepartments(node.children);
        }
        result.push(newNode);
      } else if (node.children && node.children.length > 0) {
        // 检查子节点是否有允许的部门
        const filteredChildren = filterByAllowedDepartments(node.children);
        if (filteredChildren.length > 0) {
          const newNode = { ...node, children: filteredChildren };
          result.push(newNode);
        }
      }
    }
    
    return result;
  };
  
  const filteredTree = filterByAllowedDepartments(departmentTree.value);
  return convertToCascaderFormat(filteredTree);
});



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
const customerStarOption = ref(dictFilter("customerStar"));
const statusOption = ref(dictFilter("progressStatusArr"));
const intentionOption = ref(dictFilter("intentionStatusArr"));
// 共用字典选项
const isStatusOption = ref(dictFilter("isStatus"));
const isSmsOption = ref(dictFilter("isSms"));
const taskStatusOption = ref(dictFilter("taskStatus"));
const singlePieceTypeOption = ref(dictFilter("singlePieceTypeArr"));
const sexOption = ref(dictFilter("gender"));

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
    userId: undefined,
  customerStar: undefined,
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

// 监听部门选择变化，更新跟进人列表
watch(() => searchForm.departmentId, async (newDeptId) => {
  console.log(newDeptId)
  if (newDeptId) {
    // 选择了具体部门：加载该部门的员工列表
    const deptId = Array.isArray(newDeptId) ? newDeptId[newDeptId.length - 1] : newDeptId;
    await getFollowerListByDepartment([deptId]);
  } else {
    // 没有选择部门：根据数据权限加载员工列表
    const permissionInfo = getDataPermissionInfo();
    
    if (permissionInfo.hasFullPermission) {
      // 负责人显示全部员工，不传部门ID参数
      await getFollowerListByDepartment([]);
    } else {
      // 其他角色加载用户权限范围内的所有部门人员
      await getFollowerListByDepartment(permissionInfo.allowedDepartmentIds);
    }
  }
}, { immediate: true });

const editingData = reactive<Partial<SysCustomerData>>({
    id: undefined,
    num: undefined,
    name: undefined,
    mobile: undefined,
    mdMobile: undefined,
    moneyDemand: undefined,
    channelName: undefined,
    userName: undefined,
  customerStar: undefined,
    status: undefined,
    intention: undefined,
    lastTime: undefined,
    extra: [], // 扩展属性，使用数组存储选中的属性
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
    name: [{ required: true, message: '请输入客户姓名' }],
    mobile: [{ required: true, message: '请输入手机号' }],
    channelName: [{ required: true, message: '请选择渠道来源' }],
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
    if (searchForm.userId) {
        params.userId = searchForm.userId;
    }
    if (searchForm.customerStar) {
        params.customerStar = searchForm.customerStar;
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
    searchForm.userId = undefined;
    searchForm.customerStar = undefined;
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
      customerStar: undefined,
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
    
    // 处理extra字段：将JSON字符串转换为数组
    if (editingData.extra && typeof editingData.extra === 'string') {
        try {
            const extraObj = JSON.parse(editingData.extra);
            editingData.extra = Object.keys(extraObj).filter(key => extraObj[key] === 1);
        } catch (error) {
            console.error('解析extra字段失败:', error);
            editingData.extra = [];
        }
    } else if (!editingData.extra) {
        editingData.extra = [];
    }
    
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
        
        // 处理extra字段：将数组转换为JSON对象
        if (Array.isArray(dataToSave.extra)) {
            const extraObj: Record<string, number> = {};
            
            // 使用常量定义的所有属性
            ALL_EXTRA_PROPERTIES.forEach(prop => {
                extraObj[prop] = dataToSave.extra.includes(prop) ? 1 : 0;
            });
            
            dataToSave.extra = JSON.stringify(extraObj);
        } else {
            dataToSave.extra = '{}';
        }
        
        if (editingData.id) {
            // 更新数据
            await updateData(dataToSave);
        } else {
            // 创建数据
            await createData(dataToSave);
        }
        // 重新加载数据
        await loadData();
        modalVisible.value = false;
        return true;
    } catch (error) {
        console.error('保存失败:', error);
        return false;
    }
};

// 取消操作
const handleCancel = () => {
    modalVisible.value = false;
};

// 切换锁定状态
const handleToggleLock = async (record: SysCustomerData) => {
    try {
        const newLockStatus = record.isLock === 1 ? 0 : 1;
        record.isLock = newLockStatus
        await updateData(record);
        if (newLockStatus === 1) {
            Message.success(`已锁定客户：${record.name}`);
        } else {
            Message.success(`已解锁客户：${record.name}`);
        }
    } catch (error) {
        console.error('切换锁定状态失败:', error);
    }
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

const getDepartmentName = (departmentId: number | undefined): string => {
    if (!departmentId || !departmentTree.value.length) return '';
    
    const findDepartmentName = (nodes: DivisionItem[]): string => {
        for (const node of nodes) {
            if (node.id === departmentId) {
                return node.name;
            }
            if (node.children && node.children.length > 0) {
                const result = findDepartmentName(node.children);
                if (result) return result;
            }
        }
        return '';
    };
    
    return findDepartmentName(departmentTree.value);
};

onMounted(async () => {
    // 初始化加载数据
    await loadData();
    // 加载渠道数据
    await fetchChannelData();
    // 加载部门树数据
    await getDepartmentTree();
})

</script>

<style scoped lang="scss">

</style>
