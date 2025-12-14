import React from 'react';
import Layout from '../components/Layout';
import { Database, Table, HardDrive } from 'lucide-react';

const DatabaseSetup = () => {
  const schemas = [
    { name: '安装下单明细数据库', fields: ['Order ID', 'Customer', 'Address', 'Tech ID', 'Status'] },
    { name: '维修下单明细数据库', fields: ['Order ID', 'Issue Type', 'Customer', 'Tech ID', 'Status'] },
    { name: '3C结算明细数据库', fields: ['Settlement ID', 'Order ID', 'Amount', 'Date'] },
    { name: '家电结算明细数据库', fields: ['Settlement ID', 'Order ID', 'Amount', 'Warranty'] },
    { name: '满意度数据库', fields: ['Tech ID', 'Score', 'Feedback', 'Date'] },
    { name: '原装电池销售数据库', fields: ['Part ID', 'Model', 'Quantity', 'Price'] },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">建立数据库</h1>
        <p className="text-gray-500">底层数据结构定义与管理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemas.map((schema, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">{schema.name}</h3>
            </div>
            <div className="space-y-2">
              {schema.fields.map((field, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-500">
                  <Table size={12} />
                  <span>{field}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
              <button className="text-xs text-blue-600 hover:underline">Configure</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-900 text-white p-6 rounded-xl flex items-center justify-between">
        <div>
           <h3 className="font-bold text-lg mb-1">系统数据库状态</h3>
           <p className="opacity-80 text-sm">所有节点连接正常，数据同步延迟 &lt; 20ms</p>
        </div>
        <HardDrive size={32} />
      </div>
    </Layout>
  );
};

export default DatabaseSetup;