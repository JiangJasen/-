import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Table, PieChart, CheckSquare, Wrench, Database } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '仪表盘', icon: <LayoutDashboard size={20} /> },
    { path: '/entry', label: '上传数据', icon: <Upload size={20} /> },
    { path: '/list', label: '数据列表', icon: <Table size={20} /> },
    { path: '/reports', label: '数据报表', icon: <PieChart size={20} /> },
    { path: '/finance', label: '财务审批', icon: <CheckSquare size={20} /> },
    { path: '/technician', label: '师傅端', icon: <Wrench size={20} /> },
    { path: '/database', label: '建立数据库', icon: <Database size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 font-bold text-red-600 text-xl">
          <span className="bg-red-600 text-white p-1 rounded">JD</span>
          <span>结算系统</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-red-600 bg-red-50 border-r-4 border-red-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">管理员</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;