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
              <a-form-item field="channelId" label="渠道来源">
                <a-select v-model="searchForm.channelId" placeholder="渠道来源" allow-clear>
                  <a-option v-for="item in channelOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 跟进人精确查询 -->
              <a-form-item field="userId" label="跟进人">
                <a-select v-model="searchForm.userId" placeholder="请选择跟进人" allow-clear>
                  <a-option v-for="item in followerOptions" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 星级选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="customerStar" label="星级">
                <a-select v-model="searchForm.customerStar" placeholder="星级" allow-clear>
                  <a-option v-for="item in customerStarOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
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
                  <a-option v-for="item in intentionOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 贷款类型选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="singlePieceType" label="贷款类型">
                <a-select v-model="searchForm.singlePieceType" placeholder="贷款类型" allow-clear>
                  <a-option v-for="item in singlePieceTypeOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
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
              <a-form-item field="deptId" label="所属部门">
                <a-cascader
                  :options="cascaderOptions"
                  v-model="searchForm.deptId"
                  placeholder="请选择部门"
                  check-strictly
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 再分配选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="isReassign" label="再分配">
                <a-select v-model="searchForm.isReassign" placeholder="再分配" allow-clear>
                  <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 离职数据选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="isQuit" label="离职数据">
                <a-select v-model="searchForm.isQuit" placeholder="离职数据" allow-clear>
                  <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 重复标记选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="isRepeat" label="重复标记">
                <a-select v-model="searchForm.isRepeat" placeholder="重复标记" allow-clear>
                  <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="isMobile ? 12 : 3">
              <!-- 星级回传选择框查询（radio/select/checkbox统一使用select） -->
              <a-form-item field="starStatus" label="星级回传">
                <a-select v-model="searchForm.starStatus" placeholder="星级回传" allow-clear>
                  <a-option v-for="item in starStatusOption" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--            <a-col :span="isMobile ? 12 : 3">-->
            <!--              &lt;!&ndash; 是否锁定选择框查询（radio/select/checkbox统一使用select） &ndash;&gt;-->
            <!--              <a-form-item field="isLock" label="是否锁定">-->
            <!--                <a-select v-model="searchForm.isLock" placeholder="是否锁定" allow-clear>-->
            <!--                  <a-option v-for="item in isStatusOption" :key="item.value" :value="Number(item.value)">{{-->
            <!--                      item.name-->
            <!--                    }}</a-option>-->
            <!--                </a-select>-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
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

        <a-table
          :data="dataList"
          :loading="loading"
          :pagination="paginationConfig"
          row-key="id"
          :expanded-keys="commentExpandedKeys"
          :expandable="{ width: 1 }"
          :bordered="{ wrapper: true, cell: true }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #expand-row="{ record }">
            <div v-if="record.customerComment" class="table-customer-comment-row">
              {{ record.customerComment }}
            </div>
          </template>
          <template #columns>
            <a-table-column title="锁定" data-index="isLock" :width="80" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tooltip v-if="record.isLock === 1" content="锁定客户无法被其他人操作">
                  <icon-lock style="color: red" @click="handleToggleLock(record)" />
                </a-tooltip>
                <a-tooltip v-else content="锁定客户无法被其他人操作">
                  <icon-unlock style="color: green" @click="handleToggleLock(record)" />
                </a-tooltip>
              </template>
            </a-table-column>
            <a-table-column title="客户编号" data-index="num" :width="200" ellipsis tooltip>
              <template #cell="{ record }">
                <span
                  :class="['customer-num-link', { 'customer-num-link--unread': Number(record.isRead ?? 0) === 0 }]"
                  @click="handleViewDetail(record)"
                >
                  {{ record.num || "-" }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="姓名" data-index="name" :width="120" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.name || "未命名客户" }}
              </template>
            </a-table-column>
            <a-table-column title="手机号" data-index="mobile" :width="150" ellipsis tooltip />
            <a-table-column title="业务阶段" data-index="status" :width="150">
              <template #cell="{ record }">
                <CustomerOptionDropdownTag
                  :text="getStatusDisplayText(record)"
                  :tooltip="getStatusDisplayText(record)"
                  :options="statusOption"
                  :selected-value="record.status"
                  :color="getStatusColor(record.status)"
                  max-width="100%"
                  @select="value => handleStatusChange(record, Number(value))"
                />
              </template>
            </a-table-column>
            <a-table-column title="客户有效" data-index="intention" :width="200">
              <template #cell="{ record }">
                <CustomerOptionDropdownTag
                  :text="getIntentionDisplayText(record)"
                  :tooltip="getIntentionDisplayText(record)"
                  :options="intentionOption"
                  :selected-value="record.intention"
                  :color="getIntentionColor(record.intention)"
                  max-width="100%"
                  @select="value => handleIntentionChange(record, Number(value))"
                />
              </template>
            </a-table-column>
            <a-table-column title="星级" data-index="customerStar" :width="120">
              <template #cell="{ record }">
                <CustomerOptionDropdownTag
                  :text="getCustomerStarDisplayText(record)"
                  :tooltip="getCustomerStarDisplayText(record)"
                  :options="customerStarOption"
                  :selected-value="record.customerStar"
                  :color="getCustomerStarTagColor(record.customerStar)"
                  max-width="100%"
                  @select="value => handleCustomerStarChange(record, Number(value))"
                />
              </template>
            </a-table-column>
            <a-table-column title="渠道来源" data-index="channelId" :width="150" ellipsis tooltip>
              <template #cell="{ record }">
                {{ channelOption.find(item => item.value === record.channelId)?.name || "" }}
              </template>
            </a-table-column>
            <a-table-column title="跟进人" data-index="userName" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                {{ followerOptions.find(item => item.value === record.userId)?.name || "" }}
              </template>
            </a-table-column>
            <a-table-column title="金额" data-index="moneyDemand" :width="80" ellipsis tooltip />
            <a-table-column title="客户备注" data-index="remarks" :width="200">
              <template #cell="{ record }">
                <a-popover position="right">
                  <template #content>
                    <div class="remark-popover-content">
                      <div>{{ formatCustomerRemarkDisplay(record.remarks, record.customerTracesList) || "-" }}</div>
                    </div>
                  </template>
                  <div class="table-remark-wrapper">
                    <div class="table-remark-text">
                      {{ formatCustomerRemarkDisplay(record.remarks, record.customerTracesList) || "-" }}
                    </div>
                  </div>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column title="分配时间" data-index="allotTime" :width="200" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record["allotTime"] ? formatTime(record["allotTime"]) : "-" }}
              </template>
            </a-table-column>
            <a-table-column title="所属部门" data-index="deptId" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getDepartmentName(record.deptId) }}
              </template>
            </a-table-column>
            <a-table-column title="所在城市" data-index="city" :width="100" ellipsis tooltip />
            <a-table-column title="客户来源" data-index="from" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                {{ getDictOptionName(fromOption, record.from) }}
              </template>
            </a-table-column>
            <a-table-column title="再分配" data-index="isReassign" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag size="small" :color="record.isReassign === 1 ? 'arcoblue' : 'red'">
                  {{ getDictOptionName(isStatusOption, record.isReassign) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="离职数据" data-index="isQuit" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag size="small" :color="record.isQuit === 1 ? 'arcoblue' : 'red'">
                  {{ getDictOptionName(isStatusOption, record.isQuit) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="重复标记" data-index="isRepeat" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag size="small" :color="record.isRepeat === 1 ? 'arcoblue' : 'red'">
                  {{ getDictOptionName(isStatusOption, record.isRepeat) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="短信" data-index="isSms" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag size="small" :color="record.isSms === 1 ? 'arcoblue' : 'red'">
                  {{ getDictOptionName(isSmsOption, record.isSms) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="星级回传" data-index="starStatus" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                <a-tag size="small" :color="record.starStatus === 1 ? 'arcoblue' : 'red'">
                  {{ getDictOptionName(starStatusOption, record.starStatus) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="200" :fixed="isMobile ? undefined : 'right'">
              <template #cell="{ record }">
                <a-space>
                  <a-button
                    size="small"
                    type="primary"
                    @click="handleViewDetail(record)"
                    v-hasPerm="['plugins:syscustomersyscustomer:edit']"
                  >
                    详情
                  </a-button>
                  <a-button size="small" @click="handleEdit(record)" v-hasPerm="['plugins:syscustomersyscustomer:edit']">
                    编辑
                  </a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="['plugins:syscustomersyscustomer:delete']"> 删除 </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>

      <!-- 编辑/创建弹窗 -->
      <a-modal
        v-model:visible="modalVisible"
        :title="editingData.id ? '编辑客户' : '新建客户'"
        :on-before-ok="handleSave"
        @cancel="handleCancel"
        width="auto"
        :top="24"
        :body-style="{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }"
      >
        <div class="customer-editor">
          <div class="editor-hero">
            <div class="editor-hero-main">
              <div class="editor-avatar">
                {{ editingData.name ? editingData.name.trim().charAt(0) : editingData.id ? "客" : "新" }}
              </div>
              <div class="editor-hero-copy">
                <div class="editor-hero-title">
                  {{ editingData.id ? editingData.name || "编辑客户资料" : "录入新客户" }}
                </div>
                <div class="editor-hero-subtitle">
                  {{
                    editingData.id
                      ? "调整客户基础信息与跟进状态，保持线索资料完整。"
                      : "先补齐基础信息，再进入后续分配与跟进流程。"
                  }}
                </div>
                <div class="editor-hero-tags">
                  <a-tag size="small" color="arcoblue">
                    {{ editingData.id ? `客户编号 ${editingData.num || "-"}` : "创建后自动生成客户编号" }}
                  </a-tag>
                  <a-tag
                    size="small"
                    :color="editingData.customerStar != null ? getCustomerStarTagColor(Number(editingData.customerStar)) : ''"
                  >
                    {{
                      resolveCustomerStarOptionName(
                        customerStarOption,
                        editingData.customerStar != null ? Number(editingData.customerStar) : null
                      ) || "未定级"
                    }}
                  </a-tag>
                  <a-tag
                    size="small"
                    :color="
                      editingData.intention === 1
                        ? 'green'
                        : editingData.intention === 2
                          ? 'red'
                          : editingData.intention === 3
                            ? 'orange'
                            : ''
                    "
                  >
                    {{ getDictOptionName(intentionOption, editingData.intention) || "客户有效待确认" }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>

          <a-form :model="editingData" :rules="rules" ref="formRef" layout="vertical" class="editor-form">
            <section class="editor-section">
              <div class="editor-section-head">
                <div class="editor-section-title">基础信息</div>
              </div>
              <a-row :gutter="[12, 4]" class="editor-fields-row">
                <a-col :flex="isMobile ? '100%' : '208px'" class="editor-field-col">
                  <a-form-item field="name" label="客户姓名">
                    <a-input v-model="editingData.name" placeholder="请输入客户姓名" allow-clear size="large" />
                  </a-form-item>
                </a-col>
                <a-col :flex="isMobile ? '100%' : '208px'" class="editor-field-col">
                  <a-form-item field="mobile" label="手机号">
                    <a-input v-model="editingData.mobile" placeholder="请输入手机号" allow-clear size="large" />
                  </a-form-item>
                </a-col>
                <a-col :flex="isMobile ? '100%' : '208px'" class="editor-field-col">
                  <a-form-item field="channelId" label="渠道来源">
                    <a-select v-model="editingData.channelId" placeholder="请选择渠道来源" allow-clear size="large">
                      <a-option v-for="item in channelOption" :key="item.value" :value="Number(item.value)">{{
                        item.name
                      }}</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :flex="isMobile ? '100%' : '208px'" class="editor-field-col">
                  <a-form-item field="moneyDemand" label="需求金额">
                    <a-input-number
                      v-model="editingData.moneyDemand"
                      placeholder="请输入需求金额"
                      hide-button
                      :min="0"
                      class="editor-number-input"
                    />
                  </a-form-item>
                </a-col>
                <a-col :flex="isMobile ? '100%' : '208px'" class="editor-field-col">
                  <a-form-item field="age" label="年龄">
                    <a-input-number
                      v-model="editingData.age"
                      placeholder="请输入年龄"
                      hide-button
                      :min="0"
                      class="editor-number-input"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </section>

            <section class="editor-section editor-section-tight">
              <div class="editor-section-head">
                <div class="editor-section-title">跟进状态</div>
              </div>
              <div class="editor-status-grid">
                <div class="editor-status-card">
                  <a-form-item field="customerStar" label="客户星级" class="editor-compact-item">
                    <a-select v-model="editingData.customerStar" placeholder="请选择客户星级" allow-clear>
                      <a-option v-for="item in customerStarOption" :key="item.value" :value="Number(item.value)">{{
                        item.name
                      }}</a-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div class="editor-status-card">
                  <a-form-item field="status" label="业务阶段" class="editor-compact-item">
                    <a-select v-model="editingData.status" placeholder="请选择业务阶段" allow-clear>
                      <a-option v-for="item in statusOption" :key="item.value" :value="Number(item.value)">{{
                        item.name
                      }}</a-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div class="editor-status-card">
                  <a-form-item field="intention" label="客户有效" class="editor-compact-item">
                    <a-select v-model="editingData.intention" placeholder="请选择客户有效状态" allow-clear>
                      <a-option v-for="item in intentionOption" :key="item.value" :value="Number(item.value)">{{
                        item.name
                      }}</a-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div class="editor-status-card">
                  <a-form-item field="sex" label="性别" class="editor-compact-item">
                    <a-radio-group v-model="editingData.sex" class="editor-radio-group editor-radio-group-compact">
                      <a-radio v-for="item in sexOption" :key="item.value" :value="Number(item.value)">{{ item.name }}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
              </div>
            </section>

            <section class="editor-section editor-section-tight">
              <div class="editor-section-head">
                <div class="editor-section-title">客户资质</div>
              </div>
              <div class="qualification-card-grid">
                <div v-for="property in ALL_EXTRA_PROPERTIES" :key="property" class="qualification-card">
                  <div class="qualification-card-head">
                    <span
                      class="qualification-card-dot"
                      :class="{ 'qualification-card-dot-active': !!getExtraPropertyValue(property) }"
                    ></span>
                    <div class="qualification-label">{{ EXTRA_PROPERTY_LABELS[property] }}</div>
                  </div>
                  <a-select
                    class="qualification-select"
                    :model-value="getExtraPropertyValue(property)"
                    @update:model-value="
                      (value: string | number | boolean | undefined) =>
                        setExtraPropertyValue(property, value == null ? '' : String(value))
                    "
                    :placeholder="`请选择${EXTRA_PROPERTY_LABELS[property]}`"
                    allow-clear
                  >
                    <a-option v-for="(label, value) in CUSTOMER_EXTRA_OPTIONS[property] || {}" :key="value" :value="value">
                      {{ label }}
                    </a-option>
                  </a-select>
                </div>
              </div>
            </section>

            <section class="editor-section">
              <div class="editor-section-head">
                <div class="editor-section-title">备注信息</div>
              </div>
              <a-form-item field="remarks" class="editor-remark-field">
                <a-textarea
                  v-model="editingData.remarks"
                  placeholder="请输入客户备注、需求背景或需要提醒的事项"
                  :auto-size="{ minRows: 4, maxRows: 6 }"
                  :max-length="300"
                  show-word-limit
                />
              </a-form-item>
            </section>
          </a-form>
        </div>
      </a-modal>

      <!-- 状态更新弹窗 -->
      <a-modal
        v-model:visible="statusModalVisible"
        title="更新业务阶段"
        :on-before-ok="handleStatusSave"
        @cancel="handleStatusCancel"
        :width="400"
      >
        <a-form :model="statusUpdateForm" ref="statusFormRef">
          <a-form-item label="新状态">
            <a-tag size="small" :color="getStatusColor(statusUpdateForm.newStatus ?? 0)">
              {{ statusOption.find(item => Number(item.value) === statusUpdateForm.newStatus)?.name }}
            </a-tag>
          </a-form-item>
          <a-form-item field="progressRemark" label="备注">
            <a-textarea v-model="statusUpdateForm.progressRemark" placeholder="请输入进度备注" :rows="4" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 客户有效性标签选择弹窗 -->
      <a-modal
        v-model:visible="validModalVisible"
        :title="getValidModalTitle()"
        :on-before-ok="handleValidSave"
        @cancel="handleValidCancel"
        :width="600"
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
          <span style="font-weight: 500">{{ getValidModalTitle() }}</span>
          <a-button
            type="text"
            @click="handleManageValid"
            style="color: #165dff"
            v-hasPerm="['plugins:syscustomersyscustomer:addValids']"
            >管理</a-button
          >
        </div>
        <a-form :model="validUpdateForm" ref="validFormRef">
          <a-form-item
            field="validId"
            :label="getValidModalTitle()"
            :rules="[{ required: true, message: `请选择${getValidModalTitle()}` }]"
          >
            <a-select v-model="validUpdateForm.validId" :placeholder="`请选择${getValidModalTitle()}`" allow-clear>
              <a-option v-for="item in customerValidOptions" :key="item.id" :value="item.id">{{ item.name }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 客户有效性标签管理弹窗 -->
      <a-modal v-model:visible="manageValidModalVisible" :title="getValidModalTitle() + '管理'" :footer="false" :width="800">
        <div style="margin-bottom: 16px">
          <a-button type="primary" @click="handleCreateValid">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
        </div>
        <a-table :data="customerValidList" :loading="validLoading" :pagination="false" :bordered="{ wrapper: true, cell: true }">
          <template #columns>
            <a-table-column title="类型" data-index="type" :width="100">
              <template #cell="{ record }">
                <a-tag size="small">
                  {{ record.type === 1 ? "有效客户" : record.type === 2 ? "无效客户" : record.type === 3 ? "黑名单" : "未知" }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="名称" data-index="name" />
            <a-table-column title="状态" data-index="status" :width="100">
              <template #cell="{ record }">
                <a-tag size="small" :color="record.status === 1 ? 'green' : 'red'">
                  {{ record.status === 1 ? "启用" : "禁用" }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="150">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleEditValid(record)">编辑</a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDeleteValid(record.id)">
                    <a-button size="small" status="danger">删除</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <!-- 客户有效性标签编辑弹窗 -->
      <a-modal
        v-model:visible="editValidModalVisible"
        :title="editingValid.id ? `编辑${getValidModalTitle()}` : `新增${getValidModalTitle()}`"
        :on-before-ok="handleSaveValid"
        @cancel="handleCancelEditValid"
        :width="400"
      >
        <a-form :model="editingValid" :rules="validRules" ref="editValidFormRef">
          <a-form-item label="类型">
            <a-input
              :model-value="
                editingValid.type === 1
                  ? '有效客户'
                  : editingValid.type === 2
                    ? '无效客户'
                    : editingValid.type === 3
                      ? '黑名单'
                      : '未知'
              "
              disabled
            />
          </a-form-item>
          <a-form-item field="name" label="名称">
            <a-input v-model="editingValid.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-radio-group v-model="editingValid.status">
              <a-radio :value="1">启用</a-radio>
              <a-radio :value="0">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <!-- 客户详情抽屉 -->
    <SysCustomerDetail
      v-model:visible="detailVisible"
      :customer-id="selectedCustomerId"
      :customer-data="selectedCustomerData"
      :channel-options="channelOption"
      :follower-options="followerOptions"
      :department-tree="departmentTree"
      :status-options="statusOption"
      :intention-options="intentionOption"
      :star-options="customerStarOption"
      :sex-options="sexOption"
      :single-piece-type-options="singlePieceTypeOption"
      @close="handleDetailClose"
      @updated="handleDetailUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import { useSysCustomerPluginHook } from "../../hooks/syscustomer";
import type { SysCustomerCreateParams, SysCustomerData, SysCustomerUpdateParams } from "../../api/syscustomer";
import { formatTime, getDictOptionName } from "@/globals";
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
import { verifyPhone } from "@/utils/verify-tools";
import { getSysChannelCompanyList } from "../../../syschannelcompany/api/syschannelcompany";
import type { SysChannelCompanyData, SysChannelCompanyListParams } from "../../../syschannelcompany/api/syschannelcompany";
import SysCustomerDetail from "./syscustomerdetail.vue";
import CustomerOptionDropdownTag from "../../components/customer-option-dropdown-tag.vue";
import { buildCustomerListParams, createCustomerSearchForm, resetCustomerSearchForm } from "../../hooks/list-query.ts";
import { formatCustomerRemarkDisplay } from "../../hooks/remark.ts";
import { ALL_EXTRA_PROPERTIES, EXTRA_PROPERTY_LABELS } from "../../hooks/customer-fields.ts";
import { useCustomerDepartmentScope } from "../../hooks/department.ts";
import {
  getCustomerIntentionColor as resolveCustomerIntentionColor,
  getCustomerIntentionDisplayText as resolveCustomerIntentionDisplayText,
  getCustomerStarDisplayText as resolveCustomerStarDisplayText,
  getCustomerStarOptionName as resolveCustomerStarOptionName,
  getCustomerStarTagColor as resolveCustomerStarTagColor,
  getCustomerStatusColor as resolveCustomerStatusColor,
  getCustomerStatusDisplayText as resolveCustomerStatusDisplayText,
  useCustomerValidOptions
} from "../../hooks/customer-status.ts";
import { useCustomerTraceActions } from "../../hooks/customer-trace-actions.ts";
import { useCustomerValidManager } from "../../hooks/customer-valid-manager.ts";
const { isMobile } = useDevicesSize();
import { UserInfoKey } from "@/utils/auth";
import { getLocalStorage } from "@/utils/app.ts";
import { useSysConfigStore } from "@/store/modules/sys-config"; // 系统配置store
const userInfo = getLocalStorage<any>(UserInfoKey);
const listScene = "public" as const;

// 客户资质选项配置（从系统配置store获取）
const sysConfigStore = useSysConfigStore();
const CUSTOMER_EXTRA_OPTIONS = computed(() => sysConfigStore.customerExtraConfig);

// 部门树数据
const {
  departmentTree,
  departmentTreeLoaded,
  followerOptions,
  cascaderOptions,
  loadDepartmentTree: getDepartmentTree,
  loadFollowerOptionsForSearch,
  getDepartmentName
} = useCustomerDepartmentScope(userInfo);

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
const customerStarOption = ref<Array<{ value: number | string; name: string }>>(dictFilter("customerStar"));
const statusOption = ref<Array<{ value: number | string; name: string }>>(dictFilter("progressStatusArr"));
const intentionOption = ref<Array<{ value: number | string; name: string }>>(dictFilter("intentionStatusArr"));
// 共用字典选项
const isStatusOption = ref(dictFilter("isStatus"));
const starStatusOption = ref(dictFilter("starStatus"));
const fromOption = ref(dictFilter("from"));
const isSmsOption = ref(dictFilter("isSms"));
const singlePieceTypeOption = ref(dictFilter("singlePieceTypeArr"));
const sexOption = ref(dictFilter("gender"));

// 渠道来源选项
const channelOption = ref<{ value: number; name: string }[]>([]);

const {
  dataList,
  loading,
  total,
  currentPage,
  pageSize,
  fetchDataList,
  createData,
  updateData,
  updateCustomerStatusTrace,
  deleteData,
  getDetail,
  resetSearchParams
} = useSysCustomerPluginHook();

const modalVisible = ref(false);
const formRef = ref();

// 状态更新相关
const statusFormRef = ref();

// 客户有效性标签相关
const validFormRef = ref();

// 客户有效性标签管理相关
const {
  customerValidOptions,
  allCustomerValidOptionsMap,
  getCustomerValidName: resolveCustomerValidName,
  loadCustomerValidOptions: fetchCustomerValidOptions,
  loadAllCustomerValidOptions: fetchAllCustomerValidOptions
} = useCustomerValidOptions();

const loadCustomerValidOptions = async (type: number) => {
  await fetchCustomerValidOptions(type, { status: 1 });
};

const loadAllCustomerValidOptions = async () => {
  await fetchAllCustomerValidOptions();
};

const {
  statusModalVisible,
  validModalVisible,
  statusUpdateForm,
  validUpdateForm,
  validModalTitle,
  openStatusChange,
  openIntentionChange,
  saveStatusChange,
  saveValidChange,
  updateCustomerStar,
  closeStatusModal,
  closeValidModal
} = useCustomerTraceActions<SysCustomerData>({
  getStatusName: value => getDictOptionName(statusOption.value, value, ""),
  getIntentionName: value => getDictOptionName(intentionOption.value, value, ""),
  getCustomerStarName: value => resolveCustomerStarOptionName(customerStarOption.value, value),
  getCustomerValidName: resolveCustomerValidName,
  prepareValidOptions: type => loadCustomerValidOptions(type),
  persistTracePayload: async (payload, context) => {
    await updateCustomerStatusTrace(payload);
    await loadData();
    Message.success(context.successText);
  }
});

// 详情抽屉相关
const detailVisible = ref(false);
const selectedCustomerId = ref<number>();
const selectedCustomerData = ref<SysCustomerData>();

// 搜索表单
const searchForm = reactive(createCustomerSearchForm());

const {
  manageValidModalVisible,
  editValidModalVisible,
  editValidFormRef,
  validLoading,
  customerValidList,
  editingValid,
  validRules,
  openManageValidModal: handleManageValid,
  openCreateValid: handleCreateValid,
  openEditValid: handleEditValid,
  deleteValidItem: handleDeleteValid,
  saveValidItem: handleSaveValid,
  closeEditValidModal: handleCancelEditValid
} = useCustomerValidManager({
  getCurrentType: () => validUpdateForm.newIntention,
  reloadAllOptions: () => loadAllCustomerValidOptions(),
  reloadSelectableOptions: async type => {
    if (validModalVisible.value && type) {
      await loadCustomerValidOptions(type);
    }
  }
});

// 监听部门选择变化，更新跟进人列表
watch(
  [() => searchForm.deptId, () => departmentTreeLoaded.value],
  async ([newDeptId, isDepartmentTreeLoaded]) => {
    if (!isDepartmentTreeLoaded) return;
    await loadFollowerOptionsForSearch(newDeptId);
  },
  { immediate: true }
);

const editingData = reactive<Partial<SysCustomerData>>({
  id: undefined,
  num: undefined,
  name: undefined,
  mobile: undefined,
  mdMobile: undefined,
  moneyDemand: undefined,
  channelId: undefined,
  userName: undefined,
  customerStar: undefined,
  status: undefined,
  intention: undefined,
  lastTime: undefined,
  extra: "", // 扩展属性，存储JSON字符串
  extraData: {}, // 用于表单绑定的对象
  singlePieceType: undefined,
  sex: undefined,
  allotTime: undefined,
  deptId: undefined,
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
  dispatchTime: undefined,
  isRemind: undefined,
  isSms: undefined,
  starStatus: undefined,
  isExchange: undefined,
  publicTypeTime: undefined,
  publicType: undefined,
  isLock: undefined
});

const normalizeEditingMobile = (value: unknown) => String(value ?? "").replace(/\s+/g, "");

const isCompliantMobile = (value: unknown) => verifyPhone(normalizeEditingMobile(value));

const rules = {
  name: [{ required: true, message: "请输入客户姓名" }],
  mobile: [{ required: true, message: "请输入手机号" }],
  channelId: [{ required: true, message: "请选择渠道来源" }]
};

// 分页配置
const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50]
}));

const commentExpandedKeys = computed(() =>
  dataList.value
    .filter(item => typeof item.customerComment === "string" && item.customerComment.trim())
    .map(item => item.id)
    .filter((id): id is number => typeof id === "number")
);

// 获取数据列表
const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params = buildCustomerListParams(searchForm, { pageNum, pageSize: pageSizeVal }, listScene);
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
  resetCustomerSearchForm(searchForm);
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
    channelId: undefined,
    userName: undefined,
    customerStar: undefined,
    status: undefined,
    intention: undefined,
    lastTime: undefined,
    extra: "",
    extraData: {},
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
    deptId: undefined,
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
    dispatchTime: undefined,
    isRemind: undefined,
    isSms: undefined,
    starStatus: undefined,
    isExchange: undefined,
    publicTypeTime: undefined,
    publicType: undefined,
    isLock: undefined
  });
  modalVisible.value = true;
};

// 查看详情
const syncCustomerReadState = (customerId: number, isRead: number) => {
  const target = dataList.value.find(item => item.id === customerId);
  if (target) {
    target.isRead = isRead;
  }

  if (selectedCustomerData.value?.id === customerId) {
    selectedCustomerData.value = {
      ...selectedCustomerData.value,
      isRead
    };
  }
};

const markCustomerAsRead = async (record: SysCustomerData, detailData?: SysCustomerData) => {
  const currentUserId = Number(userInfo?.id ?? 0);
  const ownerUserId = Number(detailData?.userId ?? record.userId ?? 0);
  if (!currentUserId || !ownerUserId || currentUserId !== ownerUserId) {
    return;
  }

  const currentIsRead = Number(detailData?.isRead ?? record.isRead ?? 0);
  if (currentIsRead === 1) {
    syncCustomerReadState(record.id, 1);
    return;
  }

  try {
    await updateCustomerStatusTrace({
      customerId: record.id,
      isRead: 1
    });
    syncCustomerReadState(record.id, 1);
  } catch (error) {
    console.error("标记客户已读失败:", error);
  }
};

const handleViewDetail = async (record: SysCustomerData) => {
  try {
    // 获取详情数据
    const detail = await getDetail(record.id);
    selectedCustomerId.value = record.id;
    selectedCustomerData.value = detail.data;
    detailVisible.value = true;
    void markCustomerAsRead(record, detail.data);
  } catch (error) {
    console.error("获取客户详情失败:", error);
    Message.error("获取客户详情失败");
  }
};

// 关闭详情抽屉
const handleDetailClose = () => {
  detailVisible.value = false;
  selectedCustomerId.value = undefined;
  selectedCustomerData.value = undefined;
};

// 编辑数据
const handleDetailUpdated = async (customer: any) => {
  selectedCustomerData.value = customer;
  await loadData();
};

const handleEdit = async (record: SysCustomerData) => {
  try {
    // 获取详情
    const detail = await getDetail(record.id);

    // 赋值给编辑数据
    Object.assign(editingData, detail.data);

    // 处理extra字段：将JSON字符串转换为对象
    if (editingData.extra && typeof editingData.extra === "string") {
      try {
        const extraObj = JSON.parse(editingData.extra);
        editingData.extraData = extraObj;
      } catch (error) {
        console.error("解析extra字段失败:", error);
        editingData.extraData = {};
      }
    } else if (editingData.extra && typeof editingData.extra === "object") {
      // 如果extra已经是对象，直接使用
      editingData.extraData = editingData.extra;
    } else {
      editingData.extraData = {};
    }

    modalVisible.value = true;
  } catch (error) {
    console.error("编辑数据失败:", error);
    Message.error("获取数据失败");
  }
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
    console.error("删除失败:", error);
  }
};

// 保存数据
const getTrimmedString = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
};

const buildExtraPayload = () => {
  const source = editingData.extraData && typeof editingData.extraData === "object" ? editingData.extraData : {};
  const extraData = Object.entries(source).reduce<Record<string, unknown>>((result, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      result[key] = value;
    }
    return result;
  }, {});

  return JSON.stringify(extraData);
};

const buildCreatePayload = (): SysCustomerCreateParams => ({
  name: getTrimmedString(editingData.name),
  mobile: normalizeEditingMobile(editingData.mobile),
  moneyDemand: editingData.moneyDemand ?? 0,
  channelId: Number(editingData.channelId ?? 0),
  extra: buildExtraPayload(),
  remarks: getTrimmedString(editingData.remarks),
  ...(editingData.customerStar != null ? { customerStar: Number(editingData.customerStar) } : {}),
  ...(editingData.status != null ? { status: Number(editingData.status) } : {}),
  ...(editingData.intention != null ? { intention: Number(editingData.intention) } : {}),
  ...(editingData.sex != null ? { sex: Number(editingData.sex) } : {}),
  ...(editingData.age != null ? { age: Number(editingData.age) } : {})
});

const buildUpdatePayload = (): SysCustomerUpdateParams => ({
  id: Number(editingData.id),
  name: getTrimmedString(editingData.name),
  mobile: normalizeEditingMobile(editingData.mobile),
  moneyDemand: editingData.moneyDemand ?? 0,
  channelId: editingData.channelId != null ? Number(editingData.channelId) : undefined,
  customerStar: editingData.customerStar ?? null,
  status: editingData.status ?? 0,
  intention: editingData.intention ?? 0,
  extra: buildExtraPayload(),
  sex: editingData.sex ?? 2,
  remarks: getTrimmedString(editingData.remarks),
  age: editingData.age ?? undefined,
  deptId: editingData.deptId != null ? Number(editingData.deptId) : undefined,
  isLock: editingData.isLock ?? 0,
  singlePieceType: editingData.singlePieceType ?? 0
});

const handleSave = async () => {
  const normalizedMobile = normalizeEditingMobile(editingData.mobile);
  editingData.mobile = normalizedMobile || undefined;
  const isValid = await formRef.value?.validate();
  if (isValid) return false;

  if (!isCompliantMobile(normalizedMobile)) {
    Message.error("请输入正确的11位手机号");
    return false;
  }

  try {
    // 只提交保存所需字段，避免把列表/详情字段一起带给接口
    if (editingData.id) {
      // 更新数据
      await updateData(buildUpdatePayload());
    } else {
      // 创建数据
      await createData(buildCreatePayload());
    }
    // 重新加载数据
    await loadData();
    modalVisible.value = false;
    return true;
  } catch (error) {
    console.error("保存失败:", error);
    return false;
  }
};

// 取消操作
const handleCancel = () => {
  modalVisible.value = false;
};

// 获取extra属性值
const getExtraPropertyValue = (property: string) => {
  const value = editingData.extraData?.[property];
  // 确保返回字符串类型，因为下拉框需要字符串值
  return value ? String(value) : "";
};

// 设置extra属性值
const setExtraPropertyValue = (property: string, value: string) => {
  if (!editingData.extraData) {
    editingData.extraData = {};
  }
  editingData.extraData[property] = value;
};

// 处理状态变化
const handleStatusChange = (record: SysCustomerData, newStatus: number) => {
  openStatusChange(record, newStatus);
};

// 获取状态颜色
const getStatusColor = (status: number) => resolveCustomerStatusColor(status);

// 获取客户有效性颜色
const getIntentionColor = (intention: number) => resolveCustomerIntentionColor(intention);

// 获取状态显示文本（包含进度备注）
const getStatusDisplayText = (record: SysCustomerData) => {
  return resolveCustomerStatusDisplayText(record, statusOption.value);
};

const handleStatusSave = async () => {
  try {
    return await saveStatusChange();
  } catch (error) {
    console.error("更新状态失败:", error);
    return false;
  }
};

const handleStatusCancel = () => {
  closeStatusModal();
};

const getValidModalTitle = () => {
  return validModalTitle.value;
};

// 获取客户有效性显示文本（包含说明名称）
const getIntentionDisplayText = (record: SysCustomerData) => {
  return resolveCustomerIntentionDisplayText(record, intentionOption.value, allCustomerValidOptionsMap.value);
};

// 获取星级显示文本
const getCustomerStarDisplayText = (record: SysCustomerData) => {
  return resolveCustomerStarDisplayText(record, customerStarOption.value);
};

const getCustomerStarTagColor = (value?: number | null) => {
  return resolveCustomerStarTagColor(value);
};

const handleCustomerStarChange = async (record: SysCustomerData, newCustomerStar: number) => {
  try {
    await updateCustomerStar(record, newCustomerStar);
  } catch (error) {
    console.error("更新星级失败:", error);
  }
};

const handleIntentionChange = async (record: SysCustomerData, newIntention: number) => {
  try {
    await openIntentionChange(record, newIntention);
  } catch (error) {
    console.error("更新客户有效性失败:", error);
  }
};

const handleValidSave = async () => {
  const isValid = await validFormRef.value?.validate();
  if (isValid) return false;

  try {
    return await saveValidChange();
  } catch (error) {
    console.error("更新客户有效性失败:", error);
    return false;
  }
};

const handleValidCancel = () => {
  closeValidModal();
};

// 切换锁定状态
const handleToggleLock = async (record: SysCustomerData) => {
  try {
    const newLockStatus = record.isLock === 1 ? 0 : 1;
    record.isLock = newLockStatus;
    await updateData(record);
    if (newLockStatus === 1) {
      Message.success(`已锁定客户：${record.name}`);
    } else {
      Message.success(`已解锁客户：${record.name}`);
    }
  } catch (error) {
    console.error("切换锁定状态失败:", error);
  }
};

// 查询渠道数据
const fetchChannelData = async () => {
  try {
    const params: SysChannelCompanyListParams = {
      pageNum: 1,
      pageSize: 1000 // 设置较大的页面大小以获取所有数据
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
    console.error("获取渠道数据失败:", error);
    channelOption.value = [];
  }
};

onMounted(async () => {
  // 初始化加载数据
  await loadData();
  // 加载渠道数据
  await fetchChannelData();
  // 加载部门树数据
  await getDepartmentTree();
  // 加载客户有效性标签数据
  await loadAllCustomerValidOptions();
  // 确保系统配置已加载
  await sysConfigStore.getConfig();
});
</script>

<style scoped lang="scss">
.customer-editor {
  --editor-border: rgba(15, 35, 95, 0.08);
  --editor-shadow: 0 18px 40px rgba(15, 35, 95, 0.08);
  --editor-soft-bg: linear-gradient(135deg, #f4f8ff 0%, #f7fafc 55%, #eef5ff 100%);
  --editor-title: #1d2129;
  --editor-text: #4e5969;
  --editor-muted: #86909c;
  --editor-accent: #165dff;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 680px;
  margin: 0 auto;
}

.editor-hero {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  background: var(--editor-soft-bg);
  border: 1px solid rgba(22, 93, 255, 0.08);
  border-radius: 16px;
}

.editor-hero-main {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.editor-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%);
  border-radius: 16px;
  box-shadow: 0 10px 18px rgba(29, 78, 216, 0.18);
}

.editor-hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.editor-hero-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--editor-title);
}

.editor-hero-subtitle {
  font-size: 12px;
  line-height: 1.5;
  color: var(--editor-text);
}

.editor-hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-section {
  padding: 14px;
  background: #fff;
  border: 1px solid var(--editor-border);
  border-radius: 14px;
  box-shadow: var(--editor-shadow);
}

.editor-section-tight {
  padding: 12px;
}

.editor-section-head {
  margin-bottom: 8px;
}

.editor-section-title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 700;
  color: var(--editor-title);
}

.editor-section-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--editor-muted);
}

