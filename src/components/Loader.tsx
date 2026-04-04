import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-muted border-t-primary rounded-full"
      />
    </div>
  );
}
