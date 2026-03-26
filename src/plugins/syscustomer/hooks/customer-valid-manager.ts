import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import {
  createCustomerValid,
  deleteCustomerValid,
  getCustomerValidList,
  updateCustomerValid,
  type CustomerValidCreateParams,
  type CustomerValidData,
  type CustomerValidListParams,
  type CustomerValidUpdateParams
} from "@/api/customervalid";

type AsyncOrSync<T> = T | Promise<T>;

interface UseCustomerValidManagerOptions {
  // 当前操作的是哪一类标签，由接入页面自己决定。
  getCurrentType: () => number | undefined;
  // 重新加载全量标签映射，供页面内的显示文本和弹窗选项复用。
  reloadAllOptions: () => AsyncOrSync<void>;
  // 标签增删改后，页面可能还需要刷新当前可选项，交给接入方按需实现。
  reloadSelectableOptions?: (type?: number) => AsyncOrSync<void>;
}

const createDefaultEditingValid = (type = 1): Partial<CustomerValidData> => ({
  id: undefined,
  type,
  name: "",
  status: 1
});

export const useCustomerValidManager = (options: UseCustomerValidManagerOptions) => {
  const manageValidModalVisible = ref(false);
  const editValidModalVisible = ref(false);
  const editValidFormRef = ref();
  const validLoading = ref(false);
  const customerValidList = ref<CustomerValidData[]>([]);
  const editingValid = reactive<Partial<CustomerValidData>>(createDefaultEditingValid());

  const validRules = {
    name: [{ required: true, message: "请输入名称" }],
    status: [{ required: true, message: "请选择状态" }]
  };

  const resetEditingValid = (type = options.getCurrentType() || 1) => {
    Object.assign(editingValid, createDefaultEditingValid(type));
  };

  const loadCustomerValidListByType = async (type = options.getCurrentType()) => {
    validLoading.value = true;

    try {
      const params: CustomerValidListParams = { pageSize: 100 };
      if (type) {
        params.type = type;
      }

      const response = await getCustomerValidList(params);
      customerValidList.value = response.data.list || [];
    } catch (error) {
      console.error("加载客户有效性标签列表失败:", error);
      customerValidList.value = [];
    } finally {
      validLoading.value = false;
    }
  };

  // 把“刷新管理列表 + 刷新全量映射 + 刷新当前可选项”收敛在一起，避免两个页面继续各写一套。
  const refreshAfterMutation = async () => {
    const currentType = options.getCurrentType();
    await loadCustomerValidListByType(currentType);
    await options.reloadAllOptions();
    await options.reloadSelectableOptions?.(currentType);
  };

  const openManageValidModal = async () => {
    await loadCustomerValidListByType();
    manageValidModalVisible.value = true;
  };

  const openCreateValid = () => {
    resetEditingValid();
    editValidModalVisible.value = true;
  };

  const openEditValid = (record: CustomerValidData) => {
    Object.assign(editingValid, record);
    editValidModalVisible.value = true;
  };

  const deleteValidItem = async (id: number) => {
    try {
      await deleteCustomerValid(id);
      Message.success("删除成功");
      await refreshAfterMutation();
    } catch (error) {
      console.error("删除客户有效性标签失败:", error);
      Message.error("删除失败");
    }
  };

  const saveValidItem = async () => {
    const validationResult = await editValidFormRef.value?.validate?.();
    if (validationResult) {
      return false;
    }

    try {
      if (editingValid.id) {
        await updateCustomerValid(editingValid as CustomerValidUpdateParams);
        Message.success("更新成功");
      } else {
        await createCustomerValid(editingValid as CustomerValidCreateParams);
        Message.success("创建成功");
      }

      editValidModalVisible.value = false;
      await refreshAfterMutation();
      return true;
    } catch (error) {
      console.error("保存客户有效性标签失败:", error);
      Message.error("保存失败");
      return false;
    }
  };

  const closeEditValidModal = () => {
    editValidModalVisible.value = false;
    resetEditingValid();
  };

  return {
    manageValidModalVisible,
    editValidModalVisible,
    editValidFormRef,
    validLoading,
    customerValidList,
    editingValid,
    validRules,
    loadCustomerValidListByType,
    openManageValidModal,
    openCreateValid,
    openEditValid,
    deleteValidItem,
    saveValidItem,
    closeEditValidModal
  };
};
