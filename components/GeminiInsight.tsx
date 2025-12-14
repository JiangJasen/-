import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface GeminiInsightProps {
  title?: string;
  fetchInsight: () => Promise<string>;
  dependencies?: any[];
}

const GeminiInsight: React.FC<GeminiInsightProps> = ({ title = "智能分析", fetchInsight, dependencies = [] }) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    const result = await fetchInsight();
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
          <Sparkles size={18} />
          <h3>{title}</h3>
        </div>
        <button 
          onClick={load} 
          disabled={loading}
          className="text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="prose prose-sm text-gray-700 max-w-none">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} />
        )}
      </div>
    </div>
  );
};

export default GeminiInsight;