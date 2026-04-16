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
              <!-- 渠道来源选择框查询（客户表当前使用渠道来源 ID） -->
              <a-form-item field="channelId" label="渠道来源">
                <a-select v-model="searchForm.channelId" placeholder="渠道来源" allow-clear>
                  <a-option v-for="item in channelCompanyOptions" :key="item.value" :value="Number(item.value)">{{
                    item.name
                  }}</a-option>
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
                <a-button v-if="props.showExportAction" :loading="exporting" @click="handleExport">
                  <template #icon>
                    <icon-export />
                  </template>
                  <span>导出数据</span>
                </a-button>
                <a-button
                  v-if="props.showImportAction"
                  type="primary"
                  status="success"
                  @click="openImportModal"
                  :disabled="importActionInProgress"
                  :class="[
                    'customer-import-action-button',
                    { 'customer-import-action-button--progress': importActionInProgress }
                  ]"
                  :style="importActionButtonStyle"
                  v-hasPerm="props.importPermission"
                >
                  <span class="customer-import-action-button__content">
                    <icon-refresh
                      v-if="importActionInProgress"
                      class="customer-import-action-button__icon customer-import-action-button__icon--spin"
                    />
                    <icon-upload v-else class="customer-import-action-button__icon" />
                    <span>{{ importActionButtonLabel }}</span>
                  </span>
                </a-button>
                <a-button v-if="props.showCreateAction" type="primary" @click="handleCreate" v-hasPerm="props.createPermission">
                  <template #icon>
                    <icon-plus />
                  </template>
                  <span>新增数据</span>
                </a-button>
              </a-space>
              <div v-if="shouldShowImportResumeReminder && activeImportTask" class="customer-export-task-banner">
                <a-alert
                  type="warning"
                  title="检测到需要续传的导入任务"
                  show-icon
                  closable
                  @close="handleDismissImportResumeReminder"
                >
                  {{ importResumeBannerText }}
                </a-alert>
              </div>
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
                {{ channelCompanyOptions.find(item => item.value === record.channelId)?.name || "" }}
              </template>
            </a-table-column>
            <a-table-column title="跟进人" data-index="userName" :width="100" ellipsis tooltip>
              <template #cell="{ record }">
                {{ record.userName || followerOptions.find(item => item.value === record.userId)?.name || "" }}
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
            <a-table-column title="操作" :width="250" :fixed="isMobile ? undefined : 'right'">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" type="primary" @click="handleViewDetail(record)" v-hasPerm="props.detailPermission">
                    详情
                  </a-button>
                  <a-button size="small" @click="handleEdit(record)" v-hasPerm="props.editPermission"> 编辑 </a-button>
                  <a-popconfirm content="确定要删除这条数据吗？" @ok="handleDelete(record.id)">
                    <a-button size="small" status="danger" v-hasPerm="props.deletePermission"> 删除 </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>

      <a-modal
        v-model:visible="importModalVisible"
        title="导入客户"
        :on-before-ok="handleImportConfirm"
        @cancel="handleImportCancel"
        :ok-loading="importing"
        width="560px"
        okText="确认上传"
        :body-style="{ padding: '20px' }"
      >
        <div class="customer-import-panel">
          <div class="customer-import-toolbar">
            <a-button type="outline" @click="handleDownloadImportDemo">
              <template #icon>
                <icon-download />
              </template>
              下载模板
            </a-button>
            <div class="customer-import-toolbar-tip">先下载模板，再填写并上传 .xlsx 文件。</div>
          </div>
          <a-form :model="importForm" layout="vertical" class="customer-import-form">
            <a-form-item field="channelCompanyId" label="导入渠道" required>
              <div class="customer-import-field">
                <a-select v-model="importForm.channelCompanyId" placeholder="请选择导入渠道" allow-clear style="width: 100%">
                  <a-option v-for="item in channelCompanyOptions" :key="item.value" :value="Number(item.value)">
                    {{ item.name }}
                  </a-option>
                </a-select>
              </div>
            </a-form-item>

            <a-form-item field="startRow" label="起始导入行">
              <div class="customer-import-field customer-import-field--stack">
                <a-input-number
                  v-model="importForm.startRow"
                  :min="2"
                  :step="1"
                  placeholder="默认从第 2 行开始"
                  style="width: 100%"
                />
                <div class="customer-import-help-text">
                  {{ importResumeHint }}
                </div>
              </div>
            </a-form-item>

            <a-form-item field="remark" label="批次备注">
              <div class="customer-import-field">
                <a-textarea
                  v-model="importForm.remark"
                  placeholder="选填，便于区分本次导入批次"
                  :max-length="255"
                  show-word-limit
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </div>
            </a-form-item>

            <a-form-item field="file" label="导入文件" required>
              <div class="customer-import-field customer-import-field--stack">
                <input
                  ref="importFileInputRef"
                  class="customer-import-input"
                  type="file"
                  accept=".xlsx"
                  @change="handleImportFileChange"
                />
                <div
                  :class="[
                    'customer-import-file-card',
                    importForm.file ? 'customer-import-file-card--ready' : 'customer-import-file-card--idle'
                  ]"
                >
                  <div class="customer-import-file-card-copy">
                    <div class="customer-import-file-card-title">
                      {{ importForm.file ? importForm.file.name : "请上传 .xlsx 模板文件" }}
                    </div>
                    <div class="customer-import-file-card-desc">
                      {{ importForm.file ? "文件已就绪" : "" }}
                    </div>
                  </div>
                  <a-button @click="triggerImportFileSelect">
                    <template #icon>
                      <icon-upload />
                    </template>
                    <div>
                      {{ importForm.file ? "重新选择文件" : "选择上传文件" }}
                    </div>
                  </a-button>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-modal>

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
                      <a-option v-for="item in channelCompanyOptions" :key="item.value" :value="Number(item.value)">{{
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
      <!--      客户状态弹窗-->
      <CustomerTraceManageModals
        :status-modal-visible="statusModalVisible"
        :valid-modal-visible="validModalVisible"
        :manage-valid-modal-visible="manageValidModalVisible"
        :edit-valid-modal-visible="editValidModalVisible"
        :status-update-form="statusUpdateForm"
        :valid-update-form="validUpdateForm"
        :valid-modal-title="getValidModalTitle()"
        :status-tag-text="statusOption.find(item => Number(item.value) === statusUpdateForm.newStatus)?.name || '-'"
        :status-tag-color="getStatusColor(statusUpdateForm.newStatus ?? 0)"
        :customer-valid-options="customerValidOptions"
        :valid-loading="validLoading"
        :customer-valid-list="customerValidList"
        :editing-valid="editingValid"
        :valid-rules="validRules"
        :on-status-save="handleStatusSave"
        :on-status-cancel="handleStatusCancel"
        :on-valid-save="handleValidSave"
        :on-valid-cancel="handleValidCancel"
        :on-manage-valid="handleManageValid"
        :on-close-manage-valid="closeManageValidModal"
        :on-create-valid="handleCreateValid"
        :on-edit-valid="handleEditValid"
        :on-delete-valid="handleDeleteValid"
        :on-save-valid-item="handleSaveValid"
        :on-cancel-edit-valid="handleCancelEditValid"
        @update:status-progress-remark="value => (statusUpdateForm.progressRemark = value)"
        @update:valid-id="value => (validUpdateForm.validId = value)"
        @update:editing-valid-name="value => (editingValid.name = value)"
        @update:editing-valid-status="value => (editingValid.status = value)"
      />
    </div>

    <!-- 客户详情抽屉 -->
    <SysCustomerDetail
      v-model:visible="detailVisible"
      :customer-id="selectedCustomerId"
      :customer-data="selectedCustomerData"
      :channel-options="channelCompanyOptions"
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, h } from "vue";
import { Button, Message, Modal, Notification, Space } from "@arco-design/web-vue";
import { useSysCustomerPluginHook } from "../hooks/syscustomer.ts";
import {
  cancelSysCustomerImportBatch,
  exportSysCustomerList,
  getLatestSysCustomerImportBatch,
  importSysCustomerFile,
  submitSysCustomerExport,
  type CustomerListScene,
  type SysCustomerCreateParams,
  type SysCustomerData,
  type SysCustomerUpdateParams
} from "../api/syscustomer.ts";
import { formatTime, getDictOptionName } from "@/globals";
import { useDevicesSize } from "@/hooks/useDevicesSize.ts";
import { verifyPhone } from "@/utils/verify-tools.ts";
import { getSysChannelCompanyList } from "../../syschannelcompany/api/syschannelcompany.ts";
import type { SysChannelCompanyData, SysChannelCompanyListParams } from "../../syschannelcompany/api/syschannelcompany.ts";
import SysCustomerDetail from "../views/syscustomer/syscustomerdetail.vue";
import CustomerOptionDropdownTag from "./customer-option-dropdown-tag.vue";
import CustomerTraceManageModals from "./customer-trace-manage-modals.vue";
import {
  buildCustomerListParams,
  createCustomerSearchForm,
  resetCustomerSearchForm,
  type CustomerListSearchForm
} from "../hooks/list-query.ts";
import { formatCustomerRemarkDisplay } from "../hooks/remark.ts";
import { ALL_EXTRA_PROPERTIES, EXTRA_PROPERTY_LABELS } from "../hooks/customer-fields.ts";
import { useCustomerDepartmentScope } from "../hooks/department.ts";
import {
  getCustomerIntentionColor as resolveCustomerIntentionColor,
  getCustomerIntentionDisplayText as resolveCustomerIntentionDisplayText,
  getCustomerStarDisplayText as resolveCustomerStarDisplayText,
  getCustomerStarOptionName as resolveCustomerStarOptionName,
  getCustomerStarTagColor as resolveCustomerStarTagColor,
  getCustomerStatusColor as resolveCustomerStatusColor,
  getCustomerStatusDisplayText as resolveCustomerStatusDisplayText,
  useCustomerValidOptions
} from "../hooks/customer-status.ts";
import { useCustomerTraceActions } from "../hooks/customer-trace-actions.ts";
import { useCustomerValidManager } from "../hooks/customer-valid-manager.ts";
const { isMobile } = useDevicesSize();
import { UserInfoKey } from "@/utils/auth.ts";
import { getLocalStorage } from "@/utils/app.ts";
import { useSysConfigStore } from "@/store/modules/sys-config.ts"; // 系统配置store
import {
  buildCustomerImportNotificationId,
  customerImportTaskNoticeEventName,
  type CustomerImportTaskNoticeDetail
} from "@/utils/notice-websocket";

interface Props {
  scene?: CustomerListScene;
  presetSearchForm?: Partial<CustomerListSearchForm>;
  showCreateAction?: boolean;
  showExportAction?: boolean;
  showImportAction?: boolean;
  createPermission?: string[];
  importPermission?: string[];
  editPermission?: string[];
  deletePermission?: string[];
  detailPermission?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  scene: "all",
  presetSearchForm: () => ({}),
  showCreateAction: true,
  showExportAction: false,
  showImportAction: false,
  createPermission: () => ["plugins:syscustomersyscustomer:add"],
  importPermission: () => ["plugins:syscustomersyscustomer:add"],
  editPermission: () => ["plugins:syscustomersyscustomer:edit"],
  detailPermission: () => ["plugins:syscustomersyscustomer:detail"],
  deletePermission: () => ["plugins:syscustomersyscustomer:delete"]
});

