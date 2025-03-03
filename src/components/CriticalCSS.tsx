import React from 'react';

export function CriticalCSS() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Critical CSS for above-the-fold content */
        :root {
          --color-primary: rgb(60, 110, 113);
          --color-secondary: rgb(242, 204, 143);
          --color-background: rgb(245, 245, 245);
          --color-text: rgb(53, 53, 53);
          --shadow-dreamy: 0 4px 14px 0 rgba(60, 110, 113, 0.2);
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --color-primary: rgb(79, 138, 141);
            --color-secondary: rgb(247, 220, 172);
            --color-background: rgb(40, 75, 99);
            --color-text: rgb(245, 245, 245);
            --shadow-dreamy: 0 4px 14px 0 rgba(0, 0, 0, 0.3);
          }
        }
        
        /* Base styles for immediate rendering */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Quicksand', sans-serif;
          background: var(--color-background);
          color: var(--color-text);
        }
        
        /* Critical layout styles */
        .max-w-5xl {
          max-width: 64rem;
        }
        
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-between {
          justify-content: space-between;
        }
        
        /* Critical typography */
        h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
          font-weight: 700;
          margin-top: 0;
        }
        
        @media (min-width: 768px) {
          h1 {
            font-size: 3rem;
            line-height: 3.5rem;
          }
        }
        
        /* Critical component styles */
        .btn-primary {
          background-color: var(--color-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .btn-primary:hover {
          background-color: var(--color-primary-dark);
        }
        
        /* Loading state styles */
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 0.375rem;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `,
        }}
      />
    </>
  );
}
