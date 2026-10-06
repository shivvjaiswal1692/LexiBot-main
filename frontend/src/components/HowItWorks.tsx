import { X, MessageSquare, Brain, Shield, Scale } from 'lucide-react';

interface HowItWorksProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: MessageSquare, step: '01', title: 'Ask Your Question',   desc: 'Type your legal question in plain, everyday language. No legal jargon required.' },
  { icon: Brain,         step: '02', title: 'AI Analysis',         desc: 'LexiBot analyzes your question using Grok AI, categorizing it by legal domain for precise answers.' },
  { icon: Scale,         step: '03', title: 'Structured Answer',   desc: 'Receive a clear, well-structured response covering relevant laws, rights, and procedures.' },
  { icon: Shield,        step: '04', title: 'Stay Informed',       desc: "Use the information to understand your situation. For complex matters, consult a licensed attorney." },
];

export function HowItWorks({ open, onClose }: HowItWorksProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl card shadow-2xl rounded-3xl p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-950 mb-2">How LexiBot Works</h2>
          <p className="text-slate-500 text-sm">AI-powered legal guidance in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex-shrink-0 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-blue-300 mt-1">{step}</span>
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-xs text-amber-700 text-center leading-relaxed">
            <span className="font-semibold">⚠️ Important: </span>
            LexiBot provides legal information and education, not legal advice. The information provided
            does not create an attorney-client relationship. Always consult a qualified attorney.
          </p>
        </div>
      </div>
    </div>
  );
}