const userInfo = getLocalStorage<any>(UserInfoKey);

// scene + presetSearchForm 是列表母版最重要的两个扩展点：
// 1. scene 走后端的默认业务场景筛选
// 2. presetSearchForm 用于前端额外固化某些查询条件
const buildPageSearchForm = () => Object.assign(createCustomerSearchForm(), props.presetSearchForm);

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
const channelCompanyOptions = ref<{ value: number; name: string }[]>([]);

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
const importModalVisible = ref(false);
const formRef = ref();
const importFileInputRef = ref<HTMLInputElement>();
const exporting = ref(false);
// 导入流程会有两种“正在处理”状态：
// 1. importing: 前端正在把文件和参数提交给后端
// 2. cancelingImport: 前端正在提交“终止导入”指令
const importing = ref(false);
const cancelingImport = ref(false);
const cancelImportConfirmVisible = ref(false);
const visibleImportNotificationTaskId = ref<number | null>(null);
const visibleImportNotificationSignature = ref("");
const cancelRequestedImportTaskIds = new Set<number>();
// 如果上一次导入中断，这里会保存建议继续导入的起始行号。
const suggestedImportResumeRow = ref(0);
// 导入弹窗表单：渠道、起始行、备注、文件都集中放这里，便于一次性校验和提交。
const importForm = reactive<{
  channelCompanyId?: number;
  startRow: number;
  remark: string;
  file: File | null;
}>({
  channelCompanyId: undefined,
  startRow: 2,
  remark: "",
  file: null
});

