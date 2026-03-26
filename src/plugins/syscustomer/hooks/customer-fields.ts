// 客户扩展字段在多个页面里都会用到，统一收口后更容易维护和复用。
export const EXTRA_PROPERTIES = {
  OCCUPATION: "occupation",
  HOUSE: "house",
  CAR: "car",
  CREDIT_CARD: "creditcard",
  INSURANCE: "insurance",
  HOUSE_FUND: "housefund",
  SOCIAL_INSURANCE: "socialinsurance",
  ZHIMA_SCORE: "zhimascore",
  SALARY_MONEY: "salarymoney",
  EDUCATION: "education"
} as const;

export type CustomerExtraProperty = (typeof EXTRA_PROPERTIES)[keyof typeof EXTRA_PROPERTIES];

export const ALL_EXTRA_PROPERTIES = Object.values(EXTRA_PROPERTIES) as CustomerExtraProperty[];

export const EXTRA_PROPERTY_LABELS: Record<CustomerExtraProperty, string> = {
  [EXTRA_PROPERTIES.OCCUPATION]: "职业",
  [EXTRA_PROPERTIES.HOUSE]: "房产",
  [EXTRA_PROPERTIES.CAR]: "车产",
  [EXTRA_PROPERTIES.CREDIT_CARD]: "信用卡",
  [EXTRA_PROPERTIES.INSURANCE]: "商业保险",
  [EXTRA_PROPERTIES.HOUSE_FUND]: "公积金",
  [EXTRA_PROPERTIES.SOCIAL_INSURANCE]: "社保",
  [EXTRA_PROPERTIES.ZHIMA_SCORE]: "芝麻分",
  [EXTRA_PROPERTIES.SALARY_MONEY]: "月薪",
  [EXTRA_PROPERTIES.EDUCATION]: "学历"
};

// 详情页顶部的几个主字段会反复被更新提示使用，统一定义可以避免文案散落在页面里。
export const TOP_FIELD_LABELS = {
  status: "业务阶段",
  intention: "客户有效",
  customerStar: "星级",
  singlePieceType: "类型"
} as const;
