import React from 'react';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { showToast } from './UI/Toast';
import { Trophy, Printer, Share2, Award } from 'lucide-react';

interface CertificateViewProps {
  userName: string;
  topicName: string;
  dateCompleted: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  userName,
  topicName,
  dateCompleted
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Simulate Cloudinary URL generation
    const mockCloudinaryUrl = `https://res.cloudinary.com/learnforge/image/upload/v172118320/certificates/cert_${userName.replace(/\s+/g, '_')}.pdf`;
    navigator.clipboard.writeText(mockCloudinaryUrl);
    showToast('Mock Cloudinary certificate URL copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <h3 className="font-outfit font-bold text-lg text-white">Generate Certification</h3>
        <div className="flex gap-2">
          <Button variant="glass" size="sm" onClick={handleShare} className="text-xs flex items-center gap-1.5">
            <Share2 size={13} /> Share Link
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint} className="text-xs flex items-center gap-1.5">
            <Printer size={13} /> Export / Print
          </Button>
        </div>
      </div>

      {/* Certificate Plate */}
      <Card 
        className="relative p-12 md:p-16 border-2 border-primary/30 rounded-3xl bg-gradient-to-b from-slate-950 via-[#0b0821] to-slate-950 text-center overflow-hidden shadow-neon"
        hoverEffect={false}
      >
        {/* Certificate Watermark Radial Grid */}
        <div className="absolute inset-0 grid-glow opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary/30 m-4 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-primary/30 m-4 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-primary/30 m-4 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary/30 m-4 rounded-br-2xl pointer-events-none" />

        {/* Certificate Details */}
        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-neon">
              <Award size={36} />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-outfit font-bold tracking-widest text-primary-light text-xs md:text-sm uppercase">
              Certificate of Academic Excellence
            </h4>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          <div className="space-y-4">
            <p className="text-zinc-400 font-serif italic text-sm md:text-base">This credentials is proud presented to</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-outfit text-white tracking-tight leading-none bg-gradient-to-r from-white via-primary-light to-secondary bg-clip-text text-transparent">
              {userName}
            </h2>
          </div>

          <p className="text-zinc-400 font-serif italic text-sm md:text-base">
            for successfully finishing all required syllabus nodes and assessment tasks in the course
          </p>

          <h3 className="text-xl md:text-2xl font-bold font-outfit text-white leading-snug">
            "{topicName}"
          </h3>

          <p className="text-zinc-500 text-xs md:text-sm font-light">
            Authorized and issued on {new Date(dateCompleted).toLocaleDateString()} via LearnForge AI Agent Aggregator engine.
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 max-w-md mx-auto items-end text-xs font-mono text-zinc-500">
            <div className="space-y-2">
              <div className="font-serif italic text-primary-light text-sm select-none border-b border-white/10 pb-1">
                Neuro Agent Selector
              </div>
              <div>ORCHESTRATOR SIGNATURE</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif italic text-secondary-light text-sm select-none border-b border-white/10 pb-1">
                Gemini-1.5-Flash
              </div>
              <div>VERIFY SYSTEM TIMESTAMP</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default CertificateView;
