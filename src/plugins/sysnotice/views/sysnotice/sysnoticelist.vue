<template>
  <div class="snow-page">
    <div class="snow-inner">
      <a-card :loading="loading" :bordered="false" class="notice-card">
        <a-space wrap class="search-bar" :direction="isMobile ? 'vertical' : 'horizontal'" :size="isMobile ? 'small' : 'medium'" style="width: 100%">
          <a-input-search
            v-model="searchForm.title"
            placeholder="请输入通知标题搜索"
            :style="{ width: isMobile ? '100%' : '240px' }"
            @search="handleSearch"
            allow-clear
          />
          <a-select
            v-model="searchForm.type"
            placeholder="请选择通知类型"
            :style="{ width: isMobile ? '100%' : '200px' }"
            allow-clear
          >
            <a-option
              v-for="item in typeOption"
              :key="item.value"
              :value="Number(item.value)"
            >{{ item.name }}</a-option
            >
          </a-select>
          <a-select
            v-model="searchForm.level"
            placeholder="请选择通知等级"
            :style="{ width: isMobile ? '100%' : '180px' }"
            allow-clear
          >
            <a-option
              v-for="item in levelOption"
              :key="item.value"
              :value="item.value"
            >{{ item.name }}</a-option
            >
          </a-select>
          <a-select
            v-model="searchForm.publishStatus"
            placeholder="请选择发布状态"
            :style="{ width: isMobile ? '100%' : '150px' }"
            allow-clear
          >
            <a-option :value="0">草稿</a-option>
            <a-option :value="1">已发布</a-option>
            <a-option :value="-1">已撤回</a-option>
          </a-select>
          <a-range-picker
            v-model="searchForm.publishTimeRange"
            :style="{ width: isMobile ? '100%' : '260px' }"
            @change="handleSearch"
          />
          <a-button type="primary" @click="handleSearch" :style="{ width: isMobile ? '100%' : 'auto' }">查询</a-button>
          <a-button @click="handleReset" :style="{ width: isMobile ? '100%' : 'auto' }">重置</a-button>
          <a-button
            type="primary"
            @click="handleCreate"
            v-hasPerm="['plugins:sysnoticesysnotice:add']"
            :style="{ width: isMobile ? '100%' : 'auto' }"
          >
            <template #icon><icon-plus /></template>
            <span v-if="!isMobile">新增通知</span>
            <span v-else>新增</span>
          </a-button>
        </a-space>

        <a-table
          :data="dataList"
          :loading="loading"
          :pagination="paginationConfig"
          :bordered="{ wrapper: true, cell: true }"
          :scroll="{ x: isMobile ? '100%' : '120%' }"
          :columns-hidden="isMobile ? ['publisher', 'recipientCount'] : []"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
          class="notice-table"
          :size="isMobile ? 'small' : 'medium'"
        >
          <template #columns>
            <a-table-column
              title="通知标题"
              data-index="title"
              :width="200"
              ellipsis
              tooltip
            />
            <a-table-column title="通知类型" data-index="type" :width="100">
              <template #cell="{ record }">
                {{ getDictLabel(typeOption, record.type) }}
              </template>
            </a-table-column>
            <a-table-column title="通知等级" data-index="level" :width="80">
              <template #cell="{ record }">
                <a-tag :color="getLevelColor(record.level)">{{
                    getDictLabel(levelOption, record.level)
                  }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column
              title="发布状态"
              data-index="publishStatus"
              :width="80"
            >
              <template #cell="{ record }">
                <a-tag v-if="record.publishStatus === 0" color="gray">草稿</a-tag>
                <a-tag v-else-if="record.publishStatus === 1" color="green"
                >已发布</a-tag
                >
                <a-tag v-else color="red">已撤回</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="发布人" data-index="publisher" :width="80">
              <template #cell="{ record }">
                {{ getPublisherName(record.publisher) }}
              </template>
            </a-table-column>
            <a-table-column
              title="接收人数"
              data-index="recipientCount"
              :width="100"
            />
            <a-table-column title="未读数" data-index="unreadCount" :width="100" />
            <a-table-column title="发布时间" data-index="publishTime" :width="180">
              <template #cell="{ record }">
                {{ record.publishTime ? formatTime(record.publishTime) : '-' }}
              </template>
            </a-table-column>
            <a-table-column :title="'操作'" :width="200" :fixed="isMobile ? '' : 'right'">
              <template #cell="{ record }">
                <a-space>
                  <a-button size="small" @click="handleView(record)">查看</a-button>
                  <a-button
                    v-if="record.publishStatus != 1"
                    size="small"
                    type="primary"
                    @click="handlePublish(record.id)"
                    v-hasPerm="['plugins:sysnoticesysnotice:publish']"
                  >发布</a-button
                  >
                  <a-button
                    v-if="record.publishStatus === 1"
                    size="small"
                    status="warning"
                    @click="handleRevoke(record.id)"
                    v-hasPerm="['plugins:sysnoticesysnotice:revoke']"
                  >撤回</a-button
                  >
                  <a-button
                    v-if="record.publishStatus != 1"
                    size="small"
                    @click="handleEdit(record)"
                    v-hasPerm="['plugins:sysnoticesysnotice:edit']"
                  >编辑</a-button
                  >
                  <a-popconfirm
                    content="确定要删除这条数据吗？"
                    @ok="handleDelete(record.id)"
                  >
                    <a-button
                      size="small"
                      status="danger"
                      v-hasPerm="['plugins:sysnoticesysnotice:delete']"
                    >删除</a-button
                    >
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
        :title="modalTitle"
        :on-before-ok="handleSave"
        @cancel="handleCancel"
        :width="isMobile ? '95vw' : '1000px'"
        :body-style="{ padding: 0, maxHeight: isMobile ? 'calc(100vh - 144px)' : '78vh', overflowY: 'auto' }"
        :mask-closable="false"
        :unmount-on-close="true"
        :ok-text="editingData.publishNow ? '立即发布' : '保存为草稿' "
        class="crm-modal notice-editor-modal"
      >
        <div class="modal-form-container">
          <div class="modal-banner">
            <div class="modal-banner__content">
              <div class="modal-banner__eyebrow">NOTICE WORKSPACE</div>
              <div class="modal-banner__title">{{ modalTitle }}</div>
              <div class="modal-banner__desc">
                {{ modalDescription }}
              </div>
            </div>
            <div class="modal-banner__meta">
              <span class="meta-pill">{{ getTargetTypeLabel(editingData.targetType) }}</span>
              <span class="meta-pill meta-pill--accent">
                {{ editingData.publishNow ? '保存后立即发布' : '先保存为草稿' }}
              </span>
            </div>
          </div>
          <a-form
            :model="editingData"
            :rules="rules"
            ref="formRef"
            layout="vertical"
            class="notice-form"
          >
            <div class="form-layout">
              <div class="form-layout__main">
                <div class="form-section form-section--card">
                  <div class="section-header">
                    <div class="section-header__icon">
                      <icon-file />
                    </div>
                    <div class="section-header__body">
                      <span class="section-header__title">基本信息</span>
                    </div>
                  </div>
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <a-form-item field="title" label="通知标题" required>
                        <a-input
                          v-model="editingData.title"
                          placeholder="请输入通知标题"
                          :max-length="100"
                          show-word-limit
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="isMobile ? 12 : 24">
                    <a-col :span="isMobile ? 24 : 12">
                      <a-form-item field="type" label="通知类型" required>
                        <a-select v-model="editingData.type" placeholder="请选择通知类型">
                          <a-option
                            v-for="item in typeOption"
                            :key="item.value"
                            :value="Number(item.value)"
                          >{{ item.name }}</a-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="isMobile ? 24 : 12">
                      <a-form-item field="level" label="通知等级" required>
                        <a-select v-model="editingData.level" placeholder="请选择通知等级">
                          <a-option
                            v-for="item in levelOption"
                            :key="item.value"
                            :value="item.value"
                          >{{ item.name }}</a-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>

                <div class="form-section form-section--card">
                  <div class="section-header">
                    <div class="section-header__icon">
                      <icon-edit />
                    </div>
                    <div class="section-header__body">
                      <span class="section-header__title">通知内容</span>
                    </div>
                  </div>
                  <div class="editor-wrapper">
                    <QuillEditor
                      :key="editorRenderKey"
                      :content="editingData.content"
                      contentType="html"
                      theme="snow"
                      :toolbar="editorToolbar"
                      :options="editorOptions"
                      @update:content="editingData.content = $event"
                    />
                  </div>
                </div>
              </div>

              <div class="form-layout__aside">
                <div class="form-section form-section--card">
                  <div class="section-header">
                    <div class="section-header__icon">
                      <icon-user-group />
                    </div>
                    <div class="section-header__body">
                      <span class="section-header__title">通知对象</span>
                    </div>
                  </div>
                  <a-radio-group
                    v-model="editingData.targetType"
                    @change="handleTargetTypeChange"
                    class="target-radio-group"
                  >
                    <a-radio :value="1">全体用户</a-radio>
                    <a-radio :value="2">指定用户</a-radio>
                    <a-radio :value="3">部门</a-radio>
                    <a-radio :value="4">角色</a-radio>
                  </a-radio-group>

                  <template v-if="editingData.targetType === 2">
                    <a-form-item field="userIds" label="选择用户" required>
                      <a-select
                        v-model="editingData.userIds"
                        placeholder="请选择用户：支持多选，可搜索"
                        multiple
                        allow-clear
                        :loading="userLoading"
                        :filter-option="filterUserOption"
                        show-search
                        popup-container="body"
                        style="width: 100%"
                      >
                        <a-option
                          v-for="user in userList"
                          :key="user.id"
                          :value="user.id"
                          :label="user.nickName"
                        >
                          <div class="user-option">
                            <span class="username">{{ user.nickName }}</span>
                            <span class="real-name" v-if="user.realName">({{ user.realName }})</span>
                          </div>
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </template>

                  <template v-if="editingData.targetType === 3">
                    <a-form-item field="deptId" label="选择部门" required>
                      <div class="target-field-stack">
                        <a-tree-select
                          v-model="editingData.deptId"
                          :data="deptList"
                          :field-names="{ key: 'id', title: 'name', children: 'children' }"
                          placeholder="请选择部门"
                          allow-clear
                          popup-container="body"
                          style="width: 100%"
                        />
                        <a-checkbox v-model="editingData.includeChildren" class="sub-option-checkbox">
                          包含下级部门
                        </a-checkbox>
                      </div>
                    </a-form-item>
                  </template>

                  <template v-if="editingData.targetType === 4">
                    <a-form-item field="roleIds" label="选择角色" required>
                      <a-select
                        v-model="editingData.roleIds"
                        placeholder="请选择角色"
                        multiple
                        allow-clear
                        popup-container="body"
                        style="width: 100%"
                      >
                        <a-option
                          v-for="role in flatRoleList"
                          :key="role.id"
                          :value="role.id"
                        >{{ role.name }}</a-option
                        >
                      </a-select>
                    </a-form-item>
                  </template>
                </div>

                <div class="form-section form-section--card">
                  <div class="section-header">
                    <div class="section-header__icon">
                      <icon-settings />
                    </div>
                    <div class="section-header__body">
                      <span class="section-header__title">发布设置</span>
                      <span class="section-header__desc">保存时可以直接发布，也可以先以草稿形式留待复核。</span>
                    </div>
                  </div>
                  <a-form-item>
                    <a-checkbox v-model="editingData.publishNow">
                      立即发布通知
                      <a-tooltip content="勾选后，通知将立即发布给所选对象">
                        <icon-question-circle class="help-icon" />
                      </a-tooltip>
                    </a-checkbox>
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-form>
        </div>
      </a-modal>

      <!-- 查看详情弹窗  -->
      <a-modal
        v-model:visible="viewVisible"
        title="通知详情"
        :footer="false"
        :closable="false"
        :width="isMobile ? '95vw' : '780px'"
        :body-style="{ padding: 0, overflow: 'hidden' }"
        :unmount-on-close="true"
        class="crm-modal notice-detail-modal"
      >
        <div class="notice-detail">
          <div class="notice-detail__hero">
            <button class="notice-detail__close" type="button" @click="viewVisible = false">
              <icon-close />
            </button>

            <div class="notice-detail__badge">
              <span class="notice-detail__badge-icon">
                <icon-notification />
              </span>
              <span class="notice-detail__badge-text">{{ detailTypeLabel }}</span>
            </div>

            <h3 class="notice-detail__title">{{ viewData.title || "通知详情" }}</h3>

            <div class="notice-detail__meta">
              <span class="notice-detail__meta-item">
                <icon-clock-circle />
                <span>{{ detailPublishMeta }}</span>
              </span>
              <span class="notice-detail__meta-item">
                <icon-eye />
                <span>{{ detailStatusMeta }}</span>
              </span>
            </div>

            <div class="notice-detail__tags">
              <span class="notice-detail__tag">发布人 {{ getPublisherName(viewData.publisher) }}</span>
              <span class="notice-detail__tag notice-detail__tag--level" :style="detailLevelTagStyle">等级 {{ detailLevelLabel }}</span>
              <span class="notice-detail__tag">接收人数 {{ viewData.recipientCount || 0 }}</span>
              <span class="notice-detail__tag">未读数 {{ viewData.unreadCount || 0 }}</span>
            </div>
          </div>
          <div class="notice-detail__body notice-detail__body--stacked">
            <div class="notice-detail__content-card">
              <span class="notice-detail__content-accent" />
              <div :class="['notice-detail__content', { 'notice-detail__content--scrollable': detailHtmlVisible }]">
                <div v-if="detailHtmlVisible" class="notice-detail__html notice-detail__html--scrollable" v-html="detailContentHtml" />
                <ul v-else-if="detailTextLines.length" class="notice-detail__list">
                  <li v-for="(line, index) in detailTextLines" :key="`${viewData.id || 'detail'}-${index}`">
                    {{ line }}
                  </li>
                </ul>
                <div v-else class="notice-detail__empty">暂无通知内容</div>
              </div>
            </div>
          </div>
          <div class="notice-detail__footer">
            <div class="notice-detail__footer-tip">
              <icon-file />
              <span></span>
            </div>
            <a-button class="notice-detail__footer-btn" @click="viewVisible = false">关闭</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useSysNoticePluginHook } from '../../hooks/sysnotice'
