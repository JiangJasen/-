import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { CheckCircle, XCircle } from 'lucide-react';

const Finance = () => {
  const { settlements, updateSettlementStatus } = useData();

  const handleApprove = (id: string) => {
    if (window.confirm('确认审批通过此结算单？')) {
      updateSettlementStatus(id, 'Approved');
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm('确认驳回此结算单？')) {
      updateSettlementStatus(id, 'Rejected');
    }
  };

  const pendingSettlements = settlements.filter(s => s.status === 'Pending');
  const historySettlements = settlements.filter(s => s.status !== 'Pending');

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">财务审批</h1>
        <p className="text-gray-500">审批师傅及网点提交的结算申请</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          待审批 ({pendingSettlements.length})
        </h2>
        
        {pendingSettlements.length === 0 ? (
          <div className="p-8 bg-white rounded-lg border border-gray-200 text-center text-gray-500">
            暂无待审批条目
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3">结算ID</th>
                  <th className="px-6 py-3">类别</th>
                  <th className="px-6 py-3">金额</th>
                  <th className="px-6 py-3">提交日期</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {pendingSettlements.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.id}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">¥{item.amount}</td>
                    <td className="px-6 py-4">{item.submissionDate}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle size={16} /> 通过
                      </button>
                      <button 
                         onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <XCircle size={16} /> 驳回
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-gray-300 rounded-full"></span>
          审批历史
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 opacity-80">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">结算ID</th>
                <th className="px-6 py-3">类别</th>
                <th className="px-6 py-3">金额</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {historySettlements.slice(0, 5).map(item => (
                <tr key={item.id} className="border-b">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">¥{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status === 'Approved' ? '已通过' : '已驳回'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Finance;