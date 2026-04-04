import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconMail, IconLock, IconUser, IconShield } from '@tabler/icons-react';
import { useAppState } from '@/store';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { dispatch } = useAppState();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch({
      type: 'LOGIN',
      payload: { id: '1', name, email, joinedAt: new Date().toISOString() },
    });
    navigate('/dashboard');
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: <IconUser size={16} />, type: 'text', value: name, onChange: setName, placeholder: 'John Doe' },
    { key: 'email', label: 'Email', icon: <IconMail size={16} />, type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', icon: <IconLock size={16} />, type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 w-full max-w-md relative"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center glow-sm">
            <IconShield size={24} className="text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-center mb-1">Create Account</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Join the future of content moderation</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {fields.map((f) => (
            <motion.div key={f.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
              <div className={`flex items-center gap-3 bg-secondary/30 border rounded-lg px-3 ${errors[f.key] ? 'border-destructive' : 'border-glass-border'}`}>
                <span className="text-muted-foreground">{f.icon}</span>
                <input
                  type={f.type}
                  required
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  placeholder={f.placeholder}
                  className="flex-1 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors[f.key] && <p className="text-xs text-destructive mt-1">{errors[f.key]}</p>}
            </motion.div>
          ))}

          <button type="submit" className="w-full py-3 rounded-lg gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm">
            Create Account
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