type ImportTaskStatus = "pending" | "running" | "canceling" | "canceled" | "success" | "partial" | "failed";

// 这是前端统一使用的导入任务结构。
// 不管数据来自“刚提交导入后的返回结果”，还是“轮询/通知推送”，最后都会转成这个格式。
type ImportTaskData = {
  id: number;
  status: ImportTaskStatus | string;
  startRow: number;
  resumeRow?: number;
  interrupted: boolean;
  totalCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  progress: number;
  errorMessage?: string;
  fileName?: string;
  remark?: string;
};

const activeImportTask = ref<ImportTaskData | null>(null);
// 用户手动点掉“继续导入提醒”后，本次页面停留期间不再反复提示。
const importResumeReminderDismissed = ref(false);

const importTemplateHeaders = ["客户姓名", "手机号", "年龄", "星级", "需求金额", "客户备注", "性别"];

const importGuideItems = [
  "模板首行必须保留表头，字段名需要与标准模板完全一致。",
  "手机号必须是 11 位大陆手机号，性别支持“男 / 女 / 空值”。",
  "默认从第 2 行开始导入；如果任务中断，可按建议行号继续上传同一模板。",
  "当前模板暂不传资质数据"
];

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

// 搜索表单会在默认模型的基础上叠加 presetSearchForm，保证不同页面共用同一份母版时仍能保留各自语义。
const searchForm = reactive(buildPageSearchForm());
const currentImportSceneName = computed(() => resolveExportSceneName(props.scene));
// 后端状态字段可能为空或混入其他类型，这里统一转成字符串再判断，避免重复写 String(...)。
const normalizeImportTaskStatus = (status?: ImportTaskStatus | string) => String(status || "");
const buildImportCountSummary = (successCount: number, failedCount: number, duplicateCount: number) => {
  const parts = [`导入成功 ${successCount} 条`, `导入失败 ${failedCount} 条`];
  if (duplicateCount > 0) {
    parts.push(`重复数据：${duplicateCount}`);
  }
  return `${parts.join("，")}。`;
};
const isImportTaskResumable = (task?: ImportTaskData | null) => {
  if (!task || !task.resumeRow) {
    return false;
  }

  const status = normalizeImportTaskStatus(task.status);
  return status === "failed" || (status === "partial" && task.interrupted);
};
const isImportTaskCancelable = (task?: ImportTaskData | null) =>
  ["pending", "running"].includes(normalizeImportTaskStatus(task?.status));
const isImportTaskProcessing = (task?: ImportTaskData | null) =>
  ["pending", "running", "canceling"].includes(normalizeImportTaskStatus(task?.status));
const isImportTaskCancelLocked = (task?: ImportTaskData | null) => {
  const taskId = Number(task?.id || 0);
  return (
    cancelingImport.value ||
    cancelImportConfirmVisible.value ||
    normalizeImportTaskStatus(task?.status) === "canceling" ||
    (taskId > 0 && cancelRequestedImportTaskIds.has(taskId))
  );
};
// 所有进度条显示都经过这里兜底，保证最终一定是 0 到 100 之间的整数。
const clampImportProgress = (value: unknown, fallback: number = 0) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }
  return Math.min(100, Math.max(0, Math.round(numericValue)));
};
const shouldShowImportResumeReminder = computed(() => {
  const task = activeImportTask.value;
  if (!task || importResumeReminderDismissed.value) {
    return false;
  }
  return isImportTaskResumable(task);
});
const importResumeBannerText = computed(() => {
  const task = activeImportTask.value;
  if (!task?.resumeRow) {
    return "";
  }
  return `上次导入在第 ${task.resumeRow} 行附近中断，建议从第 ${task.resumeRow} 行继续上传同一模板。`;
});
const importResumeHint = computed(() =>
  shouldShowImportResumeReminder.value && suggestedImportResumeRow.value > 1
    ? `检测到上次任务中断，建议从第 ${suggestedImportResumeRow.value} 行继续导入。`
    : "默认从第 2 行开始，首行表头不会被导入。"
);
const importActionInProgress = computed(
  () => importing.value || cancelingImport.value || isImportTaskProcessing(activeImportTask.value)
);
const importActionButtonProgress = computed(() => {
  if (importing.value && !isImportTaskProcessing(activeImportTask.value)) {
    return 12;
  }

  const task = activeImportTask.value;
  if (!task || !isImportTaskProcessing(task)) {
    return 0;
  }

  if (normalizeImportTaskStatus(task.status) === "pending") {
    return Math.max(8, clampImportProgress(task.progress));
  }

  return Math.max(12, clampImportProgress(task.progress));
});
const importActionButtonLabel = computed(() => {
  if (importing.value && !isImportTaskProcessing(activeImportTask.value)) {
    return "提交中...";
  }

  const task = activeImportTask.value;
  if (!task) {
    return "导入数据";
  }

  switch (normalizeImportTaskStatus(task.status)) {
    case "pending":
      return "导入排队中";
    case "running":
      return `导入中 ${clampImportProgress(task.progress)}%`;
    case "canceling":
      return "终止中...";
    default:
      return "导入数据";
  }
});
const importActionButtonStyle = computed(() =>
  importActionInProgress.value
    ? {
        "--customer-import-progress": `${importActionButtonProgress.value}%`
      }
    : {}
);