import type { SysNoticeData } from '../../api/sysnotice'
import { formatTime, dictFilter } from '@/globals'
import { Message } from '@arco-design/web-vue'
import { getRolesAPI, type RoleItem } from '@/api/role'
import { getDivisionAPI, type DivisionItem } from '@/api/department'
import { getAccountListAPI, type AccountItem } from '@/api/user'
import { extractNoticePlainText, formatRelativeTime, getNoticeLevelTheme } from '@/utils/notice-tools'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// 字典数据
const typeOption = ref(dictFilter('noticeType'))
const levelOption = ref(dictFilter('noticeLevel'))
const isMobile = ref(false)

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const handleResize = () => {
  checkMobile()
}

// 角色、部门、用户数据
const roleList = ref<RoleItem[]>([])
const deptList = ref<DivisionItem[]>([])
type NoticeUserItem = AccountItem & { realName?: string; username?: string }
const userList = ref<NoticeUserItem[]>([])
const userLoading = ref(false)

// 富文本编辑器配置
const editorToolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  ['link'],
  ['clean']
]

const editorOptions = {
  placeholder: '请输入通知内容...',
  theme: 'snow'
}

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
  publishData,
  revokeData,
  resetSearchParams
} = useSysNoticePluginHook()

const modalVisible = ref(false)
const viewVisible = ref(false)
const formRef = ref()
const editorRenderKey = ref(0)

