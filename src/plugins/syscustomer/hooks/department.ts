import { computed, ref } from "vue";
import { getDivisionAPI, type DivisionItem } from "@/api/department";
import { getAccountListAPI, type AccountItem } from "@/api/user";
import type { CustomerListSearchForm } from "./list-query";

type SearchDepartmentValue = CustomerListSearchForm["deptId"];

type RoleLike = {
  createdBy?: number;
  dataScope?: number;
  checkedDepts?: string | null;
};

type DepartmentLike = number | { id?: number } | null | undefined;

type UserInfoLike =
  | {
      roles?: RoleLike[];
      department?: DepartmentLike;
    }
  | null
  | undefined;

export interface DepartmentPermissionInfo {
  hasFullPermission: boolean;
  allowedDeptIds: number[];
  description: string;
}

export interface DepartmentFollowerOption {
  value: number;
  name: string;
  deptId?: number;
}

interface DepartmentCascaderOption {
  value: number;
  label: string;
  children?: DepartmentCascaderOption[];
}

const FOLLOWER_PAGE_SIZE = 1000;

const normalizeDepartmentId = (department: DepartmentLike) => {
  if (typeof department === "number") {
    return department;
  }

  if (department && typeof department === "object" && typeof department.id === "number") {
    return department.id;
  }

  return undefined;
};

const resolveLeafDepartmentId = (deptId: SearchDepartmentValue) => {
  if (Array.isArray(deptId)) {
    return deptId.length > 0 ? deptId[deptId.length - 1] : undefined;
  }
  return deptId;
};

export const createDepartmentNameMap = (nodes: DivisionItem[], nameMap = new Map<number, string>()) => {
  for (const node of nodes) {
    nameMap.set(node.id, node.name);
    if (node.children?.length) {
      createDepartmentNameMap(node.children, nameMap);
    }
  }
  return nameMap;
};

export const getDepartmentNameByMap = (
  departmentNameMap: ReadonlyMap<number, string>,
  departmentId?: number | null,
  fallback = ""
) => {
  if (departmentId == null) {
    return fallback;
  }

  return departmentNameMap.get(departmentId) || fallback;
};

export const resolveFollowerDepartmentName = (
  followerOptions: Array<Pick<DepartmentFollowerOption, "value" | "deptId">>,
  getDepartmentName: (departmentId?: number | null) => string,
  userId?: number | string | null,
  fallback = ""
) => {
  if (userId == null) {
    return fallback;
  }

  const departmentId = followerOptions.find(item => Number(item.value) === Number(userId))?.deptId;
  return getDepartmentName(departmentId) || fallback;
};

const collectChildDepartmentIds = (nodes: DivisionItem[]) => {
  const ids: number[] = [];

  for (const node of nodes) {
    ids.push(node.id);
    if (node.children?.length) {
      ids.push(...collectChildDepartmentIds(node.children));
    }
  }

  return ids;
};

const findDepartmentWithChildren = (nodes: DivisionItem[], departmentId: number): number[] => {
  for (const node of nodes) {
    if (node.id === departmentId) {
      return [node.id, ...collectChildDepartmentIds(node.children || [])];
    }
    if (node.children?.length) {
      const childIds = findDepartmentWithChildren(node.children, departmentId);
      if (childIds.length > 0) {
        return childIds;
      }
    }
  }

  return [];
};

const toCascaderOptions = (nodes: DivisionItem[]): DepartmentCascaderOption[] => {
  return nodes.map(node => ({
    value: node.id,
    label: node.name,
    children: node.children?.length ? toCascaderOptions(node.children) : undefined
  }));
};