// 后端有时会直接返回完整中文总结，有时只返回错误信息。
// 这里统一做一次拼装，确保通知、横幅、任务结果提示使用同一套文案规则。
const buildImportTaskResultSummary = (task: ImportTaskData) => {
  const successCount = Number(task.successCount || 0);
  const failedCount = Number(task.failedCount || 0);
  const duplicateCount = Number(task.duplicateCount || 0);
  const countSummary =
    successCount > 0 || failedCount > 0 || duplicateCount > 0
      ? buildImportCountSummary(successCount, failedCount, duplicateCount)
      : "";
  const detail = String(task.errorMessage || "").trim();

  if (detail.includes("导入成功") && detail.includes("导入失败")) {
    return detail;
  }
  if (countSummary && detail) {
    return `${countSummary}${detail}`;
  }
  if (detail) {
    return detail;
  }
  if (countSummary) {
    return countSummary;
  }
  if (isImportTaskResumable(task) && task.resumeRow) {
    return `上次导入已中断，建议从第 ${task.resumeRow} 行继续导入。`;
  }
  if (String(task.status) === "canceled") {
    return "导入任务已手动终止，本批次已导入客户已按 batch_id 彻底删除。";
  }
  if (String(task.status) === "failed") {
    return "导入任务执行失败，请稍后重试。";
  }
  return "";
};

const {
  manageValidModalVisible,
  editValidModalVisible,
  validLoading,
  customerValidList,
  editingValid,
  validRules,
  openManageValidModal: handleManageValid,
  closeManageValidModal,
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
  const params = buildCustomerListParams(searchForm, { pageNum, pageSize: pageSizeVal }, props.scene);
  await fetchDataList(params);
};

const resolveExportSceneName = (scene?: CustomerListScene) => {
  switch (scene) {
    case "all":
      return "全部客户";
    case "my":
      return "我的客户";
    case "public":
      return "公共池客户";
    case "exchange":
      return "待流转客户";
    case "reassign":
      return "再分配客户";
    case "locked":
      return "锁定客户";
    case "intention2":
      return "无效客户";
    case "intention3":
      return "黑名单客户";
    case "status0":
      return "待处理客户";
    default:
      return "全部客户";
  }
};

const formatExportDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
};

const formatExportTime = (date: Date) => {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  return `${hours}${minutes}${seconds}`;
};

const buildFrontExportShortCode = () => {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint16Array(1);
    crypto.getRandomValues(values);
    return values[0].toString(36).toUpperCase().padStart(4, "0").slice(-4);
  }

  return Math.floor(Math.random() * 1679616)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
};

const buildCustomerExportDownloadName = (scene: CustomerListScene | undefined, total: number) => {
  const now = new Date();
  return `${resolveExportSceneName(scene)}_${formatExportDate(now)}_${formatExportTime(now)}_${buildFrontExportShortCode()}_${total}.csv`;
};

const getImportTaskTitle = (task: ImportTaskData) => {
  switch (normalizeImportTaskStatus(task.status)) {
    case "pending":
      return "导入任务排队中";
    case "running":
      return "导入任务执行中";
    case "canceling":
      return "导入任务终止中";
    case "canceled":
      return "导入任务已终止";
    case "partial":
      return isImportTaskResumable(task) ? "导入任务已中断" : "导入任务部分完成";
    case "failed":
      return isImportTaskResumable(task) ? "导入任务已中断" : "导入任务执行失败";
    case "success":
      return "导入任务已完成";
    default:
      return "导入任务状态";
  }
};

const getImportTaskSummary = (task: ImportTaskData) => {
  const duplicateSummary = Number(task.duplicateCount || 0) > 0 ? `，重复数据：${Number(task.duplicateCount || 0)}` : "";
  switch (normalizeImportTaskStatus(task.status)) {
    case "pending":
      return `任务已进入队列，文件 ${task.fileName || "客户导入文件"} 正在等待处理。`;
    case "running":
      return `正在导入，已处理 ${task.processedCount || 0}/${task.totalCount || 0} 行，当前进度 ${clampImportProgress(task.progress)}%${duplicateSummary}。`;
    case "canceling":
      return "已提交终止指令，正在按 batch_id 彻底删除本批次已导入客户。";
    case "canceled":
      return buildImportTaskResultSummary(task);
    case "partial":
    case "failed":
      return buildImportTaskResultSummary(task);
    case "success":
      return buildImportCountSummary(
        Number(task.successCount || 0),
        Number(task.failedCount || 0),
        Number(task.duplicateCount || 0)
      );
    default:
      return "正在同步导入任务状态。";
  }
};

const getImportNotificationProgressTone = (task: ImportTaskData) => {
  switch (normalizeImportTaskStatus(task.status)) {
    case "pending":
      return "linear-gradient(90deg, #ffb65d 0%, #ff7d00 100%)";
    case "canceling":
    case "canceled":
      return "linear-gradient(90deg, #ff7d00 0%, #ffb65d 100%)";
    case "success":
      return "linear-gradient(90deg, #00b42a 0%, #14c9c9 100%)";
    case "partial":
      return "linear-gradient(90deg, #ffb65d 0%, #ff7d00 100%)";
    case "failed":
      return "linear-gradient(90deg, #f53f3f 0%, #ff7d00 100%)";
    default:
      return "linear-gradient(90deg, #165dff 0%, #36bffa 100%)";
  }
};

const dismissedImportProgressNotificationKeys = new Set<string>();
const buildImportProgressNotificationDismissKey = (task: ImportTaskData) => `${task.id}:progress`;
const buildImportProgressNotificationSignature = (task: ImportTaskData) =>
  [
    task.id,
    normalizeImportTaskStatus(task.status),
    Number(task.totalCount || 0),
    Number(task.processedCount || 0),
    Number(task.successCount || 0),
    Number(task.failedCount || 0),
    Number(task.duplicateCount || 0),
    clampImportProgress(task.progress)
  ].join(":");
const isImportProgressNotificationDismissed = (task: ImportTaskData) =>
  dismissedImportProgressNotificationKeys.has(buildImportProgressNotificationDismissKey(task));
const markImportProgressNotificationDismissed = (task: ImportTaskData) => {
  dismissedImportProgressNotificationKeys.add(buildImportProgressNotificationDismissKey(task));
};
const clearImportProgressNotificationDismissed = (task: ImportTaskData) => {
  dismissedImportProgressNotificationKeys.delete(buildImportProgressNotificationDismissKey(task));
};

