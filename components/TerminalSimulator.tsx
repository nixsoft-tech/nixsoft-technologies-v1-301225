import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Play } from 'lucide-react';

const TerminalSimulator: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const command = "nixops deploy --target=aws --secure=true";
  
  const simulationSteps = [
    { text: "> Authenticating with AWS IAM...", delay: 600, type: 'info' },
    { text: "> IAM Token verified. Initializing Terraform state...", delay: 1200, type: 'info' },
    { text: "> Scanning configuration for vulnerabilities (VulnGuard™)...", delay: 1800, type: 'info' },
    { text: "> [PASS] 0 critical CVEs found. CIS benchmarks met.", delay: 2600, type: 'success' },
    { text: "> Provisioning EKS Cluster (1.29) across 3 AZs...", delay: 3500, type: 'info' },
    { text: "> Configuring ALB and WAF rules...", delay: 4500, type: 'info' },
    { text: "> Applying Zero-Trust Network Policies...", delay: 5200, type: 'info' },
    { text: "> Deployment successful! Time: 4m 12s", delay: 6000, type: 'success' }
  ];

  const startSimulation = () => {
    setHasStarted(true);
    setIsTyping(true);
    setLines([]);
    
    // Type command
    let currentCommand = '';
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < command.length) {
        currentCommand += command[charIndex];
        setLines([currentCommand]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        runOutput();
      }
    }, 50);

    // Show output
    const runOutput = () => {
      simulationSteps.forEach((step) => {
        setTimeout(() => {
          setLines(prev => {
            const newLines = [...prev];
            if (newLines[0] === command) {
               newLines[0] = `$ ${command}`; // Keep command at top
            }
            return [...newLines, step.text];
          });
        }, step.delay);
      });
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Mac/Ubuntu style Window Header */}
      <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-xs font-mono text-slate-400 flex items-center justify-center">
          <Terminal size={14} className="mr-2" />
          nixops-cli ~ /production
        </div>
        {!hasStarted && (
           <button onClick={startSimulation} className="text-nixGreen hover:text-green-400 transition-colors flex items-center text-xs font-bold uppercase tracking-wider">
             <Play size={12} className="mr-1" /> Run
           </button>
        )}
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm min-h-[300px] flex flex-col justify-end">
        {!hasStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
             <Terminal size={40} className="mb-4 opacity-50" />
             <p className="mb-4">Ready to deploy secure infrastructure.</p>
             <button onClick={startSimulation} className="px-6 py-2 bg-nixGreen text-slate-900 font-bold rounded-lg hover:bg-green-400 transition-all">
                Start Simulation
             </button>
          </div>
        ) : (
          <div className="space-y-2">
            {lines.map((line, index) => {
               // Determine styling based on content
               let color = 'text-slate-300';
               if (line.includes('[PASS]') || line.includes('successful')) color = 'text-green-400 font-bold';
               if (line.includes('vulnerabilities') || line.includes('Zero-Trust')) color = 'text-nixOrange';
               if (line.startsWith('$')) color = 'text-nixBlue font-bold';
               
               return (
                 <div key={index} className={`${color} animate-fade-in-up flex`}>
                   {line.includes('successful') && <CheckCircle2 size={16} className="mr-2 inline-block text-green-400 mt-0.5" />}
                   <span>{line}</span>
                   {index === 0 && isTyping && <span className="w-2 h-4 bg-slate-400 inline-block ml-1 animate-pulse"></span>}
                 </div>
               );
            })}
            {lines.length > 0 && !isTyping && lines.length <= simulationSteps.length && (
              <div className="text-slate-500 animate-pulse mt-2">_</div>
            )}
            {lines.length > simulationSteps.length && (
              <div className="mt-4 text-nixGreen flex items-center">
                 <span className="mr-2">$</span> <span className="w-2 h-4 bg-nixGreen inline-block animate-pulse"></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalSimulator;
