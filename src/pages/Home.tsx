import { motion } from 'framer-motion';
import { IconUpload, IconBrain, IconShieldCheck, IconHeartHandshake, IconUsers, IconTrendingDown } from '@tabler/icons-react';
import heroImg from '@/assets/hero-illustration.png';
import UploadSection from '@/components/UploadSection';
import Testimonials from '@/components/Testimonials';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

import { useModeration } from '@/hooks/useModeration';
import { ModerationResult } from '@/components/ModerationResult';


const steps = [
  { icon: <IconUpload size={28} />, title: 'Upload Content', desc: 'Submit text, images, video, or audio for analysis' },
  { icon: <IconBrain size={28} />, title: 'AI Analyzes', desc: 'Our models detect harmful content in real-time' },
  { icon: <IconShieldCheck size={28} />, title: 'Get Results', desc: 'Receive detailed safety reports with confidence scores' },
];

const impacts = [
  { icon: <IconHeartHandshake size={28} />, title: 'Safer Internet', desc: 'Protect communities from harmful & toxic content', stat: '99.2%' },
  { icon: <IconUsers size={28} />, title: '10M+ Users Protected', desc: 'Trusted by platforms worldwide to keep users safe', stat: '10M+' },
  { icon: <IconTrendingDown size={28} />, title: 'Reduced Toxicity', desc: 'Platforms see 73% reduction in toxic interactions', stat: '73%' },
];

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[70vh] justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-sm text-xs text-primary mb-6">
                <div className="w-1.5 h-1.5 rounded-full gradient-bg animate-pulse" />
                AI-Powered Content Moderation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Keep Your Platform{' '}
                <span className="gradient-text">Safe & Clean</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Harness the power of advanced AI to detect and filter harmful content across text, images, video, and audio — in real-time.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#upload" className="px-6 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-sm">
                  Try It Free
                </a>
                <a href="#how" className="px-6 py-3 rounded-lg border border-glass-border text-foreground font-medium hover:bg-secondary/30 transition-colors">
                  How It Works
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 max-w-lg"
            >
              <img src={heroImg} alt="AI Content Moderation" width={1024} height={1024} className="w-full animate-float" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload */}
      <div id="upload">
        <UploadSection />
      </div>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to a safer platform</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-hover p-6 text-center relative"
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {s.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 gradient-bg opacity-30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Social <span className="gradient-text">Impact</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {impacts.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-hover p-6 text-center"
              >
                <div className="text-primary mb-3 flex justify-center">{item.icon}</div>
                <p className="text-3xl font-display font-bold gradient-text mb-1">{item.stat}</p>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <Testimonials />

      {/* Subscribe */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto glass p-8 text-center"
          >
            <h2 className="text-2xl font-display font-bold mb-2">Stay Updated</h2>
            <p className="text-sm text-muted-foreground mb-6">Get the latest updates on AI content moderation</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-secondary/30 border border-glass-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
              />
              <button className="px-6 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-glass-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ModAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
