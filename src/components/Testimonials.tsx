import { motion } from 'framer-motion';
import { IconStar } from '@tabler/icons-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Trust & Safety Lead',
    avatar: 'SC',
    rating: 5,
    text: 'ModAI reduced our review time by 80%. The accuracy is incredible for detecting subtle harmful content.',
  },
  {
    name: 'James Walker',
    role: 'Platform Engineer',
    avatar: 'JW',
    rating: 5,
    text: 'Integration was seamless. The API is well-documented and the real-time analysis is impressively fast.',
  },
  {
    name: 'Priya Sharma',
    role: 'Community Manager',
    avatar: 'PS',
    rating: 4,
    text: 'Our community feels safer. The false positive rate is the lowest of any tool we\'ve tested.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-hover p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <IconStar key={j} size={14} className={j < t.rating ? 'text-warning fill-warning' : 'text-muted-foreground'} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
