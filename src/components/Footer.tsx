'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 px-8 bg-primary-dark text-text-primary">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl mb-4">Step Into Story Time</h3>
            <p className="text-text-primary/70">
              Creating magical moments for families, one story at a time.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <Image
                  src="/images/illustrations/twitter.svg"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="text-current"
                  loading="lazy"
                  sizes="24px"
                  quality={85}
                />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <Image
                  src="/images/illustrations/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="text-current"
                  loading="lazy"
                  sizes="24px"
                  quality={85}
                />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <Image
                  src="/images/illustrations/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="text-current"
                  loading="lazy"
                  sizes="24px"
                  quality={85}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-text-primary/20 pt-6 text-center">
          <p>
            Made with{' '}
            <Image
              src="/images/illustrations/heart.svg"
              alt="love"
              width={16}
              height={16}
              className="inline"
              loading="lazy"
              sizes="16px"
              quality={85}
            />{' '}
            for parents and kids. © {new Date().getFullYear()} Step Into Story Time
          </p>
        </div>
      </div>
    </footer>
  );
}