// 搜索表单
const searchForm = reactive({
  title: '',
  type: undefined as number | undefined,
  level: '',
  publishStatus: undefined as number | undefined,
  publishTimeRange: [] as string[]
})

// 编辑数据
const editingData = reactive({
  id: undefined as number | undefined,
  title: '',
  content: '',
  type: undefined as number | undefined,
  level: '',
  targetType: 1,
  deptId: undefined as number | undefined,
  roleIds: [] as number[],
  userIds: [] as number[],
  includeChildren: false,
  publishNow: false
})

const viewData = ref<Partial<SysNoticeData & { targets?: any[] }>>({})
const detailTypeLabel = computed(() => String(getDictLabel(typeOption.value, viewData.value.type) || '通知'))
const detailLevelLabel = computed(() => String(getDictLabel(levelOption.value, viewData.value.level) || '普通'))
const detailStatusLabel = computed(() => getPublishStatusLabel(viewData.value.publishStatus))
const detailContentHtml = computed(() => viewData.value.content?.trim() || '')
const detailContentText = computed(() => extractNoticePlainText(detailContentHtml.value))
const detailHtmlVisible = computed(() => /<\/?[a-z][\s\S]*>/i.test(detailContentHtml.value) && Boolean(detailContentText.value))
const detailTextLines = computed(() =>
  detailHtmlVisible.value
    ? []
    : detailContentText.value
        .split(/\r?\n+/)
        .map(line => line.replace(/^[\s\-*\u2022]+/, '').trim())
        .filter(Boolean)
)
const detailPublishMeta = computed(() => {
  const publishTime = viewData.value.publishTime || viewData.value.createdAt
  if (!publishTime) {
    return '发布时间未记录'
  }

  const relative = formatRelativeTime(publishTime)
  const absolute = formatTime(publishTime)
  return relative ? `${relative} / ${absolute}` : absolute
})
const detailStatusMeta = computed(() => {
  const statusLabel = detailStatusLabel.value
  const publishTime = viewData.value.publishTime || viewData.value.createdAt
  if (!publishTime) {
    return statusLabel
  }

  const absolute = formatTime(publishTime)
  return statusLabel ? `${statusLabel} / ${absolute}` : absolute
})
const detailLevelTagStyle = computed(() => {
  const theme = getNoticeLevelTheme(viewData.value.level)
  return {
    '--notice-level-text': theme.textColor,
    '--notice-level-bg': theme.backgroundColor,
    '--notice-level-border': theme.borderColor,
    '--notice-level-accent': theme.accentColor
  }
})
const createDefaultEditingData = () => ({
  id: undefined as number | undefined,
  title: '',
  content: '',
  type: undefined as number | undefined,
  level: '',
  targetType: 1,
  deptId: undefined as number | undefined,
  roleIds: [] as number[],
  userIds: [] as number[],
  includeChildren: false,
  publishNow: false
})