// 点击“终止导入”后，并不是立刻关任务，而是先通知后端切状态，
// 后端会停止继续导入，并按 batch_id 把本批次已写入的客户彻底删除。
const handleCancelImportTask = async (task?: ImportTaskData | null) => {
  const taskId = Number(task?.id || 0);
  if (!task || taskId <= 0 || !isImportTaskCancelable(task) || isImportTaskCancelLocked(task)) {
    return;
  }

  cancelImportConfirmVisible.value = true;
  Modal.confirm({
    title: "终止导入",
    content: "终止后将按 batch_id 彻底删除当前批次已导入的客户数据。",
    okText: "确认终止",
    cancelText: "继续导入",
    okButtonProps: {
      status: "danger"
    },
    onCancel: () => {
      cancelImportConfirmVisible.value = false;
    },
    onOk: async () => {
      cancelImportConfirmVisible.value = false;
      cancelRequestedImportTaskIds.add(taskId);
      cancelingImport.value = true;
      try {
        const response = await cancelSysCustomerImportBatch(task.id);
        if (response.data) {
          await applyImportTaskSnapshot(
            {
              id: response.data.id,
              status: response.data.status,
              startRow: Number(response.data.startRow || 2),
              resumeRow: response.data.resumeRow,
              interrupted: Boolean(response.data.interrupted),
              totalCount: Number(response.data.totalCount || 0),
              processedCount: Number(response.data.processedCount || 0),
              successCount: Number(response.data.successCount || 0),
              failedCount: Number(response.data.failedCount || 0),
              duplicateCount: Number(response.data.duplicateCount || 0),
              progress: Number(response.data.progress || 0),
              errorMessage: response.data.errorMessage,
              fileName: response.data.fileName,
              remark: response.data.remark
            },
            { reloadList: ["canceled", "partial", "success"].includes(String(response.data.status)) }
          );
        }

        if (response.data?.status === "canceling") {
          Message.success("终止指令已提交");
        } else if (response.data?.status === "canceled") {
          Message.success("导入任务已终止");
        } else {
          Message.info("导入任务状态已更新");
        }
      } catch (error) {
        cancelRequestedImportTaskIds.delete(taskId);
        console.error("终止导入任务失败:", error);
      } finally {
        cancelingImport.value = false;
      }
    }
  });
};
const buildImportNotificationFooter = (task: ImportTaskData, handleAcknowledge: () => void) => () =>
  h(
    Space,
    { size: "mini" },
    {
      default: () => [
        isImportTaskCancelable(task)
          ? h(
              Button,
              {
                status: "danger",
                size: "mini",
                loading: cancelingImport.value,
                disabled: isImportTaskCancelLocked(task),
                onClick: () => void handleCancelImportTask(task)
              },
              {
                default: () => "终止导入"
              }
            )
          : null,
        h(
          Button,
          {
            type: "primary",
            size: "mini",
            onClick: handleAcknowledge
          },
          {
            default: () => "我知道了"
          }
        )
      ]
    }
  );

const openImportProgressNotification = (task: ImportTaskData, options: { force?: boolean } = {}) => {
  const normalizedStatus = normalizeImportTaskStatus(task.status);
  const notificationSignature = buildImportProgressNotificationSignature(task);
  if (options.force) {
    clearImportProgressNotificationDismissed(task);
  } else if (isImportProgressNotificationDismissed(task)) {
    return;
  }

  if (
    !options.force &&
    isImportTaskProcessing(task) &&
    visibleImportNotificationTaskId.value === task.id &&
    visibleImportNotificationSignature.value === notificationSignature
  ) {
    return;
  }

  const notificationId = buildCustomerImportNotificationId(task.id);
  Notification.remove(notificationId);
  const progressPercent = clampImportProgress(task.progress, normalizeImportTaskStatus(task.status) === "pending" ? 8 : 0);
  const renderProgress = isImportTaskProcessing(task) || progressPercent > 0;
  const summary = getImportTaskSummary(task);
  const handleAcknowledge = () => {
    markImportProgressNotificationDismissed(task);
    visibleImportNotificationTaskId.value = null;
    visibleImportNotificationSignature.value = "";
    Notification.remove(notificationId);
  };
  const metaText =
    Number(task.totalCount || 0) > 0
      ? `已处理 ${Number(task.processedCount || 0)}/${Number(task.totalCount || 0)} 行`
      : normalizeImportTaskStatus(task.status) === "pending"
        ? "后台任务已接收，正在等待处理"
        : normalizeImportTaskStatus(task.status) === "canceling"
          ? "正在停止导入任务"
          : "后台任务正在处理中";
  const notificationConfig = {
    id: notificationId,
    title: getImportTaskTitle(task),
    position: "bottomRight" as const,
    duration: 0,
    closable: true,
    footer: buildImportNotificationFooter(task, handleAcknowledge),
    content: () =>
      h("div", { style: { display: "flex", flexDirection: "column", gap: "10px", minWidth: "260px" } }, [
        h(
          "div",
          {
            style: {
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#4e5969"
            }
          },
          summary
        ),
        renderProgress
          ? h("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    fontSize: "12px",
                    color: "#86909c"
                  }
                },
                [h("span", metaText), h("span", `${progressPercent}%`)]
              ),
              h(
                "div",
                {
                  style: {
                    width: "100%",
                    height: "6px",
                    overflow: "hidden",
                    background: "#f2f3f5",
                    borderRadius: "999px"
                  }
                },
                [
                  h("div", {
                    style: {
                      width: `${progressPercent}%`,
                      height: "100%",
                      background: getImportNotificationProgressTone(task),
                      borderRadius: "999px",
                      transition: "width 0.24s ease"
                    }
                  })
                ]
              )
            ])
          : null
      ])
  };

  visibleImportNotificationTaskId.value = task.id;
  visibleImportNotificationSignature.value = notificationSignature;

  if (normalizedStatus === "pending") {
    Notification.warning(notificationConfig);
    return;
  }

  Notification.info(notificationConfig);
};

