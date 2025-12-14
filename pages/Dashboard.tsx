import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { generateDailyInsight } from '../services/geminiService';
import GeminiInsight from '../components/GeminiInsight';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ClipboardCheck, AlertCircle, ShoppingBag } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { orders, settlements, kpis, parts } = useData();

  const totalRevenue = settlements
    .filter(s => s.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingSettlements = settlements.filter(s => s.status === 'Pending').length;
  
  const avgCompletion = kpis.length > 0 
    ? Math.round(kpis.reduce((acc, curr) => acc + curr.completionRate, 0) / kpis.length) 
    : 0;

  // Prepare chart data
  const chartData = [
    { name: '待处理结算', value: pendingSettlements },
    { name: '已完成订单', value: orders.filter(o => o.status === 'Completed').length },
    { name: '配件销售', value: parts.length },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500">欢迎回到京东订单结算系统概览</p>
      </div>

      {/* AI Insight Section */}
      <GeminiInsight 
        title="每日运营简报 (AI Powered)" 
        fetchInsight={() => generateDailyInsight({ orders, settlements, kpis, parts, technicians: [] })}
        dependencies={[orders.length, settlements.length]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="已结算金额" 
          value={`¥${totalRevenue.toFixed(2)}`} 
          icon={<DollarSign size={24} />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="待审批结算" 
          value={pendingSettlements} 
          icon={<AlertCircle size={24} />} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="KPI 平均完成率" 
          value={`${avgCompletion}%`} 
          icon={<ClipboardCheck size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="配件销售单数" 
          value={parts.length} 
          icon={<ShoppingBag size={24} />} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">实时数据概览</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#E1251B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">最新订单</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2">单号</th>
                  <th className="px-4 py-2">类型</th>
                  <th className="px-4 py-2">客户</th>
                  <th className="px-4 py-2">状态</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${order.type === '安装' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${order.status === 'Completed' ? 'text-green-600' : 'text-gray-500'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;