// 检查富文本内容是否为空
const isContentEmpty = (html: string) => {
  if (!html) return true
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length === 0
}

const getTargetTypeLabel = (targetType?: number) => {
  const map: Record<number, string> = {
    1: '全体用户',
    2: '指定用户',
    3: '部门通知',
    4: '角色通知'
  }
  return targetType ? map[targetType] || '未选择' : '未选择'
}

const getPublishStatusLabel = (status?: number) => {
  const map: Record<number, string> = {
    0: '草稿',
    1: '已发布',
    [-1]: '已撤回'
  }
  return status === undefined ? '-' : map[status] || '-'
}

const getPublishStatusColor = (status?: number) => {
  const map: Record<number, string> = {
    0: 'gray',
    1: 'green',
    [-1]: 'red'
  }
  return status === undefined ? 'gray' : map[status] || 'gray'
}

const modalTitle = computed(() => (editingData.id ? '编辑通知' : '新增通知'))

const modalDescription = computed(() =>
  editingData.id
    ? '更新通知信息、调整投放范围，并决定是否重新发布。'
    : '创建一条新的业务通知，配置接收对象后可保存为草稿或直接发布。'
)

// 表单校验规则
const rules = {
  title: [{ required: true, message: '通知标题不能为空' }],
  content: [
    {
      required: true,
      message: '通知内容不能为空',
      validator: (value: string) => !isContentEmpty(value)
    }
  ],
  type: [{ required: true, message: '通知类型不能为空' }],
  level: [{ required: true, message: '通知等级不能为空' }],
  targetType: [{ required: true, message: '通知对象类型不能为空' }],
  userIds: [
    {
      required: true,
      message: '请选择指定用户',
      validator: (value: number[]) => {
        if (editingData.targetType === 2 && (!value || value.length === 0)) {
          return false
        }
        return true
      }
    }
  ],
  deptId: [
    {
      required: true,
      message: '请选择部门',
      validator: () => {
        if (editingData.targetType === 3 && !editingData.deptId) {
          return false
        }
        return true
      }
    }
  ],
  roleIds: [
    {
      required: true,
      message: '请选择角色',
      validator: (value: number[]) => {
        if (editingData.targetType === 4 && (!value || value.length === 0)) {
          return false
        }
        return true
      }
    }
  ]
}

