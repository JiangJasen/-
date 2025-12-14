import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GeminiInsight from '../components/GeminiInsight';
import { generateReportAnalysis } from '../services/geminiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E1251B'];

const Reports = () => {
  const { orders, settlements, kpis } = useData();

  // Aggregate Settlement Data by Category
  const settlementData = [
    { name: '3C数码', value: settlements.filter(s => s.category === '3C').reduce((acc, c) => acc + c.amount, 0) },
    { name: '家用电器', value: settlements.filter(s => s.category === '家电').reduce((acc, c) => acc + c.amount, 0) },
  ];

  // Aggregate KPI Data (Average by Period - mock simplified)
  const kpiData = kpis.map(k => ({
    name: k.period,
    satisfaction: k.satisfactionScore,
    completion: k.completionRate,
    timeliness: k.timelinessRate
  }));

  // Order Volume by Type
  const orderData = [
    { name: '安装订单', value: orders.filter(o => o.type === '安装').length },
    { name: '维修订单', value: orders.filter(o => o.type === '维修').length },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">数据报表</h1>
        <p className="text-gray-500">业务指标深度可视化分析</p>
      </div>

      <GeminiInsight 
        title="深度运营分析" 
        fetchInsight={() => generateReportAnalysis("monthly KPI", { settlementData, kpiData })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KPI Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">KPI 趋势分析 (满意度/完成率)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="#E1251B" name="满意度" />
                <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#82ca9d" name="完成率" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Settlement Composition */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">结算金额构成 (3C vs 家电)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={settlementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {settlementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Types */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">订单类型分布</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#E1251B" barSize={40} name="单量" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;