const filterDepartmentTree = (nodes: DivisionItem[], allowedDeptIds: Set<number>): DivisionItem[] => {
  const result: DivisionItem[] = [];

  for (const node of nodes) {
    if (allowedDeptIds.has(node.id)) {
      result.push({
        ...node,
        children: node.children?.length ? filterDepartmentTree(node.children, allowedDeptIds) : undefined
      });
      continue;
    }

    if (node.children?.length) {
      const filteredChildren = filterDepartmentTree(node.children, allowedDeptIds);
      if (filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren
        });
      }
    }
  }

  return result;
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
const buildPermissionInfo = (userInfo: UserInfoLike, departmentTree: DivisionItem[]): DepartmentPermissionInfo => {
  const userRoles = Array.isArray(userInfo?.roles) ? userInfo.roles : [];
  const userDeptId = normalizeDepartmentId(userInfo?.department);
  const hasFullPermission = userRoles.some(role => role.createdBy === 1 && role.dataScope === 1);

  if (hasFullPermission) {
    return {
      hasFullPermission: true,
      allowedDeptIds: [],
      description: "超级管理员：查看全部部门和员工"
    };
  }

  const allowedDeptIds = new Set<number>();

  for (const role of userRoles) {
    const checkedDepts = role.checkedDepts
      ? role.checkedDepts
          .split(",")
          .map(item => Number(item))
          .filter(item => Number.isFinite(item))
      : [];

    switch (role.dataScope) {
      case 2:
        if (checkedDepts.length > 0) {
          checkedDepts.forEach(deptId => allowedDeptIds.add(deptId));
        } else if (userDeptId) {
          allowedDeptIds.add(userDeptId);
        }
        break;
      case 3:
        if (userDeptId) {
          allowedDeptIds.add(userDeptId);
        }
        break;
      case 4:
        if (userDeptId) {
          findDepartmentWithChildren(departmentTree, userDeptId).forEach(deptId => allowedDeptIds.add(deptId));
        }
        break;
      default:
        break;
    }
  }

  return {
    hasFullPermission: false,
    allowedDeptIds: Array.from(allowedDeptIds),
    description: `普通权限：查看${allowedDeptIds.size}个部门的员工`
  };
};

export const useCustomerDepartmentScope = (userInfo: UserInfoLike) => {
  const departmentTree = ref<DivisionItem[]>([]);
  const departmentTreeLoaded = ref(false);
  const followerOptions = ref<DepartmentFollowerOption[]>([]);

  const permissionInfo = computed(() => buildPermissionInfo(userInfo, departmentTree.value));
  const departmentNameMap = computed(() => createDepartmentNameMap(departmentTree.value));

  const cascaderOptions = computed(() => {
    if (!departmentTree.value.length) {
      return [];
    }

    if (permissionInfo.value.hasFullPermission) {
      return toCascaderOptions(departmentTree.value);
    }

    if (permissionInfo.value.allowedDeptIds.length === 0) {
      return [];
    }

    const filteredTree = filterDepartmentTree(departmentTree.value, new Set(permissionInfo.value.allowedDeptIds));
    return toCascaderOptions(filteredTree);
  });

  const loadDepartmentTree = async () => {
    try {
      const res = await getDivisionAPI();
      departmentTree.value = res.data.list || [];
    } catch (error) {
      console.error("获取部门数据失败:", error);
      departmentTree.value = [];
    } finally {
      departmentTreeLoaded.value = true;
    }
  };

  const loadFollowerOptionsByDepartmentIds = async (departmentIds: number[]) => {
    try {
      const params: Record<string, number> = {
        pageNum: 1,
        pageSize: FOLLOWER_PAGE_SIZE
      };

      departmentIds.forEach((deptId, index) => {
        params[`deptIds[${index}]`] = deptId;
      });

      const response = await getAccountListAPI(departmentIds.length > 0 ? params : {});

      if (response.data && Array.isArray(response.data.list)) {
        followerOptions.value = response.data.list.map((item: AccountItem) => ({
          value: item.id,
          name: item.nickName,
          deptId: item.deptId
        }));
        return;
      }

      followerOptions.value = [];
    } catch (error) {
      console.error("获取跟进人列表失败:", error);
      followerOptions.value = [];
    }
  };

  const loadFollowerOptionsForSearch = async (deptId: SearchDepartmentValue) => {
    const selectedDeptId = resolveLeafDepartmentId(deptId);

    if (selectedDeptId) {
      await loadFollowerOptionsByDepartmentIds([selectedDeptId]);
      return;
    }

    if (permissionInfo.value.hasFullPermission) {
      await loadFollowerOptionsByDepartmentIds([]);
      return;
    }

    await loadFollowerOptionsByDepartmentIds(permissionInfo.value.allowedDeptIds);
  };

  const getDepartmentName = (departmentId?: number | null) => {
    return getDepartmentNameByMap(departmentNameMap.value, departmentId);
  };

  const getFollowerDepartmentName = (userId?: number | string | null, fallback = "") => {
    return resolveFollowerDepartmentName(followerOptions.value, getDepartmentName, userId, fallback);
  };

  return {
    departmentTree,
    departmentTreeLoaded,
    followerOptions,
    permissionInfo,
    cascaderOptions,
    loadDepartmentTree,
    loadFollowerOptionsByDepartmentIds,
    loadFollowerOptionsForSearch,
    getDepartmentName,
    getFollowerDepartmentName
  };
};