// 扁平化角色列表
const flatRoleList = computed(() => {
  const flatten = (roles: RoleItem[]): RoleItem[] => {
    return roles.reduce((acc, role) => {
      acc.push(role)
      if (role.children?.length) {
        acc.push(...flatten(role.children))
      }
      return acc
    }, [] as RoleItem[])
  }
  return flatten(roleList.value)
})

// 分页配置
const paginationConfig = computed(() => ({
  total: total.value,
  current: currentPage.value,
  pageSize: pageSize.value,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 30, 50]
}))

// 辅助函数
const getDictLabel = (options: any[], value: any) => {
  const item = options.find(opt => opt.value == value)
  return item?.name || value
}

const getLevelColor = (level?: string) => {
  const colors: any = { L: 'blue', M: 'orange', H: 'red' }
  if (!level) return 'gray'
  return colors[level] || 'gray'
}

const getPublisherName = (publisher?: { nickName?: string; userName?: string; username?: string }) => {
  return publisher?.nickName || publisher?.userName || publisher?.username || '-'
}

// 用户搜索过滤
const filterUserOption = (inputValue: string, option: any) => {
  const user = userList.value.find(u => u.id === option.value)
  if (!user) return false
  const keyword = inputValue.toLowerCase()
  return [user.nickName, user.userName, user.realName]
    .filter(Boolean)
    .some(value => String(value).toLowerCase().includes(keyword))
}

// 格式化通知对象摘要（用于详情展示）
const formatTargetsSummary = (targets: any[]) => {
  if (!targets || targets.length === 0) return []
  return targets.map(target => {
    switch (target.targetType) {
      case 1:
        return '全体用户'
      case 2:
        const user = userList.value.find(u => u.id === target.targetId)
        return `用户：${user?.nickName || user?.userName || user?.username || target.targetId}`
      case 3:
        const dept = findDeptById(deptList.value, target.targetId)
        return `部门：${dept?.name || target.targetId}${target.includeChildren ? '（含下级）' : ''}`
      case 4:
        const role = flatRoleList.value.find(r => r.id === target.targetId)
        return `角色：${role?.name || target.targetId}`
      default:
        return `类型${target.targetType}：${target.targetId}`
    }
  })
}