watch(
  activeImportTask,
  (task, previousTask) => {
    const previousTaskId = Number(previousTask?.id || 0);
    const currentTaskId = Number(task?.id || 0);
    const previousTaskWasProcessing = isImportTaskProcessing(previousTask);

    if (previousTaskWasProcessing && previousTaskId > 0 && previousTaskId !== currentTaskId) {
      Notification.remove(buildCustomerImportNotificationId(previousTaskId));
    }

    if (!task || !currentTaskId) {
      return;
    }

    if (isImportTaskProcessing(task)) {
      openImportProgressNotification(task);
    } else if (previousTaskWasProcessing && previousTaskId === currentTaskId && !isImportProgressNotificationDismissed(task)) {
      openImportProgressNotification(task, { force: true });
    }
  },
  { deep: true }
);

// 任何来源的任务状态更新，最终都走这个方法落到页面状态里。
// 这样做可以保证“首次提交 / 消息通知 / 手动刷新任务状态”三条路径的行为一致。
const applyImportTaskSnapshot = async (task: ImportTaskData | null, options: { reloadList?: boolean } = {}) => {
  activeImportTask.value = task;
  if (!task) {
    cancelImportConfirmVisible.value = false;
    cancelRequestedImportTaskIds.clear();
    visibleImportNotificationTaskId.value = null;
    visibleImportNotificationSignature.value = "";
    suggestedImportResumeRow.value = 0;
    importResumeReminderDismissed.value = false;
    return;
  }

  const normalizedStatus = normalizeImportTaskStatus(task.status);
  if (normalizedStatus === "canceling") {
    cancelRequestedImportTaskIds.add(task.id);
  } else if (!["pending", "running"].includes(normalizedStatus)) {
    cancelRequestedImportTaskIds.delete(task.id);
  }

  if (task.resumeRow && ["partial", "failed"].includes(String(task.status))) {
    suggestedImportResumeRow.value = task.resumeRow;
    importForm.startRow = task.resumeRow;
    importResumeReminderDismissed.value = false;
  } else {
    suggestedImportResumeRow.value = 0;
  }

  if (options.reloadList && ["success", "partial", "canceled"].includes(String(task.status))) {
    await loadData(1);
  }
};

// 后端通过自定义事件推送导入任务进度时，会先把原始 detail 整理成前端统一结构，再刷新页面。
const handleCustomerImportTaskNotice = async (rawEvent: Event) => {
  const detail = (rawEvent as CustomEvent<CustomerImportTaskNoticeDetail>).detail;
  if (!detail?.batchId) {
    return;
  }

  const nextTask: ImportTaskData = {
    id: detail.batchId,
    status: detail.status,
    startRow: Number(detail.startRow || 2),
    resumeRow: detail.resumeRow,
    interrupted: Boolean(detail.interrupted),
    totalCount: Number(detail.totalCount || 0),
    processedCount: Number(detail.processedCount || 0),
    successCount: Number(detail.successCount || 0),
    failedCount: Number(detail.failedCount || 0),
    duplicateCount: Number(detail.duplicateCount || 0),
    progress: Number(detail.progress || 0),
    errorMessage: detail.errorMessage,
    fileName: detail.fileName,
    remark: detail.remark
  };

  await applyImportTaskSnapshot(nextTask, { reloadList: true });
};

// 页面初始化或用户重新进入列表页时，主动拿一次“最近导入任务”，
// 这样即使页面刷新了，也能继续看到上一次任务的进度和补传提示。
const loadLatestImportTask = async () => {
  try {
    const response = await getLatestSysCustomerImportBatch();
    if (!response.data) {
      activeImportTask.value = null;
      suggestedImportResumeRow.value = 0;
      importResumeReminderDismissed.value = false;
      return;
    }

    const latestTask: ImportTaskData = {
      id: response.data.id,
      status: response.data.status,
      startRow: response.data.startRow,
      resumeRow: response.data.resumeRow,
      interrupted: Boolean(response.data.interrupted),
      totalCount: Number(response.data.totalCount || 0),
      processedCount: Number(response.data.processedCount || 0),
      successCount: Number(response.data.successCount || 0),
      failedCount: Number(response.data.failedCount || 0),
      duplicateCount: Number(response.data.duplicateCount || 0),
      progress: Number(response.data.progress || 0),
      errorMessage: response.data.errorMessage,
      fileName: response.data.fileName,
      remark: response.data.remark
    };

    await applyImportTaskSnapshot(latestTask);
  } catch (error) {
    console.error("获取最新导入任务失败:", error);
  }
};

const openExportDialog = (options: { title: string; content: string; type?: "info" | "success" | "error" }) => {
  const modalConfig = {
    title: options.title,
    content: options.content,
    okText: "确定",
    hideCancel: true,
    closable: true
  };

  if (options.type === "error") {
    Modal.error(modalConfig);
    return;
  }

  if (options.type === "success") {
    Modal.success(modalConfig);
    return;
  }

  Modal.info(modalConfig);
};

const resolveExportErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const requestError = error as {
      message?: string;
      response?: {
        data?: {
          message?: string;
        };
      };
    };
    const serverMessage = requestError.response?.data?.message;
    if (serverMessage) {
      return serverMessage;
    }
    if (requestError.message) {
      return requestError.message;
    }
  }

  return "导出失败，请稍后重试。";
};

const handleExport = async () => {
  exporting.value = true;
  try {
    const params = buildCustomerListParams(searchForm, { pageNum: 1, pageSize: pageSize.value }, props.scene);
    const submitResult = await submitSysCustomerExport(params);
    if (submitResult.data.mode === "async") {
      const exportMessage = submitResult.data.message || "数据量较大，已转为异步导出，完成后会弹出下载提醒。";
      openExportDialog({
        title: submitResult.data.existing ? "导出任务提示" : "导出任务已提交",
        content: exportMessage,
        type: submitResult.data.existing ? "info" : "success"
      });
      return;
    }
    const response = await exportSysCustomerList(params);
    const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildCustomerExportDownloadName(props.scene, Number(submitResult.data.total || 0));
    link.click();
    window.URL.revokeObjectURL(url);
    openExportDialog({
      title: "导出完成",
      content: "导出文件已开始下载。",
      type: "success"
    });
  } catch (error) {
    console.error("导出客户失败:", error);
    openExportDialog({
      title: "导出失败",
      content: resolveExportErrorMessage(error),
      type: "error"
    });
  } finally {
    exporting.value = false;
  }
};

