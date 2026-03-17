"use client";
'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const PricingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Do credits expire?",
      answer: "No. Credits purchased never expire and stack with future purchases."
    },
    {
      question: "Can I get a refund?",
      answer: "Within 7 days of purchase if zero credits have been used. After that, credits are non-refundable but never expire."
    },
    {
      question: "Is GST included?",
      answer: "Yes. All prices are GST-inclusive (18%). A GST invoice is available from your billing history."
    },
    {
      question: "What payment methods are accepted?",
      answer: "All major cards, UPI, net banking, and wallets via Razorpay. EMI also available."
    },
    {
      question: "Can I use Recuvix for free?",
      answer: "Yes. BYOK mode (using your own API key) is completely free. Credits are only for Managed Mode."
    },
    {
      question: "What counts as 1 credit?",
      answer: "One complete blog generation — including the blog post, SEO meta pack, images, and thumbnail."
    }
  ];

  return (
    <div className="pricing-faq-wrapper">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {item.question}
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-faq-wrapper {
          max-width: 800px;
          margin: 100px auto;
          padding: 0 20px;
        }

        .faq-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 60px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 200ms;
        }

        .faq-item:hover {
          border-color: rgba(232, 255, 71, 0.2);
        }

        .faq-question {
          width: 100%;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          color: #f0f0f0;
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
        }

        .faq-icon {
          color: #e8ff47;
          font-family: var(--font-mono), monospace;
          font-size: 20px;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          opacity: 1;
          padding: 0 24px 24px;
        }

        .faq-answer p {
          color: #666;
          font-size: 15px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default PricingFAQ;