// 递归查找部门
const findDeptById = (list: DivisionItem[], id: number): DivisionItem | undefined => {
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const found = findDeptById(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

// 解析 targets 为表单数据
const parseTargetsToForm = (targets: any[]) => {
  if (!targets || targets.length === 0) {
    editingData.targetType = 1
    editingData.deptId = undefined
    editingData.roleIds = []
    editingData.userIds = []
    editingData.includeChildren = false
    return
  }

  const firstTarget = targets[0]
  editingData.targetType = firstTarget.targetType

  switch (firstTarget.targetType) {
    case 1:
      // 全体用户，无需额外处理
      editingData.deptId = undefined
      editingData.roleIds = []
      editingData.userIds = []
      editingData.includeChildren = false
      break
    case 2:
      // 指定用户，收集所有用户ID
      editingData.userIds = targets.map(t => t.targetId)
      editingData.deptId = undefined
      editingData.roleIds = []
      editingData.includeChildren = false
      break
    case 3:
      // 部门（理论上只有一个部门，但支持多个？按业务通常一个部门）
      editingData.deptId = firstTarget.targetId
      editingData.includeChildren = firstTarget.includeChildren || false
      editingData.roleIds = []
      editingData.userIds = []
      break
    case 4:
      // 角色，收集所有角色ID
      editingData.roleIds = targets.map(t => t.targetId)
      editingData.deptId = undefined
      editingData.userIds = []
      editingData.includeChildren = false
      break
  }
}

// 加载数据
const loadData = async (pageNum: number = currentPage.value, pageSizeVal: number = pageSize.value) => {
  const params: any = { pageNum, pageSize: pageSizeVal }
  if (searchForm.title) params.title = searchForm.title
  if (searchForm.type !== undefined) params.type = searchForm.type
  if (searchForm.level) params.level = searchForm.level
  if (searchForm.publishStatus !== undefined) params.publishStatus = searchForm.publishStatus
  if (searchForm.publishTimeRange?.length === 2) params.publishTime = searchForm.publishTimeRange
  await fetchDataList(params)
}

const handlePageChange = (page: number) => loadData(page, pageSize.value)
const handlePageSizeChange = (size: number) => loadData(1, size)
const handleSearch = () => loadData(1)

const handleReset = () => {
  Object.assign(searchForm, {
    title: '',
    type: undefined,
    level: '',
    publishStatus: undefined,
    publishTimeRange: []
  })
  resetSearchParams()
  loadData(1)
}

const handleTargetTypeChange = () => {
  // 切换类型时清空对应的字段
  editingData.deptId = undefined
  editingData.roleIds = []
  editingData.userIds = []
  editingData.includeChildren = false
}

const resetEditingForm = () => {
  Object.assign(editingData, createDefaultEditingData())
  editorRenderKey.value += 1
  formRef.value?.clearValidate?.()
}

const prepareEditingForm = async () => {
  editorRenderKey.value += 1
  await nextTick()
  formRef.value?.clearValidate?.()
}

const handleCreate = async () => {
  resetEditingForm()
  modalVisible.value = true
  await prepareEditingForm()
}

const handleEdit = async (record: SysNoticeData) => {
  resetEditingForm()
  const detail = await getDetail(record.id)
  const data = detail.data
  // 填充基本信息
  editingData.id = data.id
  editingData.title = data.title
  editingData.content = data.content
  editingData.type = data.type
  editingData.level = data.level
  editingData.publishNow = false // 编辑时默认不立即发布，保持原有状态

  // 解析 targets
  if (data.targets) {
    parseTargetsToForm(data.targets)
  } else {
    editingData.targetType = 1
    editingData.deptId = undefined
    editingData.roleIds = []
    editingData.userIds = []
    editingData.includeChildren = false
  }

  modalVisible.value = true
  await prepareEditingForm()
}

const handleView = async (record: SysNoticeData) => {
  const detail = await getDetail(record.id)
  viewData.value = detail.data
  viewVisible.value = true
}

const handlePublish = async (id: number) => {
  try {
    await publishData(id)
    Message.success('发布成功')
    await loadData()
  } catch {
    // Message.error('发布失败')
  }
}

const handleRevoke = async (id: number) => {
  try {
    await revokeData(id)
    Message.success('撤回成功')
    await loadData()
  } catch {
    // Message.error('撤回失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteData(id)
    Message.success('删除成功')
    await loadData()
  } catch {
    // Message.error('删除失败')
  }
}

const handleSave = async () => {
  const isValid = await formRef.value?.validate()
  if (isValid) return false

  try {
    const dataToSave: any = {
      id: editingData.id,
      title: editingData.title,
      content: editingData.content.trim(),
      type: editingData.type,
      level: editingData.level,
      publishNow: editingData.publishNow,
      targets: []
    }

    // 构建 targets
    if (editingData.targetType === 1) {
      dataToSave.targets.push({ targetType: 1, targetId: 0, includeChildren: false })
    } else if (editingData.targetType === 2 && editingData.userIds?.length) {
      editingData.userIds.forEach((userId: number) => {
        dataToSave.targets.push({ targetType: 2, targetId: userId, includeChildren: false })
      })
    } else if (editingData.targetType === 3 && editingData.deptId) {
      dataToSave.targets.push({
        targetType: 3,
        targetId: editingData.deptId,
        includeChildren: editingData.includeChildren
      })
    } else if (editingData.targetType === 4 && editingData.roleIds?.length) {
      editingData.roleIds.forEach((roleId: number) => {
        dataToSave.targets.push({ targetType: 4, targetId: roleId, includeChildren: false })
      })
    } else {
      Message.warning('请完整填写通知对象信息')
      return false
    }

    if (editingData.id) {
      await updateData(dataToSave)
      Message.success('更新成功')
    } else {
      await createData(dataToSave)
      Message.success('创建成功')
    }
    await loadData()
    modalVisible.value = false
  } catch {
    return false
  }
  return true
}

const handleCancel = () => {
  modalVisible.value = false
}

watch(modalVisible, visible => {
  if (!visible) {
    resetEditingForm()
  }
})

watch(viewVisible, visible => {
  if (!visible) {
    viewData.value = {}
  }
})

// 加载角色、部门、用户数据
const loadRolesAndDepts = async () => {
  try {
    const [rolesRes, deptsRes] = await Promise.all([getRolesAPI(), getDivisionAPI()])
    if (rolesRes.data?.list) roleList.value = rolesRes.data.list
    if (deptsRes.data?.list) deptList.value = deptsRes.data.list
  } catch (error) {
    console.error('加载角色和部门数据失败', error)
  }
}

const loadUsers = async () => {
  userLoading.value = true
  try {
    const res = await getAccountListAPI({ pageNum: 1, pageSize: 1000 }) // 获取所有用户用于选择
    if (res.data?.list) {
      userList.value = res.data.list
    }
  } catch (error) {
    console.error('加载用户列表失败', error)
  } finally {
    userLoading.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
  loadData()
  loadRolesAndDepts()
  loadUsers()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 整体卡片样式 */
.notice-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-bar {
  margin-bottom: 20px;
}

/* 表格样式优化 */
.notice-table :deep(.arco-table-th) {
  background-color: #f7f8fa;
  font-weight: 500;
}

/* 弹窗样式 - CRM风格 */
.crm-modal :deep(.arco-modal) {
  border-radius: 18px;
  overflow: hidden;
}

.notice-detail-modal :deep(.arco-modal) {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  margin: 24px auto;
  border-radius: 22px;
  overflow: hidden;
}

.notice-detail-modal :deep(.arco-modal-content) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: inherit;
  overflow: hidden;
}

.crm-modal :deep(.arco-modal-header) {
  border-bottom: 1px solid #e5e6eb;
  padding: 20px 24px;
  background: #fff;
}

.crm-modal :deep(.arco-modal-header .arco-modal-title) {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.crm-modal :deep(.arco-modal-footer) {
  border-top: 1px solid #e5e6eb;
  padding: 16px 24px;
  background: #fff;
}

.notice-detail-modal :deep(.arco-modal-header) {
  display: none;
}

.modal-form-container {
  background: linear-gradient(180deg, #f5f8ff 0%, #eef2f9 100%);
}

.modal-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid rgba(229, 230, 235, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f7faff 58%, #eef4ff 100%);
}

.modal-banner__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-banner__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #4080ff;
}

.modal-banner__title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  color: #1d2129;
}

.modal-banner__desc {
  max-width: 560px;
  font-size: 13px;
  line-height: 1.7;
  color: #4e5969;
}

.modal-banner__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid #d9e6ff;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 600;
  color: #165dff;
}

.meta-pill--accent {
  border-color: #c7e7d1;
  color: #00a870;
}

.form-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
  padding: 24px;
}

.form-layout__main,
.form-layout__aside,
.detail-panels {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 表单分区样式 */
.form-section {
  margin-bottom: 0;
}

.form-section--card,
.detail-panel {
  padding: 20px;
  border: 1px solid #e5e6eb;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 32px rgba(15, 35, 95, 0.08);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.section-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8f3ff 0%, #f5f9ff 100%);
  color: #165dff;
  flex-shrink: 0;
}

.section-header__icon .arco-icon {
  font-size: 18px;
}

.section-header__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-header__title {
  font-size: 16px;
  font-weight: 700;
  color: #1d2129;
}

.section-header__desc {
  font-size: 12px;
  line-height: 1.6;
  color: #86909c;
}

.help-icon {
  font-size: 14px;
  color: #86909c;
  cursor: help;
  margin-left: 4px;
}

/* 编辑器样式优化 */
.editor-wrapper {
  width: 100%;
  height: 360px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #d9e2f2;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.editor-wrapper:hover {
  border-color: #94bfff;
  box-shadow: 0 10px 24px rgba(22, 93, 255, 0.08);
}

.editor-wrapper :deep(.ql-toolbar) {
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
  border: none;
  border-bottom: 1px solid #e5e6eb;
  padding: 10px 12px;
}

.editor-wrapper :deep(.ql-container) {
  height: calc(360px - 42px);
  border: none;
  font-family: inherit;
}

.editor-wrapper :deep(.ql-editor) {
  min-height: calc(360px - 42px);
  font-size: 14px;
  line-height: 1.6;
}

/* 表单样式增强 */
.notice-form :deep(.arco-form-item-label-col > label) {
  font-weight: 600;
  color: #1d2129;
}

.notice-form :deep(.arco-input-wrapper),
.notice-form :deep(.arco-select-view),
.notice-form :deep(.arco-textarea-wrapper) {
  border-radius: 10px;
  background: #fff;
}

.notice-form :deep(.arco-input-wrapper:hover),
.notice-form :deep(.arco-select-view:hover),
.notice-form :deep(.arco-textarea-wrapper:hover) {
  border-color: #94bfff;
}

.notice-form :deep(.arco-input-wrapper:focus-within),
.notice-form :deep(.arco-select-view-focus),
.notice-form :deep(.arco-textarea-focus) {
  border-color: #165dff;
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
}

.target-radio-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  width: 100%;
}

.target-radio-group :deep(.arco-radio) {
  display: block;
  margin-right: 0;
}

.target-radio-group :deep(.arco-radio-icon) {
  display: none;
}

.target-radio-group :deep(.arco-radio-label) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  padding: 10px 12px;
  border: 1px solid #e5e6eb;
  border-radius: 14px;
  background: #f7f8fa;
  font-size: 13px;
  font-weight: 600;
  color: #1d2129;
  transition: all 0.2s ease;
}

