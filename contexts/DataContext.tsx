import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';
import { AppState, Order, Settlement, KPIData, PartSale, Technician } from '../types';
import { MOCK_ORDERS, MOCK_SETTLEMENTS, MOCK_KPIS, MOCK_PARTS, MOCK_TECHNICIANS } from '../constants';

interface DataContextType extends AppState {
  addOrder: (order: Order) => void;
  addSettlement: (settlement: Settlement) => void;
  updateSettlementStatus: (id: string, status: Settlement['status']) => void;
  addKPI: (kpi: KPIData) => void;
  upsertKPI: (kpi: Partial<KPIData> & { technicianId: string, period: string }) => void;
  addPartSale: (part: PartSale) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [settlements, setSettlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [kpis, setKpis] = useState<KPIData[]>(MOCK_KPIS);
  const [parts, setParts] = useState<PartSale[]>(MOCK_PARTS);
  const [technicians] = useState<Technician[]>(MOCK_TECHNICIANS);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const addSettlement = (settlement: Settlement) => setSettlements(prev => [settlement, ...prev]);
  
  const updateSettlementStatus = (id: string, status: Settlement['status']) => {
    setSettlements(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addKPI = (kpi: KPIData) => setKpis(prev => [kpi, ...prev]);

  const upsertKPI = (kpi: Partial<KPIData> & { technicianId: string, period: string }) => {
    setKpis(prev => {
      const index = prev.findIndex(item => item.technicianId === kpi.technicianId && item.period === kpi.period);
      if (index > -1) {
        // Update existing record
        const newKpis = [...prev];
        newKpis[index] = { ...newKpis[index], ...kpi };
        return newKpis;
      } else {
        // Create new record with defaults
        return [{
          id: Math.random().toString(36).substr(2, 9),
          satisfactionScore: 0,
          completionRate: 0,
          timelinessRate: 0,
          complianceScore: 0,
          ...kpi
        } as KPIData, ...prev];
      }
    });
  };

  const addPartSale = (part: PartSale) => setParts(prev => [part, ...prev]);

  return (
    <DataContext.Provider value={{ 
      orders, settlements, kpis, parts, technicians,
      addOrder, addSettlement, updateSettlementStatus, addKPI, upsertKPI, addPartSale 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};