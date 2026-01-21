import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Shield, MessageSquare, Check, Brain, Globe, Code, PenTool, BarChart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LandingPageProps {
  onStartChat: (initialMessage?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [prompt, setPrompt] = useState('');

  const handleTryIt = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onStartChat(prompt);
    } else {
      onStartChat();
    }
  };

  const useCases = [
    {
      icon: <Code size={20} className="text-blue-500" />,
      title: "Coding Assistant",
      prompt: "Write a React hook for fetching data.",
      response: "const useFetch = (url) => {\n  const [data, setData] = useState(null);\n  // ..."
    },
    {
      icon: <PenTool size={20} className="text-purple-500" />,
      title: "Creative Writing",
      prompt: "Write a haiku about glass.",
      response: "Liquid sand flows free,\nTransparent walls hold the light,\nClarity remains."
    },
    {
      icon: <BarChart size={20} className="text-emerald-500" />,
      title: "Data Analysis",
      prompt: "Summarize Q3 trends.",
      response: "• Revenue: +15% YoY\n• User Growth: Steady\n• Key Driver: Mobile adoption"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-y-auto scrollbar-hide z-20">
      
      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-prism-accent flex items-center justify-center shadow-lg shadow-prism-accent/20">
             <svg viewBox="0 0 512 512" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
                <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
                <line x1="256" y1="32" x2="256" y2="480" />
             </svg>
          </div>
          <span className="font-bold text-xl text-prism-accent tracking-tight">Prism</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-prism-accent transition-colors">Features</a>
          <a href="#demo" className="hover:text-prism-accent transition-colors">Demo</a>
          <a href="#use-cases" className="hover:text-prism-accent transition-colors">Use Cases</a>
          <a href="#pricing" className="hover:text-prism-accent transition-colors">Pricing</a>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => onStartChat()} size="sm">Log in</Button>
          <Button variant="primary" size="sm" onClick={() => onStartChat()} className="shadow-xl shadow-prism-accent/10">Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-white/60 text-prism-accent text-xs font-semibold mb-8 animate-fade-in shadow-sm backdrop-blur-md">
          <Sparkles size={12} className="text-blue-500" />
          <span>Powered by Gemini 3.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tight mb-8 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Clarity in every <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-accent via-blue-600 to-prism-accent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Conversation</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Experience the next generation of AI. Minimalist design, liquid fluidity, and powerful reasoning—designed for clarity.
        </p>
        
        {/* Interactive Demo */}
        <div id="demo" className="w-full max-w-2xl animate-fade-in relative group" style={{ animationDelay: '0.3s' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[2rem] blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <Card className="p-2 pl-3 flex gap-2 items-center bg-white/70 !backdrop-blur-2xl border-white/60 relative">
             <input 
               className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-slate-700 placeholder-slate-400 text-lg"
               placeholder="Ask Prism to write, code, or create..."
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleTryIt(e)}
             />
             <Button onClick={handleTryIt} className="!rounded-2xl px-8 h-12 text-base">
               Start Chatting
             </Button>
          </Card>
          
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm">
             {[
               "Explain Quantum Computing",
               "Write a Python script",
               "Plan a trip to Japan"
             ].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => onStartChat(suggestion)}
                  className="px-4 py-2 rounded-full bg-white/40 border border-white/50 text-slate-600 hover:bg-white/80 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                >
                  {suggestion}
                </button>
             ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 z-10">
         <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { icon: <Zap size={24} className="text-amber-500"/>, title: "Lightning Fast", desc: "Powered by Gemini Flash for instant, low-latency responses." },
                 { icon: <Brain size={24} className="text-blue-500"/>, title: "Deep Reasoning", desc: "Complex problem solving capabilities for math, code, and logic." },
                 { icon: <Shield size={24} className="text-emerald-500"/>, title: "Privacy First", desc: "Your conversations are private. We don't train on your data." }
               ].map((f, i) => (
                 <Card key={i} className="hover:-translate-y-2 transition-transform duration-500 group bg-white/40">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Use Cases (Contoh Hasil/Output) */}
      <section id="use-cases" className="py-20 bg-white/20 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-800 mb-4">Versatility in Action</h2>
             <p className="text-slate-500">See what Prism can create for you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <Card key={i} className="group hover:bg-white/60 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold text-slate-700">{useCase.title}</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-100/50 p-3 rounded-xl text-xs text-slate-500 font-medium">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">User</span>
                    {useCase.prompt}
                  </div>
                  <div className="bg-prism-accent/5 border border-prism-accent/10 p-3 rounded-xl text-sm text-slate-700 font-mono">
                     <span className="text-prism-accent/40 uppercase tracking-wider text-[10px] block mb-1">Prism</span>
                     <div className="whitespace-pre-wrap">{useCase.response}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white/30 backdrop-blur-md border-y border-white/40 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by Forward Thinkers</h2>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {['Acme Corp', 'Global Tech', 'Nebula AI', 'FutureLabs', 'Starlight'].map(name => (
                 <div key={name} className="flex items-center gap-2">
                    <Globe size={20} />
                    <span className="text-xl font-bold text-slate-700 font-sans tracking-tight">{name}</span>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 z-10">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold text-slate-800 mb-4">Simple, Transparent Pricing</h2>
               <p className="text-slate-500 text-lg">Choose the plan that fits your needs.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
               {/* Free */}
               <Card className="bg-white/40 border-white/50">
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-700">Starter</h3>
                    <div className="text-5xl font-bold text-slate-900 mt-6 tracking-tight">$0</div>
                    <p className="text-slate-500 text-sm mt-2">Forever free</p>
                    <ul className="mt-8 space-y-4 mb-8 flex-1">
                      {['Gemini Flash Access', '10 Daily Queries', 'Standard Speed', 'Community Support'].map(item => (
                        <li key={item} className="flex gap-3 text-sm text-slate-600">
                          <Check size={18} className="text-prism-accent flex-shrink-0"/> {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="w-full" onClick={() => onStartChat()}>Get Started</Button>
                  </div>
               </Card>

               {/* Pro */}
               <Card className="relative border-prism-accent/20 shadow-2xl shadow-prism-accent/10 scale-105 z-20 bg-white/60">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-prism-accent text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                    Most Popular
                  </div>
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-prism-accent">Pro</h3>
                    <div className="text-5xl font-bold text-slate-900 mt-6 tracking-tight">$20<span className="text-lg font-normal text-slate-500">/mo</span></div>
                    <p className="text-slate-500 text-sm mt-2">For power users</p>
                    <ul className="mt-8 space-y-4 mb-8 flex-1">
                      {['Gemini Pro Access', 'Unlimited Queries', 'Priority Support', 'Early Access Features', 'Image Generation'].map(item => (
                        <li key={item} className="flex gap-3 text-sm text-slate-600">
                          <Check size={18} className="text-prism-accent flex-shrink-0"/> {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="primary" className="w-full h-12 text-lg" onClick={() => onStartChat()}>Upgrade Now</Button>
                  </div>
               </Card>

               {/* Enterprise */}
               <Card className="bg-white/40 border-white/50">
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-700">Enterprise</h3>
                    <div className="text-5xl font-bold text-slate-900 mt-6 tracking-tight">Custom</div>
                    <p className="text-slate-500 text-sm mt-2">For large teams</p>
                    <ul className="mt-8 space-y-4 mb-8 flex-1">
                      {['Custom Models', 'API Access', 'SSO & Security', 'Dedicated Account Manager', 'SLA Guarantee'].map(item => (
                        <li key={item} className="flex gap-3 text-sm text-slate-600">
                          <Check size={18} className="text-prism-accent flex-shrink-0"/> {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="w-full" onClick={() => onStartChat()}>Contact Sales</Button>
                  </div>
               </Card>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto w-full z-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
           {[
             { q: "Is Prism really free?", a: "Yes! Our starter plan is completely free to use with generous daily limits, perfect for trying out the capabilities of our AI." },
             { q: "Which AI models do you use?", a: "We utilize Google's latest Gemini 3 Flash for speed and Gemini 3 Pro for complex reasoning tasks, ensuring you always get the best results." },
             { q: "Can I use Prism for commercial work?", a: "Absolutely. Content generated on the Pro plan is yours to use commercially without any attribution required." },
             { q: "Is my data secure?", a: "Privacy is our core value. We do not store your conversations for training purposes. Your data remains yours." }
           ].map((faq, i) => (
             <details key={i} className="group bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:bg-white/60 transition-colors">
               <summary className="p-6 font-medium text-slate-800 flex justify-between items-center list-none select-none">
                 {faq.q}
                 <ArrowRight size={18} className="text-prism-accent/50 transition-transform duration-300 group-open:rotate-90"/>
               </summary>
               <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-slate-100/50 pt-4">
                 {faq.a}
               </div>
             </details>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm z-10 border-t border-slate-200/50 bg-white/20 backdrop-blur-sm">
        <div className="flex justify-center items-center gap-2 mb-4">
           <div className="w-5 h-5 rounded bg-slate-400 flex items-center justify-center">
              <svg viewBox="0 0 512 512" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
                 <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
                 <line x1="256" y1="32" x2="256" y2="480" />
              </svg>
           </div>
           <span className="font-bold text-slate-500">Prism AI</span>
        </div>
        <p>© 2024 Prism AI. Crafted with <span className="text-red-400">❤</span> and Liquid UI.</p>
      </footer>
    </div>
  );
};