.editor-status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.editor-status-card {
  padding: 10px 12px;
  background: linear-gradient(180deg, #fcfdff 0%, #f6f9ff 100%);
  border: 1px solid rgba(22, 93, 255, 0.08);
  border-radius: 12px;
}

.qualification-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.qualification-card {
  padding: 10px;
  background: linear-gradient(180deg, #fbfdff 0%, #f7faff 100%);
  border: 1px solid rgba(22, 93, 255, 0.08);
  border-radius: 12px;
}

.qualification-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.qualification-card-dot {
  width: 8px;
  height: 8px;
  background: #c9cdd4;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(201, 205, 212, 0.18);
}

.qualification-card-dot-active {
  background: linear-gradient(135deg, #165dff 0%, #36bffa 100%);
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.08);
}

.qualification-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--editor-text);
}

.editor-compact-item {
  margin-bottom: 0;
}

.editor-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  min-height: 40px;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #d9dee8;
  border-radius: 12px;
}

.editor-radio-group-compact {
  min-height: 36px;
  padding: 6px 8px;
}

.editor-number-input {
  width: 100%;
}

.editor-remark-field {
  margin-top: 8px;
  margin-bottom: 0;
}

.customer-editor :deep(.arco-form-item) {
  margin-bottom: 12px;
}

