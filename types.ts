export enum OrderType {
  INSTALLATION = '安装',
  REPAIR = '维修'
}

export enum SettlementType {
  CATEGORY_3C = '3C',
  APPLIANCE = '家电'
}

export enum PartType {
  ORIGINAL_BATTERY = '原装电池',
  NON_ORIGINAL_BATTERY = '非原厂电池'
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  type: OrderType; // Maps to "安装下单明细" and "维修下单明细"
  date: string;
  technicianId: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Settlement {
  id: string;
  orderId: string;
  category: SettlementType; // Maps to "3C结算" and "家电结算"
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
}

export interface KPIData {
  id: string;
  technicianId: string;
  period: string; // YYYY-MM
  satisfactionScore: number; // 满意度
  completionRate: number; // 完成率
  timelinessRate: number; // 及时率
  complianceScore: number; // 规范明细
}

export interface PartSale {
  id: string;
  orderId: string;
  partType: PartType; // Maps to battery types
  quantity: number;
  pricePerUnit: number;
  total: number;
  date: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  region: string;
}

// Aggregated context state
export interface AppState {
  orders: Order[];
  settlements: Settlement[];
  kpis: KPIData[];
  parts: PartSale[];
  technicians: Technician[];
}