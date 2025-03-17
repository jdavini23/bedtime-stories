'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { FiTwitter, FiInstagram, FiMail, FiHeart } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn('py-12 px-8 bg-primary/10 dark:bg-primary/5 text-text-primary', className)}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl mb-4 text-primary">Step Into Story Time</h3>
            <p className="text-text-secondary dark:text-text-primary/70">
              Creating magical moments for families, one story at a time.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-text-primary">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-text-primary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-text-primary">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <FiTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <FiInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-text-secondary dark:text-text-primary/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Email</span>
                <FiMail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-text-primary/10 pt-6 text-center">
          <p className="text-text-secondary dark:text-text-primary/70">
            Made with <FiHeart size={16} className="inline text-red-500" /> for parents and kids.{' '}
            {new Date().getFullYear()} Step Into Story Time
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