.target-radio-group :deep(.arco-radio:hover .arco-radio-label) {
  background: #fff;
  border-color: #94bfff;
}

.target-radio-group :deep(.arco-radio-checked .arco-radio-label) {
  border-color: #165dff;
  background: linear-gradient(135deg, #eff4ff 0%, #f8fbff 100%);
  color: #165dff;
  box-shadow: 0 10px 24px rgba(22, 93, 255, 0.12);
}

.target-field-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub-option-checkbox {
  display: flex;
  width: 100%;
  margin-top: 0;
}

/* 用户选项样式 */
.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-option .username {
  font-weight: 500;
}

.user-option .real-name {
  font-size: 12px;
  color: #86909c;
}


/* 详情弹窗样式 */
.notice-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: inherit;
  background:
    radial-gradient(circle at top right, rgba(64, 128, 255, 0.14), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.notice-detail__hero {
  position: relative;
  padding: 24px 30px 22px;
  border-bottom: 1px solid #edf1f7;
  background: linear-gradient(120deg, rgba(240, 245, 255, 0.88) 0%, rgba(255, 255, 255, 0.98) 45%, rgba(235, 242, 255, 0.92) 100%);
}

.notice-detail__close {
  position: absolute;
  top: 18px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
  color: #6b778c;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(31, 56, 112, 0.08);
  transition: all 0.2s ease;
}

.notice-detail__close:hover {
  color: #1d2129;
  transform: translateY(-1px);
}

.notice-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.notice-detail__badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f65f5 0%, #6788ff 100%);
  color: #fff;
  box-shadow: 0 14px 30px rgba(47, 101, 245, 0.28);
}

.notice-detail__badge-text {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(64, 128, 255, 0.12);
  font-size: 13px;
  font-weight: 600;
  color: #2457d6;
}

.notice-detail__title {
  max-width: calc(100% - 64px);
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  color: #1d2129;
  word-break: break-word;
}

.notice-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.notice-detail__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4e5969;
}

