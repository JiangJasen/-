import { Order, OrderType, Settlement, SettlementType, KPIData, PartSale, PartType, Technician } from './types';

export const MOCK_TECHNICIANS: Technician[] = [
  { id: 'T001', name: '张伟', phone: '13800138000', region: '北京朝阳' },
  { id: 'T002', name: '李强', phone: '13900139000', region: '上海浦东' },
  { id: 'T003', name: '王磊', phone: '13700137000', region: '广州天河' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'O1001', orderNumber: 'JD2023102701', customerName: '刘先生', address: '北京市朝阳区阳光100', type: OrderType.INSTALLATION, date: '2023-10-27', technicianId: 'T001', status: 'Completed' },
  { id: 'O1002', orderNumber: 'JD2023102702', customerName: '陈女士', address: '上海市浦东新区陆家嘴', type: OrderType.REPAIR, date: '2023-10-28', technicianId: 'T002', status: 'Pending' },
  { id: 'O1003', orderNumber: 'JD2023102703', customerName: '赵先生', address: '广州市天河区太古汇', type: OrderType.INSTALLATION, date: '2023-10-28', technicianId: 'T003', status: 'Completed' },
  { id: 'O1004', orderNumber: 'JD2023102801', customerName: '孙女士', address: '北京市海淀区中关村', type: OrderType.REPAIR, date: '2023-10-29', technicianId: 'T001', status: 'Completed' },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'S1001', orderId: 'O1001', category: SettlementType.APPLIANCE, amount: 150.00, status: 'Approved', submissionDate: '2023-10-27' },
  { id: 'S1003', orderId: 'O1003', category: SettlementType.CATEGORY_3C, amount: 80.00, status: 'Pending', submissionDate: '2023-10-28' },
  { id: 'S1004', orderId: 'O1004', category: SettlementType.APPLIANCE, amount: 200.00, status: 'Pending', submissionDate: '2023-10-29' },
];

export const MOCK_KPIS: KPIData[] = [
  { id: 'K001', technicianId: 'T001', period: '2023-10', satisfactionScore: 9.8, completionRate: 100, timelinessRate: 98, complianceScore: 100 },
  { id: 'K002', technicianId: 'T002', period: '2023-10', satisfactionScore: 9.2, completionRate: 95, timelinessRate: 90, complianceScore: 95 },
  { id: 'K003', technicianId: 'T003', period: '2023-10', satisfactionScore: 9.5, completionRate: 98, timelinessRate: 96, complianceScore: 98 },
];

export const MOCK_PARTS: PartSale[] = [
  { id: 'P001', orderId: 'O1002', partType: PartType.ORIGINAL_BATTERY, quantity: 1, pricePerUnit: 299, total: 299, date: '2023-10-28' },
  { id: 'P002', orderId: 'O1004', partType: PartType.NON_ORIGINAL_BATTERY, quantity: 1, pricePerUnit: 150, total: 150, date: '2023-10-29' },
];