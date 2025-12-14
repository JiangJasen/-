import React from 'react';
import Layout from '../components/Layout';
import { User, MapPin, Phone, Wallet } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Technician = () => {
  // Simulate logged in technician
  const { technicians, orders } = useData();
  const currentTech = technicians[0];
  const myOrders = orders.filter(o => o.technicianId === currentTech.id);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">师傅端 (模拟预览)</h1>
        <p className="text-gray-500">移动端视图模拟</p>
      </div>

      <div className="flex justify-center">
        {/* Mobile Mockup */}
        <div className="w-[375px] h-[812px] border-8 border-gray-900 rounded-[3rem] bg-gray-100 overflow-hidden shadow-2xl relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-10"></div>
          
          {/* App Header */}
          <div className="bg-red-600 text-white pt-12 pb-6 px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                <User />
              </div>
              <div>
                <h2 className="font-bold text-lg">{currentTech.name}</h2>
                <p className="text-xs opacity-80">{currentTech.region}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xs opacity-80">本月单量</p>
                <p className="font-bold text-xl">{myOrders.length}</p>
              </div>
              <div className="text-center border-l border-white/20 pl-4">
                <p className="text-xs opacity-80">待结算</p>
                <p className="font-bold text-xl">¥450</p>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
            <h3 className="font-bold text-gray-800">今日任务</h3>
            
            {myOrders.slice(0, 3).map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${order.type === '安装' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {order.type}
                    </span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                 </div>
                 <h4 className="font-bold text-gray-800 mb-1">{order.address}</h4>
                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                   <User size={12} /> {order.customerName}
                 </div>
                 <div className="flex gap-2">
                   <button className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                     <Phone size={12} /> 联系
                   </button>
                   <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-medium">
                     开始{order.type}
                   </button>
                 </div>
              </div>
            ))}
            
            <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-xl border border-red-100 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <Wallet size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">申请结算</h4>
                  <p className="text-xs text-gray-500">快速提交完工单据</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nav Mock */}
          <div className="absolute bottom-0 w-full bg-white border-t py-4 px-6 flex justify-between">
             <div className="flex flex-col items-center text-red-600">
               <div className="w-6 h-6 bg-red-600 rounded-full mb-1"></div>
               <span className="text-[10px]">任务</span>
             </div>
             <div className="flex flex-col items-center text-gray-400">
               <div className="w-6 h-6 bg-gray-300 rounded-full mb-1"></div>
               <span className="text-[10px]">消息</span>
             </div>
             <div className="flex flex-col items-center text-gray-400">
               <div className="w-6 h-6 bg-gray-300 rounded-full mb-1"></div>
               <span className="text-[10px]">我的</span>
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Technician;