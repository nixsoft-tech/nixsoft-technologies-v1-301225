import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, Server, DollarSign } from 'lucide-react';
import { ROI_CONSTANTS } from '../constants';

const ROICalculator: React.FC = () => {
  const [servers, setServers] = useState<number>(50);
  const [cloudSpend, setCloudSpend] = useState<number>(20000);
  const [savings, setSavings] = useState<number>(0);
  
  const SAVINGS_RATE = ROI_CONSTANTS.SAVINGS_RATE; 
  const MAINTENANCE_SAVINGS_PER_SERVER = ROI_CONSTANTS.MAINTENANCE_SAVINGS_PER_SERVER;

  useEffect(() => {
    // Calculate total annual savings
    const annualCloudSavings = (cloudSpend * 12) * SAVINGS_RATE;
    const annualMaintenanceSavings = servers * MAINTENANCE_SAVINGS_PER_SERVER;
    
    // Animate the number counting up
    const targetSavings = annualCloudSavings + annualMaintenanceSavings;
    let current = 0;
    const increment = targetSavings / 20; // 20 frames
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetSavings) {
        setSavings(targetSavings);
        clearInterval(interval);
      } else {
        setSavings(current);
      }
    }, 20);
    
    return () => clearInterval(interval);
  }, [servers, cloudSpend]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-nixBlue p-6 text-white text-center">
        <Calculator className="mx-auto mb-3 text-nixGreen" size={32} />
        <h3 className="text-2xl font-bold mb-1">ROI & TCO Calculator</h3>
        <p className="text-blue-200 text-sm">See how much you save with Open-Source Automation</p>
      </div>
      
      <div className="p-8">
        {/* Sliders */}
        <div className="space-y-8 mb-10">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Server size={16} className="mr-2 text-nixBlue" />
                Number of Servers/Instances
              </label>
              <span className="font-bold text-nixBlue">{servers}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={servers} 
              onChange={(e) => setServers(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nixGreen"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <DollarSign size={16} className="mr-2 text-nixBlue" />
                Monthly Cloud Spend
              </label>
              <span className="font-bold text-nixBlue">{formatCurrency(cloudSpend)}/mo</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="100000" 
              step="1000"
              value={cloudSpend} 
              onChange={(e) => setCloudSpend(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nixGreen"
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-slate-50 rounded-xl p-6 border border-gray-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-nixGreen opacity-10 rounded-bl-full transform transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-sm text-slate-500 font-semibold mb-2 uppercase tracking-wide">Estimated Annual Savings</span>
            <div className="text-5xl font-extrabold text-nixBlue mb-4 flex items-center justify-center">
               {formatCurrency(savings)}
            </div>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Based on an average <strong className="text-nixGreen font-bold">40% reduction</strong> in cloud waste and automated maintenance overhead.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ROICalculator;
