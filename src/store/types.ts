import { Tenant } from "@/api/tenant";
export type userType = {
  id: number;
  avatar: string;
  username: string;
  nickname: string;
  phone: string;
  roles: Array<number>;
  permissions: Array<string>;
  tenantID: number;
  tenantCode: string;
  tenantName: string;
  tenantDomain: string;
  defaultTenant?: Tenant;
  isWatermark?: number | null;
  tenants?: Array<Tenant>;
};