.customer-editor :deep(.arco-form-item:last-child) {
  margin-bottom: 0;
}

.customer-editor :deep(.arco-form-item-label-col > label) {
  font-size: 12px;
  font-weight: 600;
  color: var(--editor-text);
}

.customer-editor :deep(.editor-compact-item .arco-form-item-content-flex) {
  gap: 6px;
}

.customer-editor :deep(.editor-status-card .arco-select-view),
.customer-editor :deep(.qualification-select .arco-select-view) {
  background: #fff;
}

.customer-editor :deep(.editor-status-card .arco-input-number),
.customer-editor :deep(.editor-status-card .arco-select-view),
.customer-editor :deep(.qualification-select .arco-select-view) {
  min-height: 36px;
}

.customer-editor :deep(.arco-input-wrapper),
.customer-editor :deep(.arco-input-number),
.customer-editor :deep(.arco-select-view),
.customer-editor :deep(.arco-textarea-wrapper) {
  border-radius: 12px;
}

.customer-editor :deep(.arco-input-wrapper),
.customer-editor :deep(.arco-input-number),
.customer-editor :deep(.arco-select-view),
.customer-editor :deep(.arco-textarea-wrapper),
.customer-editor :deep(.arco-picker) {
  border-color: #d9dee8;
  transition: all 0.2s ease;
}

