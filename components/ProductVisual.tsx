import React from 'react';
import { Shield, Server, FileCheck, Cpu, Zap, Check, AlertCircle, Terminal } from 'lucide-react';

/** Animated "architecture view" illustration used on the product pages. */
const ProductVisual: React.FC<{ type: string }> = ({ type }) => {
  // Inject custom styles for animations
  const styles = (
    <style>{`
      @keyframes radar-sweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes scan-line {
        0% { transform: translateY(-100%); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(400%); opacity: 0; }
      }
      @keyframes flow {
        to { stroke-dashoffset: -20; }
      }
      .animate-radar-sweep {
        animation: radar-sweep 3s linear infinite;
      }
      .animate-scan-line {
        animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .animate-flow {
        animation: flow 1s linear infinite;
      }
    `}</style>
  );

  if (type === 'radar') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {styles}
        {/* Radar Background Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #39FF14 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Concentric Circles */}
        <div className="absolute w-48 h-48 border border-nixGreen/20 rounded-full"></div>
        <div className="absolute w-72 h-72 border border-nixGreen/10 rounded-full"></div>

        {/* Radar Sweep Effect */}
        <div className="absolute w-full h-full animate-radar-sweep origin-center flex items-center justify-center pointer-events-none">
           <div className="w-1/2 h-full absolute right-1/2 bg-gradient-to-l from-nixGreen/10 to-transparent transform origin-right" style={{ clipPath: 'polygon(100% 0, 100% 50%, 0 0)' }}></div>
        </div>
        
        {/* Central Hub */}
        <div className="relative z-10 w-20 h-20 bg-slate-800 rounded-full border border-nixGreen flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <Shield size={32} className="text-nixGreen" />
          <div className="absolute inset-0 rounded-full border border-nixGreen opacity-50 animate-ping"></div>
        </div>

        {/* Orbiting Nodes (Threats) */}
        <div className="absolute top-1/4 left-1/4 animate-bounce duration-1000">
           <div className="relative group">
             <div className="w-8 h-8 bg-slate-800 border border-red-500 rounded flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.4)]">
               <AlertCircle size={14} className="text-red-500" />
             </div>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-mono bg-slate-900 px-1 border border-red-500/30 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
               CVE-2024-99
             </div>
           </div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/4">
           <div className="w-8 h-8 bg-slate-800 border border-slate-600 rounded flex items-center justify-center group hover:border-nixGreen transition-colors">
             <Server size={14} className="text-slate-400 group-hover:text-nixGreen" />
           </div>
           <div className="text-[10px] text-green-500 mt-1 font-mono flex items-center bg-slate-800/80 px-1 rounded"><Check size={8} className="mr-1"/> Secure</div>
        </div>
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-8">
        {styles}
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-nixBlue shadow-[0_0_15px_#0A4A8F] animate-scan-line z-20"></div>
        
        <div className="w-full max-w-xs space-y-3 z-10 relative">
          <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
            <span>CONFIG_CHECK</span>
            <span>STATUS</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800 p-3 rounded border-l-4 border-nixBlue group hover:bg-slate-700 transition-colors">
              <div className="flex items-center">
                <FileCheck size={16} className="text-slate-400 mr-3 group-hover:text-nixBlue transition-colors" />
                <span className="text-sm text-slate-200 font-mono">CIS_L1_Rule_{100 + i}</span>
              </div>
              <span 
                className="flex items-center text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded animate-fade-in"
                style={{ animationDelay: `${i * 400}ms` }}
              >
                <Check size={10} className="mr-1" /> PASS
              </span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-700">
             <div className="flex items-center text-xs text-slate-500 animate-pulse">
               <Terminal size={12} className="mr-2" />
               <span className="font-mono text-nixBlue">Generating audit_report_v2.pdf...</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'network') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {styles}
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#FFA500 1px, transparent 1px), linear-gradient(90deg, #FFA500 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Nodes */}
        <div className="grid grid-cols-3 gap-12 relative z-10">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="relative group">
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-500 z-10 relative bg-slate-900 ${i === 2 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-600 hover:border-nixOrange'}`}>
                 <Cpu size={20} className={i === 2 ? 'text-red-500' : 'text-slate-400 group-hover:text-nixOrange'} />
               </div>
               
               {/* Self-Healing Animation for Node 2 */}
               {i === 2 && (
                 <div className="absolute -top-3 -right-3 bg-nixOrange rounded-full p-1.5 animate-bounce shadow-lg shadow-orange-500/50 z-20">
                   <Zap size={12} className="text-white" />
                 </div>
               )}
             </div>
           ))}
        </div>
        
        {/* Connection Lines with Data Flow */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
           {/* Line 1 */}
           <path d="M110 120 L240 120 L240 180" stroke="#334155" strokeWidth="2" fill="none" />
           <path d="M110 120 L240 120 L240 180" stroke="#FFA500" strokeWidth="2" fill="none" strokeDasharray="5,10" className="animate-flow opacity-50" />
           
           {/* Line 2 */}
           <path d="M260 140 L160 260" stroke="#334155" strokeWidth="2" fill="none" />
           <path d="M260 140 L160 260" stroke="#FFA500" strokeWidth="2" fill="none" strokeDasharray="5,10" className="animate-flow opacity-50" style={{ animationDuration: '1.5s' }} />

           {/* Line 3 */}
           <path d="M380 120 L280 120" stroke="#334155" strokeWidth="2" fill="none" />
        </svg>

        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded text-xs font-mono text-nixOrange shadow-lg">
           <span className="animate-pulse">{">"} Agent_02: Auto-restart triggered</span>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductVisual;
