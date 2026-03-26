"use client";

import React from 'react';
import { FaqAccordion, FaqItem } from './FaqAccordion';

const STUB_FAQS: FaqItem[] = [
  {
    id: 'course-access',
    question: 'How long do I have access to the course materials?',
    answer: 'Once enrolled, you get lifetime access to the course content, including all future updates. You can learn at your own pace and revisit the videos and resources whenever you need a refresher.',
  },
  {
    id: 'prerequisites',
    question: 'Are there any prerequisites or prior experience required?',
    answer: 'This depends on the specific course. Foundational courses require no prior experience, while intermediate and advanced ones may recommend familiarizing yourself with basic concepts. Please check the "Prerequisites" section on the individual course page.',
  },
  {
    id: 'certificates',
    question: 'Will I receive a certificate upon completion?',
    answer: 'Yes! After successfully completing all modules and final assessments in a course, you will receive a verifiable, digital certificate of completion that you can share on your resume or LinkedIn profile.',
  },
  {
    id: 'refund-policy',
    question: 'What is your refund policy?',
    answer: (
      <div>
        We offer a 14-day money-back guarantee. If you are not satisfied with the course within the first two weeks of enrollment, please contact our support team at <a href="mailto:support@strellerminds.com" className="text-blue-600 hover:underline">support@strellerminds.com</a> for a full refund.
      </div>
    ),
  },
  {
    id: 'live-sessions',
    question: 'Do courses include live coaching or Q&A sessions?',
    answer: 'Many of our premium courses include monthly live group Q&A sessions with the instructors. Check the course syllabus to see if live sessions are included in your enrollment tier.',
  }
];

export default function FaqAccordionExample() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            Have questions about our courses, enrollment, or policies? We've got you covered.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <FaqAccordion 
          items={STUB_FAQS} 
          allowMultiple={true}
          defaultOpenIds={['course-access']} 
        />
        
        {/* Contact CTA */}
        <div className="mt-12 text-center rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 p-8 sm:p-10">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Still have questions?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            Can’t find the answer you’re looking for? Our support team is here to help you get the most out of your StrellerMinds experience.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