.customer-editor :deep(.arco-input-wrapper:hover),
.customer-editor :deep(.arco-input-number:hover),
.customer-editor :deep(.arco-select-view:hover),
.customer-editor :deep(.arco-textarea-wrapper:hover) {
  border-color: rgba(22, 93, 255, 0.45);
}

.customer-editor :deep(.arco-input-wrapper:focus-within),
.customer-editor :deep(.arco-input-number:focus-within),
.customer-editor :deep(.arco-select-view.arco-select-view-focus),
.customer-editor :deep(.arco-textarea-wrapper:focus-within) {
  border-color: var(--editor-accent);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.12);
}

.customer-editor :deep(.arco-textarea-wrapper textarea) {
  line-height: 1.7;
}

@media (max-width: 768px) {
  .customer-editor {
    max-width: none;
    gap: 14px;
  }

  .editor-hero,
  .editor-section {
    padding: 14px;
    border-radius: 16px;
  }

  .editor-avatar {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .editor-hero-title {
    font-size: 18px;
  }

  .editor-status-grid,
  .qualification-card-grid {
    grid-template-columns: 1fr;
  }

  .qualification-card {
    padding: 12px;
  }

  .qualification-grid {
    grid-template-columns: 1fr;
  }
}

.table-remark-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.table-remark-wrapper {
  cursor: pointer;
}

.table-customer-comment-row {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  color: #f53f3f;
  background: #fff7f7;
  border-left: 3px solid #f53f3f;
}

.customer-num-link {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  color: #165dff;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}

.customer-num-link:hover {
  color: #4080ff;
}

.customer-num-link--unread {
  color: #f53f3f;
  font-weight: 600;
}

.customer-num-link--unread:hover {
  color: #f77272;
}

:deep(.arco-table-th.arco-table-operation.arco-table-expand),
:deep(.arco-table-td.arco-table-operation.arco-table-expand) {
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  border-right: none !important;
}

:deep(.arco-table-th.arco-table-operation.arco-table-expand .arco-table-cell),
:deep(.arco-table-td.arco-table-operation.arco-table-expand .arco-table-cell) {
  display: none !important;
}

:deep(.arco-table-tr-expand .arco-table-td) {
  padding: 6px 12px !important;
}

.remark-popover-content {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