.notice-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.notice-detail__tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #e5eaf5;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  color: #4e5969;
  transition: all 0.2s ease;
}

.notice-detail__tag--level {
  border-color: var(--notice-level-border, #d9dee8);
  background: var(--notice-level-bg, rgba(255, 255, 255, 0.88));
  color: var(--notice-level-text, #4e5969);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
}

.notice-detail__tag--level::before {
  content: "";
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--notice-level-accent, #86909c);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--notice-level-accent, #86909c) 16%, white);
}

.notice-detail__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 10px 30px;
}

.notice-detail__body--stacked {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.notice-detail__content-card {
  display: flex;
  align-items: stretch;
  gap: 24px;
  padding: 28px 26px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
  box-shadow: 0 18px 40px rgba(28, 47, 96, 0.06);
}

.notice-detail__content-accent {
  width: 4px;
  border-radius: 999px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #2f65f5 0%, #9d4dff 100%);
}

.notice-detail__content {
  flex: 1;
  min-width: 0;
}

.notice-detail__content--scrollable {
  min-height: 0;
}

.notice-detail__list {
  margin: 0;
  padding-left: 18px;
  font-size: 16px;
  line-height: 1.9;
  color: #1d2129;
}

.notice-detail__list li::marker {
  color: #2f65f5;
}

.notice-detail__list li + li {
  margin-top: 10px;
}

.notice-detail__html {
  font-size: 15px;
  line-height: 1.9;
  color: #1d2129;
  word-break: break-word;
}

.notice-detail__html--scrollable {
  max-height: clamp(220px, 50vh, 520px);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-right: 8px;
}

.notice-detail__html :deep(p) {
  margin: 0;
}

.notice-detail__html :deep(p + p),
.notice-detail__html :deep(p + ul),
.notice-detail__html :deep(p + ol),
.notice-detail__html :deep(ul + p),
.notice-detail__html :deep(ol + p),
.notice-detail__html :deep(ul + ul),
.notice-detail__html :deep(ol + ol) {
  margin-top: 10px;
}

.notice-detail__html :deep(ul),
.notice-detail__html :deep(ol) {
  padding-left: 20px;
}

.notice-detail__html :deep(img) {
  max-width: 100%;
  border-radius: 12px;
}

.notice-detail__empty {
  font-size: 15px;
  color: #86909c;
}

.notice-detail__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 30px;
  border-top: 1px solid #edf1f7;
  background: rgba(255, 255, 255, 0.94);
}

.notice-detail__footer-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b778c;
}

.notice-detail__footer-btn {
  min-width: 92px;
  height: 40px;
  border-radius: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .notice-detail-modal :deep(.arco-modal) {
    max-height: calc(100vh - 32px);
    margin: 16px auto;
  }

  .snow-page {
    padding: 0;
  }

  .snow-inner {
    padding: 8px;
  }

  .notice-card {
    border-radius: 8px;
  }

  .search-bar {
    margin-bottom: 12px !important;
  }

  .modal-banner,
  .form-layout {
    padding: 16px;
  }

  .modal-banner__meta {
    justify-content: flex-start;
  }

  .notice-table :deep(.arco-table) {
    font-size: 12px;
  }

  .notice-table :deep(.arco-table-cell) {
    padding: 8px 4px !important;
  }

  .notice-table :deep(.arco-button-size-small) {
    padding: 2px 8px;
    font-size: 12px;
  }

  .form-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-section--card,
  .detail-panel {
    padding: 16px;
  }

  .section-header {
    margin-bottom: 12px;
  }

  .section-header__title {
    font-size: 14px;
  }

  .target-radio-group {
    grid-template-columns: minmax(0, 1fr);
  }

  .editor-wrapper {
    height: 260px;
  }

  .editor-wrapper :deep(.ql-container) {
    height: calc(260px - 42px);
  }

  .editor-wrapper :deep(.ql-editor) {
    min-height: calc(260px - 42px);
    font-size: 13px;
  }

  .crm-modal :deep(.arco-modal-header) {
    padding: 12px 16px;
  }

  .crm-modal :deep(.arco-modal-header .arco-modal-title) {
    font-size: 16px;
  }

  .crm-modal :deep(.arco-modal-footer) {
    padding: 12px 16px;
  }

  .notice-detail__hero,
  .notice-detail__body,
  .notice-detail__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .notice-detail__hero {
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .notice-detail__close {
    top: 14px;
    right: 14px;
    width: 38px;
    height: 38px;
  }

  .notice-detail__title {
    max-width: 100%;
    padding-right: 40px;
    font-size: 20px;
  }

  .notice-detail__content-card {
    gap: 14px;
    padding: 20px 16px;
  }

  .notice-detail__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .notice-detail__footer-tip {
    justify-content: center;
  }

  .notice-detail__footer-btn {
    width: 100%;
  }
}
</style>
