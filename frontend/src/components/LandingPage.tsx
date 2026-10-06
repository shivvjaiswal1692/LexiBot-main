import { Scale, Shield, BookOpen, ChevronRight, Zap, Lock, MessageSquare, Star } from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
  onHowItWorks: () => void;
}

const LEGAL_TOPICS = [
  { icon: '⚖️', label: 'Criminal Law',       desc: 'Arrests, charges & defense' },
  { icon: '📋', label: 'Civil Law',           desc: 'Disputes & compensation' },
  { icon: '🏢', label: 'Corporate Law',       desc: 'Business & contracts' },
  { icon: '👨‍👩‍👧', label: 'Family Law',     desc: 'Divorce & custody' },
  { icon: '🏠', label: 'Property Law',        desc: 'Real estate & tenancy' },
  { icon: '🛡️', label: 'Rights & Liberties', desc: 'Constitutional protections' },
];

const FEATURES = [
  { icon: Zap,           title: 'Instant Answers',  desc: 'Get structured legal guidance in seconds, not days.' },
  { icon: Lock,          title: 'Confidential',      desc: 'Your questions stay private. No data sharing.' },
  { icon: MessageSquare, title: 'Natural Language',  desc: 'Ask in plain English — no legal jargon needed.' },
];

const STATS = [
  { value: '50+',  label: 'Legal Topics' },
  { value: '24/7', label: 'Availability' },
  { value: '< 3s', label: 'Response Time' },
];

export function LandingPage({ onStartChat, onHowItWorks }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-blue-950">LexiBot</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={onHowItWorks} className="hover:text-blue-600 transition-colors">How it works</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onStartChat} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-2">Sign In</button>
            <button onClick={onStartChat} className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5">
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 pt-20 pb-24">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-7 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-slow" />
            AI-Powered Legal Intelligence · Powered by Hugging Face
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-950 leading-tight mb-6 animate-slide-up">
            Your Personal{' '}
            <span className="text-blue-600">Legal Advisor</span>
            <br className="hidden md:block" /> Available 24/7
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Ask complex legal questions in plain language and receive structured, accurate answers.
            From criminal defense to corporate contracts — LexiBot knows the law.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button onClick={onStartChat} className="btn-primary text-base px-9 py-3.5 flex items-center gap-2 shadow-lg">
              Start Chatting Free <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onHowItWorks} className="btn-outline text-base">See how it works</button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-blue-700">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-blue-100 bg-blue-50/60 py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
          {[
            { icon: Shield,   text: 'Bank-level security'      },
            { icon: BookOpen, text: 'Covers all legal domains'  },
            { icon: Lock,     text: '100% confidential'         },
            { icon: Star,     text: 'Trusted by thousands'      },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-blue-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Topics */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-950 mb-3">Legal Topics Covered</h2>
          <p className="text-slate-500">Click a topic to start a focused legal conversation</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {LEGAL_TOPICS.map((topic) => (
            <button
              key={topic.label}
              onClick={onStartChat}
              className="group card hover:border-blue-200 hover:shadow-md p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{topic.icon}</div>
              <div className="font-semibold text-blue-900 group-hover:text-blue-600 transition-colors text-sm">{topic.label}</div>
              <div className="text-slate-400 text-xs mt-1">{topic.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 mb-3">Why Choose LexiBot?</h2>
            <p className="text-slate-500">Built for clarity, speed, and trust</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-4">Ready to get legal clarity?</h2>
          <p className="relative text-blue-100 mb-8 text-lg">No appointments. No hourly fees. Just clear answers.</p>
          <button onClick={onStartChat} className="relative bg-white text-blue-700 font-bold px-10 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base">
            Start Your Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-slate-50 px-6 py-8 text-center text-slate-400 text-xs">
        <p className="mb-1">⚠️ LexiBot provides legal information, not legal advice. Always consult a qualified attorney for your specific situation.</p>
        <p>© 2024 LexiBot. All rights reserved.</p>
      </footer>
    </div>
  );
}
