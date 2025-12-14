import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { OrderType } from '../types';
import { Filter } from 'lucide-react';

const DataList = () => {
  const [view, setView] = useState<'orders' | 'settlements' | 'kpis' | 'parts'>('orders');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderType>('ALL');
  
  const { orders, settlements, kpis, parts, technicians } = useData();

  const getTechName = (id: string) => technicians.find(t => t.id === id)?.name || id;

  const renderTable = () => {
    switch (view) {
      case 'orders':
        const filteredOrders = orders.filter(o => orderFilter === 'ALL' || o.type === orderFilter);
        return (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">订单号</th>
                <th className="px-6 py-3">业务类型</th>
                <th className="px-6 py-3">客户姓名</th>
                <th className="px-6 py-3">地址</th>
                <th className="px-6 py-3">指派师傅</th>
                <th className="px-6 py-3">日期</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-400">暂无数据</td>
                </tr>
              ) : (
                filteredOrders.map(item => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.orderNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.type === OrderType.INSTALLATION ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.customerName}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={item.address}>{item.address}</td>
                    <td className="px-6 py-4">{getTechName(item.technicianId)}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs text-white ${item.status === 'Completed' ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {item.status === 'Completed' ? '已完成' : item.status === 'Pending' ? '待处理' : '已取消'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );
      case 'settlements':
        return (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">结算ID</th>
                <th className="px-6 py-3">关联订单ID</th>
                <th className="px-6 py-3">结算类别</th>
                <th className="px-6 py-3">结算金额</th>
                <th className="px-6 py-3">提交日期</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(item => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.orderId}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs ${item.category === '3C' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                        {item.category}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-medium">¥{item.amount}</td>
                  <td className="px-6 py-4">{item.submissionDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      item.status === 'Approved' ? 'bg-green-500' : 
                      item.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {item.status === 'Approved' ? '已通过' : item.status === 'Rejected' ? '已驳回' : '审核中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'kpis':
        return (
           <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">师傅</th>
                <th className="px-6 py-3">考核月份</th>
                <th className="px-6 py-3">满意度</th>
                <th className="px-6 py-3">完成率</th>
                <th className="px-6 py-3">及时率</th>
                <th className="px-6 py-3">规范评分</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map(item => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{getTechName(item.technicianId)}</td>
                  <td className="px-6 py-4">{item.period}</td>
                  <td className="px-6 py-4">
                    <span className="text-orange-600 font-bold">{item.satisfactionScore}</span>
                  </td>
                  <td className="px-6 py-4">{item.completionRate}%</td>
                  <td className="px-6 py-4">{item.timelinessRate}%</td>
                  <td className="px-6 py-4">{item.complianceScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
       case 'parts':
        return (
           <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">关联订单ID</th>
                <th className="px-6 py-3">配件类型</th>
                <th className="px-6 py-3">数量</th>
                <th className="px-6 py-3">单价</th>
                <th className="px-6 py-3">总价</th>
                <th className="px-6 py-3">销售日期</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(item => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.orderId}</td>
                  <td className="px-6 py-4">{item.partType}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">¥{item.pricePerUnit}</td>
                  <td className="px-6 py-4 font-bold text-red-600">¥{item.total}</td>
                  <td className="px-6 py-4">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据列表</h1>
          <p className="text-gray-500">查看各类详细数据库表单</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         {/* Main View Tabs */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {[
            { id: 'orders', label: '下单明细' },
            { id: 'settlements', label: '结算明细' },
            { id: 'kpis', label: 'KPI明细' },
            { id: 'parts', label: '配件销售' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setView(tab.id as any);
                if (tab.id !== 'orders') setOrderFilter('ALL');
              }}
              className={`px-4 py-2 text-sm rounded-md transition-all ${
                view === tab.id 
                ? 'bg-red-50 text-red-600 font-bold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub-filter for Orders */}
        {view === 'orders' && (
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
             <div className="px-2 text-gray-400">
                <Filter size={16} />
             </div>
             <button 
               onClick={() => setOrderFilter('ALL')}
               className={`px-3 py-1.5 text-xs rounded transition-colors ${orderFilter === 'ALL' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
             >
               全部
             </button>
             <button 
               onClick={() => setOrderFilter(OrderType.INSTALLATION)}
               className={`px-3 py-1.5 text-xs rounded transition-colors ${orderFilter === OrderType.INSTALLATION ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'}`}
             >
               安装
             </button>
             <button 
               onClick={() => setOrderFilter(OrderType.REPAIR)}
               className={`px-3 py-1.5 text-xs rounded transition-colors ${orderFilter === OrderType.REPAIR ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50'}`}
             >
               维修
             </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto custom-scrollbar">
          {renderTable()}
        </div>
      </div>
    </Layout>
  );
};

export default DataList;