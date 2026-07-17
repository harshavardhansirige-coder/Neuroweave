import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Progress } from '../UI/Progress';
import { CertificateView } from '../CertificateView';
import { 
  Award, 
  FileText, 
  ChevronRight, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Clipboard,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const [selectedCertTab, setSelectedCertTab] = useState(false);

  const assessmentsHistory = [
    {
      title: "Rust Asynchronous Pipeline Assessment",
      type: "Coding & Concepts",
      date: "2026-07-15",
      score: "92%",
      status: "Passed",
      agentRemark: "Excellent async mutex locking scope implementation. Some minor latency gaps on channel receiver handles."
    },
    {
      title: "React Compiler Optimization Mock Exam",
      type: "Conceptual MCQ",
      date: "2026-07-10",
      score: "85%",
      status: "Passed",
      agentRemark: "Fully understands Server/Client components boundaries. Recommended: Review hydration performance constraints."
    },
    {
      title: "Multivariable Jacobian Neural Network Exam",
      type: "Mathematical Proof",
      date: "2026-07-01",
      score: "50%",
      status: "Failed",
      agentRemark: "Backpropagation chain rule calculations contains sign multiplication errors. Retake recommended."
    }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit text-white">Evaluations & Achievements</h2>
          <p className="text-sm text-zinc-400 font-light mt-1">Review mock exam transcripts, proctor logs, and print achievement credentials.</p>
        </div>
      </div>

      {!selectedCertTab ? (
        <>
          {/* Stats Board */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-5 flex flex-col justify-between" hoverEffect>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Overall Grade Point</div>
              <div className="text-3xl font-extrabold text-white mt-1">A- (88%)</div>
              <div className="text-[9px] text-zinc-500 mt-2 font-mono">Calculated across 3 complete modules</div>
            </Card>

            <Card className="p-5 flex flex-col justify-between" hoverEffect>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-outfit">Syllabus Certificates</div>
              <div className="text-3xl font-extrabold text-white mt-1">1 Earned</div>
              <div className="text-[9px] text-white mt-2 font-mono flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setSelectedCertTab(true)}>
                <Award size={10} /> View Certificate <ChevronRight size={8} />
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between" hoverEffect>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-outfit">Proctor Warnings</div>
              <div className="text-3xl font-extrabold text-white mt-1">0 Flagged</div>
              <div className="text-[9px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <CheckCircle size={10} /> System clean
              </div>
            </Card>
          </div>

          {/* Assessment Logs Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Historical Exam Records</h3>
            {assessmentsHistory.map((history, idx) => {
              const isPassed = history.status === "Passed";
              return (
                <Card key={idx} className="p-5 space-y-4" hoverEffect={false}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">{history.type}</span>
                        <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1"><Calendar size={10} /> {history.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm leading-snug">{history.title}</h4>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-zinc-500 block uppercase font-bold">Grade</span>
                        <span className={`font-bold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>{history.score}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block uppercase font-bold">Status</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {history.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 text-[11px] text-zinc-400 leading-normal flex items-start gap-2">
                    <AlertCircle size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-semibold">Assessment Agent Diagnostic:</span> {history.agentRemark}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        /* Certificate Viewer Frame */
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedCertTab(false)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Return to list
          </button>
          
          <CertificateView 
            userName="Forge Guest" 
            topicName="Asynchronous Rust Concurrent Pipelines" 
            dateCompleted={new Date().toISOString()} 
          />
        </div>
      )}

    </div>
  );
};

// Simple ChevronLeft fallback if not imported
const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
);

export default AssessmentsPage;
