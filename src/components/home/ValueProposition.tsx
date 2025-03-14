'use client';

import { motion } from 'framer-motion';
import { Book, Star, Moon, Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="p-6 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
      </div>
      <p className="text-text-secondary dark:text-text-primary/80">{description}</p>
    </motion.div>
  );
}

export function ValueProposition() {
  return (
    <section className="py-16 bg-gradient-to-b from-cloud via-cloud/50 to-white dark:from-midnight dark:via-midnight/50 dark:to-midnight-deep">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Parents Love Our Stories
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Star className="w-6 h-6" />}
            title="AI-Powered Magic"
            description="Stories that adapt to your child's interests and reading level"
            delay={0.2}
          />
          <FeatureCard
            icon={<Book className="w-6 h-6" />}
            title="100+ Themes"
            description="From space adventures to fairy tale kingdoms"
            delay={0.4}
          />
          <FeatureCard
            icon={<Moon className="w-6 h-6" />}
            title="Bedtime Ready"
            description="Perfect length for tired eyes, great for all ages"
            delay={0.6}
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6" />}
            title="Safe & Secure"
            description="COPPA compliant with parental controls"
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
}

export default ValueProposition;
