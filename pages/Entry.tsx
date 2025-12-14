import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { OrderType, SettlementType, PartType } from '../types';
import { FileText, UploadCloud, Info, ArrowRightLeft } from 'lucide-react';
import { read, utils } from 'xlsx';

const Entry = () => {
  const [activeTab, setActiveTab] = useState<'order' | 'settlement' | 'kpi' | 'part'>('order');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Entry Modes
  const [orderEntryMode, setOrderEntryMode] = useState<'single' | 'batch'>('single');
  const [settlementEntryMode, setSettlementEntryMode] = useState<'single' | 'batch'>('single');
  const [kpiEntryMode, setKpiEntryMode] = useState<'single' | 'batch'>('single');
  const [partEntryMode, setPartEntryMode] = useState<'single' | 'batch'>('single');
  
  const { addOrder, addSettlement, upsertKPI, addPartSale, technicians } = useData();

  // Simple form state handling
  const [orderForm, setOrderForm] = useState({ orderNumber: '', customerName: '', address: '', type: OrderType.INSTALLATION, technicianId: technicians[0]?.id || '' });
  const [settlementForm, setSettlementForm] = useState({ orderId: '', category: SettlementType.APPLIANCE, amount: 0 });
  const [kpiForm, setKpiForm] = useState({ technicianId: technicians[0]?.id || '', period: '2023-11', satisfaction: 10, completion: 100, timeliness: 100, compliance: 100 });
  const [partForm, setPartForm] = useState({ orderId: '', type: PartType.ORIGINAL_BATTERY, quantity: 1, price: 0 });

  // Batch Form State - Orders
  const [batchMonth, setBatchMonth] = useState(new Date().toISOString().slice(0, 7));
  const [batchType, setBatchType] = useState(OrderType.INSTALLATION);
  const [batchText, setBatchText] = useState('');

  // Batch Form State - Settlements
  const [batchSettlementMonth, setBatchSettlementMonth] = useState(new Date().toISOString().slice(0, 7));
  const [batchSettlementCategory, setBatchSettlementCategory] = useState(SettlementType.APPLIANCE);
  const [batchSettlementText, setBatchSettlementText] = useState('');

  // Batch Form State - KPI
  const [batchKPIMonth, setBatchKPIMonth] = useState(new Date().toISOString().slice(0, 7));
  const [batchKPIMetric, setBatchKPIMetric] = useState<'ALL' | 'SATISFACTION' | 'COMPLETION' | 'TIMELINESS' | 'COMPLIANCE'>('ALL');
  const [batchKPIText, setBatchKPIText] = useState('');

  // Batch Form State - Parts
  const [batchPartMonth, setBatchPartMonth] = useState(new Date().toISOString().slice(0, 7));
  const [batchPartType, setBatchPartType] = useState(PartType.ORIGINAL_BATTERY);
  const [batchPartText, setBatchPartText] = useState('');

  // Helper to trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Helper to generate random date in selected month
  const getRandomDateInMonth = (monthStr: string) => {
    const year = parseInt(monthStr.split('-')[0]);
    const month = parseInt(monthStr.split('-')[1]) - 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  // Generic File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws, { header: 1 }) as any[][]; // Get array of arrays
        
        // Convert array data to CSV-like string for the text area
        const textData = data
          .filter(row => row.length > 0)
          .map(row => row.join(', '))
          .join('\n');

        // Set the text area value based on active tab
        if (activeTab === 'order') {
            setBatchText(textData);
        } else if (activeTab === 'settlement') {
            setBatchSettlementText(textData);
        } else if (activeTab === 'kpi') {
            setBatchKPIText(textData);
        } else if (activeTab === 'part') {
            setBatchPartText(textData);
        }

        alert("文件已加载到输入框中，请检查内容并点击底部的“执行批量导入”按钮以保存数据。");
      } catch (error) {
        console.error("Parsing Error", error);
        alert("文件解析失败，请检查文件格式。");
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset input
    e.target.value = '';
  };

  const processUploadedData = (rows: any[][]) => {
    if (!rows || rows.length === 0) return;
    
    let count = 0;
    let errors = 0;

    // Filter out empty rows
    const validRows = rows.filter(r => r.length > 0);

    if (activeTab === 'order') {
        validRows.forEach(row => {
            // Assume format: [OrderNo, Customer, Address] - Check if first col looks like ID
            const orderNo = String(row[0] || '').trim();
            const customer = String(row[1] || '').trim();
            const address = String(row[2] || '').trim();

            // Simple validation: Ignore headers like '订单号'
            if (orderNo && customer && orderNo !== '订单号') {
                const randomTech = technicians[Math.floor(Math.random() * technicians.length)];
                addOrder({
                    id: Math.random().toString(36).substr(2, 9),
                    orderNumber: orderNo,
                    customerName: customer,
                    address: address || '未知地址',
                    type: batchType,
                    date: getRandomDateInMonth(batchMonth),
                    technicianId: randomTech?.id || 'T001',
                    status: 'Pending'
                });
                count++;
            }
        });
        alert(`成功导入 ${count} 条订单数据`);
    } 
    else if (activeTab === 'settlement') {
        validRows.forEach(row => {
             // Assume format: [OrderId, Amount]
             const orderId = String(row[0] || '').trim();
             const amount = parseFloat(row[1]);

             if (orderId && !isNaN(amount) && orderId !== '关联订单ID') {
                addSettlement({
                    id: Math.random().toString(36).substr(2, 9),
                    orderId: orderId,
                    category: batchSettlementCategory,
                    amount: amount,
                    status: 'Pending',
                    submissionDate: getRandomDateInMonth(batchSettlementMonth)
                });
                count++;
             }
        });
        alert(`成功导入 ${count} 条结算数据`);
    }
    else if (activeTab === 'kpi') {
        validRows.forEach(row => {
             // Logic depends on metric
             const techIdentifier = String(row[0] || '').trim();
             // Skip header
             if (!techIdentifier || techIdentifier.includes('师傅')) return;

             const tech = technicians.find(t => t.name === techIdentifier || t.id === techIdentifier);
             
             if (tech) {
                const basePayload = {
                  technicianId: tech.id,
                  period: batchKPIMonth,
                };
                let payload = {};

                if (batchKPIMetric === 'ALL' && row.length >= 5) {
                    payload = {
                      satisfactionScore: parseFloat(row[1]) || 0,
                      completionRate: parseFloat(row[2]) || 0,
                      timelinessRate: parseFloat(row[3]) || 0,
                      complianceScore: parseFloat(row[4]) || 0
                    };
                } else {
                     const val = parseFloat(row[1]) || 0;
                     if (batchKPIMetric === 'SATISFACTION') payload = { satisfactionScore: val };
                     else if (batchKPIMetric === 'COMPLETION') payload = { completionRate: val };
                     else if (batchKPIMetric === 'TIMELINESS') payload = { timelinessRate: val };
                     else if (batchKPIMetric === 'COMPLIANCE') payload = { complianceScore: val };
                }

                if (Object.keys(payload).length > 0) {
                    upsertKPI({ ...basePayload, ...payload });
                    count++;
                }
             } else {
                 errors++;
             }
        });
        let msg = `成功更新 ${count} 条KPI数据`;
        if (errors > 0) msg += `，有 ${errors} 条因找不到师傅信息被忽略`;
        alert(msg);
    }
    else if (activeTab === 'part') {
        validRows.forEach(row => {
             // Assume format: [OrderId, Quantity, Price]
             const orderId = String(row[0] || '').trim();
             const qty = parseFloat(row[1]);
             const price = parseFloat(row[2]);

             if (orderId && !isNaN(qty) && orderId !== '关联订单ID') {
                 addPartSale({
                    id: Math.random().toString(36).substr(2, 9),
                    orderId: orderId,
                    partType: batchPartType,
                    quantity: qty,
                    pricePerUnit: isNaN(price) ? 0 : price,
                    total: qty * (isNaN(price) ? 0 : price),
                    date: getRandomDateInMonth(batchPartMonth)
                });
                count++;
             }
        });
        alert(`成功导入 ${count} 条配件销售数据`);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      id: Math.random().toString(36).substr(2, 9),
      ...orderForm,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    });
    alert('订单添加成功');
    setOrderForm({ ...orderForm, orderNumber: '', customerName: '', address: '' });
  };

  const handleBatchOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) {
      alert('请输入或粘贴数据');
      return;
    }
    // Reuse parser logic for text area by converting lines to array of arrays
    const rows = batchText.split('\n').map(line => line.split(/,|，|\t/));
    processUploadedData(rows);
    setBatchText('');
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSettlement({
      id: Math.random().toString(36).substr(2, 9),
      ...settlementForm,
      status: 'Pending',
      submissionDate: new Date().toISOString().split('T')[0]
    });
    alert('结算单提交成功');
    setSettlementForm({ ...settlementForm, amount: 0 });
  };

  const handleBatchSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchSettlementText.trim()) {
      alert('请输入或粘贴数据');
      return;
    }
    const rows = batchSettlementText.split('\n').map(line => line.split(/,|，|\t/));
    processUploadedData(rows);
    setBatchSettlementText('');
  };

  const handleKPISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertKPI({
      technicianId: kpiForm.technicianId,
      period: kpiForm.period,
      satisfactionScore: Number(kpiForm.satisfaction),
      completionRate: Number(kpiForm.completion),
      timelinessRate: Number(kpiForm.timeliness),
      complianceScore: Number(kpiForm.compliance)
    });
    alert('KPI 数据保存成功');
  };

  const handleBatchKPISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchKPIText.trim()) {
      alert('请输入或粘贴数据');
      return;
    }
    const rows = batchKPIText.split('\n').map(line => line.split(/,|，|\t/));
    processUploadedData(rows);
    setBatchKPIText('');
  };

  const handlePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartSale({
      id: Math.random().toString(36).substr(2, 9),
      orderId: partForm.orderId,
      partType: partForm.type,
      quantity: Number(partForm.quantity),
      pricePerUnit: Number(partForm.price),
      total: Number(partForm.quantity) * Number(partForm.price),
      date: new Date().toISOString().split('T')[0]
    });
    alert('配件销售记录添加成功');
  };

  const handleBatchPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchPartText.trim()) {
      alert('请输入或粘贴数据');
      return;
    }
    const rows = batchPartText.split('\n').map(line => line.split(/,|，|\t/));
    processUploadedData(rows);
    setBatchPartText('');
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        activeTab === id 
        ? 'border-red-600 text-red-600 bg-white' 
        : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const getKPIPlaceholder = () => {
    switch (batchKPIMetric) {
      case 'ALL': return `张伟, 9.8, 100, 99, 100\n李强, 9.5, 98, 97, 95`;
      case 'SATISFACTION': return `张伟, 9.8\n李强, 9.5`;
      case 'COMPLETION': return `张伟, 100\n李强, 98`;
      case 'TIMELINESS': return `张伟, 99\n李强, 97`;
      case 'COMPLIANCE': return `张伟, 100\n李强, 95`;
      default: return '';
    }
  };

  const getKPILabel = () => {
    switch (batchKPIMetric) {
      case 'ALL': return '师傅, 满意度, 完成率, 及时率, 规范评分';
      case 'SATISFACTION': return '师傅, 满意度 (0-10)';
      case 'COMPLETION': return '师傅, 完成率 (%)';
      case 'TIMELINESS': return '师傅, 及时率 (%)';
      case 'COMPLIANCE': return '师傅, 规范评分';
      default: return '';
    }
  };

  return (
    <Layout>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".csv, .xlsx, .xls"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">上传数据</h1>
        <p className="text-gray-500">录入订单、结算、KPI及配件信息</p>
      </div>

      <div className="border-b border-gray-200 mb-6 flex gap-2">
        <TabButton id="order" label="下单明细" />
        <TabButton id="settlement" label="结算明细" />
        <TabButton id="kpi" label="KPI明细" />
        <TabButton id="part" label="配件销售" />
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        {activeTab === 'order' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">录入新订单 (安装/维修)</h2>
              <button 
                onClick={() => setOrderEntryMode(prev => prev === 'single' ? 'batch' : 'single')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
              >
                <ArrowRightLeft size={16} />
                {orderEntryMode === 'single' ? '切换批量上传' : '切换单条录入'}
              </button>
            </div>

            {orderEntryMode === 'single' ? (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">订单号</label>
                    <input type="text" required className="w-full p-2 border rounded" value={orderForm.orderNumber} onChange={e => setOrderForm({...orderForm, orderNumber: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                    <select className="w-full p-2 border rounded" value={orderForm.type} onChange={e => setOrderForm({...orderForm, type: e.target.value as OrderType})}>
                      <option value={OrderType.INSTALLATION}>安装</option>
                      <option value={OrderType.REPAIR}>维修</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户姓名</label>
                    <input type="text" required className="w-full p-2 border rounded" value={orderForm.customerName} onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <input type="text" required className="w-full p-2 border rounded" value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">指派师傅</label>
                    <select className="w-full p-2 border rounded" value={orderForm.technicianId} onChange={e => setOrderForm({...orderForm, technicianId: e.target.value})}>
                      {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">提交订单</button>
              </form>
            ) : (
              <form onSubmit={handleBatchOrderSubmit} className="space-y-6">
                 <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                    <Info className="shrink-0 mt-0.5" size={18} />
                    <p>批量模式用于快速导入京东后台导出的 Excel 数据。请先选择归属月份和业务类型。</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">归属月份</label>
                      <input 
                        type="month" 
                        required 
                        className="w-full p-2 border rounded"
                        value={batchMonth}
                        onChange={e => setBatchMonth(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">业务类型</label>
                      <select 
                        className="w-full p-2 border rounded" 
                        value={batchType} 
                        onChange={e => setBatchType(e.target.value as OrderType)}
                      >
                        <option value={OrderType.INSTALLATION}>安装服务</option>
                        <option value={OrderType.REPAIR}>维修服务</option>
                      </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据录入 (支持直接粘贴或通过上方按钮加载文件)
                    </label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded font-mono text-sm"
                      placeholder={`JD202311001, 张三, 北京市朝阳区...\nJD202311002, 李四, 上海市浦东新区...`}
                      value={batchText}
                      onChange={e => setBatchText(e.target.value)}
                    ></textarea>
                 </div>

                 <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                    <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 font-medium">点击上传 Excel/CSV 文件</p>
                    <p className="text-xs text-gray-400 mt-1">文件内容将自动填充至上方输入框</p>
                 </div>

                 <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex justify-center items-center gap-2">
                   <FileText size={18} />
                   执行批量导入
                 </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'settlement' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">提交结算申请 (3C/家电)</h2>
              <button 
                onClick={() => setSettlementEntryMode(prev => prev === 'single' ? 'batch' : 'single')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
              >
                <ArrowRightLeft size={16} />
                {settlementEntryMode === 'single' ? '切换批量上传' : '切换单条录入'}
              </button>
            </div>

            {settlementEntryMode === 'single' ? (
              <form onSubmit={handleSettlementSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关联订单ID</label>
                  <input type="text" required className="w-full p-2 border rounded" value={settlementForm.orderId} onChange={e => setSettlementForm({...settlementForm, orderId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结算类别</label>
                  <select className="w-full p-2 border rounded" value={settlementForm.category} onChange={e => setSettlementForm({...settlementForm, category: e.target.value as SettlementType})}>
                    <option value={SettlementType.CATEGORY_3C}>3C数码</option>
                    <option value={SettlementType.APPLIANCE}>家用电器</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结算金额 (¥)</label>
                  <input type="number" required className="w-full p-2 border rounded" value={settlementForm.amount} onChange={e => setSettlementForm({...settlementForm, amount: Number(e.target.value)})} />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">提交结算</button>
              </form>
            ) : (
              <form onSubmit={handleBatchSettlementSubmit} className="space-y-6">
                 <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                    <Info className="shrink-0 mt-0.5" size={18} />
                    <p>批量模式用于快速导入结算单据。请先选择归属月份和结算类别。</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">归属月份</label>
                      <input 
                        type="month" 
                        required 
                        className="w-full p-2 border rounded"
                        value={batchSettlementMonth}
                        onChange={e => setBatchSettlementMonth(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">结算类别</label>
                      <select 
                        className="w-full p-2 border rounded" 
                        value={batchSettlementCategory} 
                        onChange={e => setBatchSettlementCategory(e.target.value as SettlementType)}
                      >
                        <option value={SettlementType.CATEGORY_3C}>3C数码</option>
                        <option value={SettlementType.APPLIANCE}>家用电器</option>
                      </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据录入 (支持直接粘贴或通过上方按钮加载文件)
                    </label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded font-mono text-sm"
                      placeholder={`JD202311001, 150\nJD202311002, 200`}
                      value={batchSettlementText}
                      onChange={e => setBatchSettlementText(e.target.value)}
                    ></textarea>
                 </div>

                 <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                    <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 font-medium">点击上传 Excel/CSV 文件</p>
                    <p className="text-xs text-gray-400 mt-1">文件内容将自动填充至上方输入框</p>
                 </div>

                 <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex justify-center items-center gap-2">
                   <FileText size={18} />
                   执行批量导入
                 </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'kpi' && (
           <div>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold">KPI 数据录入</h2>
               <button 
                onClick={() => setKpiEntryMode(prev => prev === 'single' ? 'batch' : 'single')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
               >
                <ArrowRightLeft size={16} />
                {kpiEntryMode === 'single' ? '切换批量上传' : '切换单条录入'}
               </button>
             </div>

             {kpiEntryMode === 'single' ? (
                <form onSubmit={handleKPISubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">师傅</label>
                       <select className="w-full p-2 border rounded" value={kpiForm.technicianId} onChange={e => setKpiForm({...kpiForm, technicianId: e.target.value})}>
                         {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">月份 (YYYY-MM)</label>
                       <input type="month" required className="w-full p-2 border rounded" value={kpiForm.period} onChange={e => setKpiForm({...kpiForm, period: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">满意度 (0-10)</label>
                      <input type="number" step="0.1" max="10" className="w-full p-2 border rounded" value={kpiForm.satisfaction} onChange={e => setKpiForm({...kpiForm, satisfaction: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">完成率 (%)</label>
                      <input type="number" max="100" className="w-full p-2 border rounded" value={kpiForm.completion} onChange={e => setKpiForm({...kpiForm, completion: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">及时率 (%)</label>
                      <input type="number" max="100" className="w-full p-2 border rounded" value={kpiForm.timeliness} onChange={e => setKpiForm({...kpiForm, timeliness: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">规范评分</label>
                      <input type="number" max="100" className="w-full p-2 border rounded" value={kpiForm.compliance} onChange={e => setKpiForm({...kpiForm, compliance: Number(e.target.value)})} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">保存 KPI</button>
                </form>
             ) : (
                <form onSubmit={handleBatchKPISubmit} className="space-y-6">
                 <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                    <Info className="shrink-0 mt-0.5" size={18} />
                    <p>批量模式用于快速导入多位师傅的月度考核数据。请确保输入格式正确。</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">考核月份</label>
                      <input 
                        type="month" 
                        required 
                        className="w-full p-2 border rounded"
                        value={batchKPIMonth}
                        onChange={e => setBatchKPIMonth(e.target.value)}
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">数据类型</label>
                      <select 
                        className="w-full p-2 border rounded" 
                        value={batchKPIMetric} 
                        onChange={e => setBatchKPIMetric(e.target.value as any)}
                      >
                        <option value="ALL">综合 (全部指标)</option>
                        <option value="SATISFACTION">满意度</option>
                        <option value="COMPLETION">完成率</option>
                        <option value="TIMELINESS">及时率</option>
                        <option value="COMPLIANCE">规范评分</option>
                      </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据录入 (支持直接粘贴或通过上方按钮加载文件)
                    </label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded font-mono text-sm"
                      placeholder={getKPIPlaceholder()}
                      value={batchKPIText}
                      onChange={e => setBatchKPIText(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">注：支持输入师傅姓名或工号（如 T001）。数据间请用逗号或制表符分隔。</p>
                 </div>

                 <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                    <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 font-medium">点击上传 Excel/CSV 文件</p>
                    <p className="text-xs text-gray-400 mt-1">文件内容将自动填充至上方输入框</p>
                 </div>

                 <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex justify-center items-center gap-2">
                   <FileText size={18} />
                   执行批量导入
                 </button>
              </form>
             )}
           </div>
        )}

        {activeTab === 'part' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">配件销售录入</h2>
              <button 
                onClick={() => setPartEntryMode(prev => prev === 'single' ? 'batch' : 'single')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
              >
                <ArrowRightLeft size={16} />
                {partEntryMode === 'single' ? '切换批量上传' : '切换单条录入'}
              </button>
            </div>

            {partEntryMode === 'single' ? (
              <form onSubmit={handlePartSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关联订单ID</label>
                  <input type="text" required className="w-full p-2 border rounded" value={partForm.orderId} onChange={e => setPartForm({...partForm, orderId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配件类型</label>
                  <select className="w-full p-2 border rounded" value={partForm.type} onChange={e => setPartForm({...partForm, type: e.target.value as PartType})}>
                    <option value={PartType.ORIGINAL_BATTERY}>原装电池</option>
                    <option value={PartType.NON_ORIGINAL_BATTERY}>非原厂电池</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                    <input type="number" required className="w-full p-2 border rounded" value={partForm.quantity} onChange={e => setPartForm({...partForm, quantity: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单价 (¥)</label>
                    <input type="number" required className="w-full p-2 border rounded" value={partForm.price} onChange={e => setPartForm({...partForm, price: Number(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">提交销售单</button>
              </form>
            ) : (
               <form onSubmit={handleBatchPartSubmit} className="space-y-6">
                 <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                    <Info className="shrink-0 mt-0.5" size={18} />
                    <p>批量模式用于快速导入配件销售记录。请先选择归属月份和配件类型。</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">销售月份</label>
                      <input 
                        type="month" 
                        required 
                        className="w-full p-2 border rounded"
                        value={batchPartMonth}
                        onChange={e => setBatchPartMonth(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">配件类型</label>
                      <select 
                        className="w-full p-2 border rounded" 
                        value={batchPartType} 
                        onChange={e => setBatchPartType(e.target.value as PartType)}
                      >
                        <option value={PartType.ORIGINAL_BATTERY}>原装电池</option>
                        <option value={PartType.NON_ORIGINAL_BATTERY}>非原厂电池</option>
                      </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据录入 (支持直接粘贴或通过上方按钮加载文件)
                    </label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded font-mono text-sm"
                      placeholder={`JD202311001, 1, 299\nJD202311002, 2, 150`}
                      value={batchPartText}
                      onChange={e => setBatchPartText(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">注：数据间请用逗号或制表符分隔。</p>
                 </div>

                 <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                 >
                    <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 font-medium">点击上传 Excel/CSV 文件</p>
                    <p className="text-xs text-gray-400 mt-1">文件内容将自动填充至上方输入框</p>
                 </div>

                 <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex justify-center items-center gap-2">
                   <FileText size={18} />
                   执行批量导入
                 </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Entry;