// 清空文件选择时，同时把原生 input 的值重置。
// 否则用户连续选同一个文件，change 事件可能不会再次触发。
const clearImportSelection = () => {
  importForm.file = null;
  if (importFileInputRef.value) {
    importFileInputRef.value.value = "";
  }
};

const handleDismissImportResumeReminder = () => {
  importResumeReminderDismissed.value = true;
};

// 打开导入弹窗前，先判断后台是否还有任务在跑。
// 如果还在跑，不允许再开新导入，而是直接把进度通知重新弹出来。
const openImportModal = () => {
  if (isImportTaskProcessing(activeImportTask.value)) {
    const task = activeImportTask.value;
    if (task?.id) {
      openImportProgressNotification(task, { force: true });
    }
    return;
  }

  importForm.channelCompanyId = searchForm.channelId ? Number(searchForm.channelId) : undefined;
  importForm.startRow = suggestedImportResumeRow.value > 1 ? suggestedImportResumeRow.value : 2;
  importForm.remark = "";
  clearImportSelection();
  importModalVisible.value = true;
};

// 取消导入弹窗时，只清空本次选择，不影响后台已经存在的导入任务。
const handleImportCancel = () => {
  importModalVisible.value = false;
  importForm.remark = "";
  clearImportSelection();
};

const triggerImportFileSelect = () => {
  importFileInputRef.value?.click();
};

// 这里只做最基础的文件校验：必须选文件，且后缀必须是 .xlsx。
// 更细的模板内容校验交给后端统一处理，避免前后规则不一致。
const handleImportFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0] ?? null;
  if (!file) {
    importForm.file = null;
    return;
  }

  if (!/\.xlsx$/i.test(file.name)) {
    Message.error("当前仅支持上传 .xlsx 文件");
    clearImportSelection();
    return;
  }

  importForm.file = file;
};

const buildCustomerImportDemoName = (scene?: CustomerListScene) => {
  return `${resolveExportSceneName(scene)}_客户导入模板.xlsx`;
};

// 下载模板时，前端直接生成一个 Excel：
// 1. “填写说明”工作表告诉用户怎么填
// 2. “客户导入模板”工作表给出标准表头和示例数据
const handleDownloadImportDemo = async () => {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.aoa_to_sheet([
    importTemplateHeaders,
    ["张三", "13800138000", 25, 3, 10, "有房有车，近 3 个月有资金需求", "男"]
  ]);
  worksheet["!cols"] = [{ wch: 16 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 36 }, { wch: 10 }];

  const guideSheet = XLSX.utils.aoa_to_sheet([
    ["说明项", "内容"],
    ["导入场景", currentImportSceneName.value],
    ["起始导入行", importResumeHint.value],
    ...importGuideItems.map((item, index) => [`说明 ${index + 1}`, item])
  ]);
  guideSheet["!cols"] = [{ wch: 14 }, { wch: 56 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, guideSheet, "填写说明");
  XLSX.utils.book_append_sheet(workbook, worksheet, "客户导入模板");
  XLSX.writeFile(workbook, buildCustomerImportDemoName(props.scene));
};

// 确认导入的完整流程：
// 1. 先校验必填项和文件
// 2. 再把表单转成 FormData 提交给后端
// 3. 提交成功后，立刻把本地任务状态切到“排队/处理中”，让用户马上看到反馈
const handleImportConfirm = async () => {
  if (isImportTaskProcessing(activeImportTask.value)) {
    if (activeImportTask.value?.id) {
      openImportProgressNotification(activeImportTask.value, { force: true });
    }
    return false;
  }

  if (!importForm.channelCompanyId) {
    Message.error("请选择导入渠道来源");
    return false;
  }
  if (!importForm.startRow || Number(importForm.startRow) < 2) {
    Message.error("导入起始行不能小于 2");
    return false;
  }
  if (!importForm.file) {
    Message.error("请先选择导入文件");
    return false;
  }

  importing.value = true;
  try {
    const trimmedImportRemark = importForm.remark.trim();
    const formData = new FormData();
    // scene 决定当前是“全部客户 / 我的客户 / 公共池”等哪个入口发起的导入。
    formData.append("scene", String(props.scene || "all"));
    formData.append("channelCompanyId", String(importForm.channelCompanyId));
    formData.append("startRow", String(importForm.startRow));
    if (trimmedImportRemark) {
      formData.append("remark", trimmedImportRemark);
    }
    formData.append("file", importForm.file);

    const result = await importSysCustomerFile(formData);
    const batchId = Number(result.data.batchId || 0);
    if (batchId > 0) {
      // 后端已经创建了导入批次，前端先用最基础的数据把任务挂到页面上，
      // 后续进度、成功数、失败数再通过查询或通知补齐。
      await applyImportTaskSnapshot({
        id: batchId,
        status: result.data.status || "pending",
        startRow: Number(importForm.startRow || 2),
        resumeRow: undefined,
        interrupted: false,
        totalCount: 0,
        processedCount: 0,
        successCount: 0,
        failedCount: 0,
        duplicateCount: 0,
        progress: 0,
        fileName: importForm.file.name,
        remark: trimmedImportRemark || undefined
      });
    } else if (result.data.existing) {
      // 如果后端返回“已有任务在执行”，说明这次没有新建批次，直接把已有任务状态重新加载出来。
      await loadLatestImportTask();
    }

    if (result.data.existing && !batchId && activeImportTask.value?.id) {
      openImportProgressNotification(activeImportTask.value, { force: true });
    }

    importModalVisible.value = false;
    importForm.remark = "";
    clearImportSelection();
    return true;
  } catch (error) {
    console.error("导入客户失败:", error);
    return false;
  } finally {
    importing.value = false;
  }
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
  Object.assign(searchForm, props.presetSearchForm);
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

const handleValidSave = async (formInstance?: { validate?: () => Promise<unknown> }) => {
  const isValid = await formInstance?.validate?.();
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
  const previousLockStatus = record.isLock;
  try {
    const newLockStatus = previousLockStatus === 1 ? 0 : 1;
    record.isLock = newLockStatus;
    await updateData({
      id: record.id,
      isLock: newLockStatus
    });
    if (selectedCustomerData.value?.id === record.id) {
      selectedCustomerData.value = {
        ...selectedCustomerData.value,
        isLock: newLockStatus
      };
    }
    if (newLockStatus === 1) {
      Message.success(`已锁定客户：${record.name}`);
    } else {
      Message.success(`已解锁客户：${record.name}`);
    }
  } catch (error) {
    record.isLock = previousLockStatus;
    console.error("切换锁定状态失败:", error);
    Message.error("切换锁定状态失败");
  }
};

// 加载渠道来源数据。客户列表当前沿用历史口径，channelId 实际保存的是渠道来源 ID。
const fetchChannelData = async () => {
  try {
    const params: SysChannelCompanyListParams = {
      pageNum: 1,
      pageSize: 1000 // 设置较大的页面大小以获取所有数据
    };

    const response = await getSysChannelCompanyList(params);

    if (response.data && Array.isArray(response.data.list)) {
      // 渠道来源列表展示 hiddenName，避免把底层 channel_id 暴露给业务同学。
      channelCompanyOptions.value = response.data.list.map((item: SysChannelCompanyData) => ({
        value: item.id,
        name: item.hiddenName
      }));
    }
  } catch (error) {
    console.error("获取渠道数据失败:", error);
    channelCompanyOptions.value = [];
  }
};

onMounted(async () => {
  window.addEventListener(customerImportTaskNoticeEventName, handleCustomerImportTaskNotice as EventListener);
  // 初始化加载数据
  await loadData();
  await loadLatestImportTask();
  // 加载渠道数据
  await fetchChannelData();
  // 加载部门树数据
  await getDepartmentTree();
  // 加载客户有效性标签数据
  await loadAllCustomerValidOptions();
  // 确保系统配置已加载
  await sysConfigStore.getConfig();
});

onBeforeUnmount(() => {
  window.removeEventListener(customerImportTaskNoticeEventName, handleCustomerImportTaskNotice as EventListener);
});
</script>

<style scoped lang="scss">
.customer-export-task-banner {
  margin-top: 12px;
}

.customer-import-action-button {
  position: relative;
  overflow: hidden;
  min-width: 112px;
}

.customer-import-action-button--progress {
  color: #fff !important;
  border-color: #2563eb !important;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.customer-import-action-button--progress::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--customer-import-progress, 0%);
  content: "";
  background: linear-gradient(90deg, #1e3a8a 0%, #0f766e 100%);
  transition: width 0.24s ease;
}

.customer-import-action-button--progress[disabled] {
  opacity: 1;
}

.customer-import-action-button__content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: inherit;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
}

.customer-import-action-button__icon {
  font-size: 14px;
}

.customer-import-action-button__icon--spin {
  animation: customer-import-action-spin 1s linear infinite;
}

@keyframes customer-import-action-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.customer-import-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customer-import-toolbar {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f7f8fa 0%, #fbfcfd 100%);
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e6eb;
}

.customer-import-toolbar-tip {
  font-size: 12px;
  line-height: 1.6;
  color: #86909c;
}

.customer-import-summary {
  margin-bottom: 0;
}

.customer-import-form {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e6eb;
}

.customer-import-input {
  display: none;
}

.customer-import-field {
  width: 100%;
}

.customer-import-field--stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-import-help-text {
  font-size: 12px;
  line-height: 1.7;
  color: #4e5969;
}

.customer-import-inline-context {
  display: inline-block;
  margin-left: 8px;
  color: #86909c;
}

.customer-import-file-card {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fff8e8 0%, #fffdf7 100%);
  border: 1px dashed #ffb65d;
  border-radius: 12px;
  transition:
    background 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease,
    transform 0.24s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 125, 0, 0.08);
}

.customer-import-file-card--idle {
  background: linear-gradient(135deg, #fff8e8 0%, #fffdf7 100%);
  border-color: #ffb65d;
  box-shadow: inset 0 0 0 1px rgba(255, 125, 0, 0.08);
}

.customer-import-file-card--ready {
  background: linear-gradient(135deg, #e8ffef 0%, #f3fffb 55%, #eef8ff 100%);
  border-color: #55c68a;
  box-shadow: inset 0 0 0 1px rgba(0, 180, 42, 0.12);
}

.customer-import-file-card-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.customer-import-file-card-title {
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.customer-import-file-card-desc {
  font-size: 12px;
  line-height: 1.7;
  color: #4e5969;
}

.customer-import-file-card--idle .customer-import-file-card-title {
  color: #8d4f12;
}

.customer-import-file-card--idle .customer-import-file-card-desc {
  color: #ad6800;
}

.customer-import-file-card--ready .customer-import-file-card-title {
  color: #0f6b46;
}

.customer-import-file-card--ready .customer-import-file-card-desc {
  color: #0f766e;
}

.customer-import-field-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.customer-import-field-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #0f3d91;
  background: rgba(22, 93, 255, 0.08);
  border-radius: 999px;
}

.customer-import-panel :deep(.arco-form-item-label-col > label) {
  font-size: 12px;
  font-weight: 600;
  color: #4e5969;
}

.customer-import-panel :deep(.arco-form-item-content-flex) {
  align-items: stretch;
}

.customer-import-panel :deep(.arco-select-view),
.customer-import-panel :deep(.arco-input-number),
.customer-import-panel :deep(.arco-textarea-wrapper) {
  min-height: 40px;
  border-color: #d9dee8;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.customer-import-panel :deep(.arco-select-view:hover),
.customer-import-panel :deep(.arco-input-number:hover),
.customer-import-panel :deep(.arco-textarea-wrapper:hover) {
  border-color: rgba(22, 93, 255, 0.4);
}

.customer-import-panel :deep(.arco-select-view.arco-select-view-focus),
.customer-import-panel :deep(.arco-input-number:focus-within),
.customer-import-panel :deep(.arco-textarea-wrapper:focus-within) {
  border-color: #165dff;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.12);
}

.customer-import-panel :deep(.arco-alert) {
  border-radius: 12px;
}

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
  .customer-import-toolbar,
  .customer-import-form {
    padding: 14px;
  }

  .customer-import-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .customer-import-inline-context {
    display: block;
    margin-top: 4px;
    margin-left: 0;
  }

  .customer-import-file-card {
    flex-direction: column;
    align-items: flex-start;
  }

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
