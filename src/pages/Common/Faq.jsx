// common/FAQ.jsx
import React, { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'What is User Behavioral Analytics (UBA)?',
      answer: 'UBA uses machine learning to analyze patterns in user behavior (e.g., login times, navigation paths, transaction amounts) and detect anomalies that could indicate security threats or opportunities for personalization.',
    },
    {
      question: 'How does edge computing improve privacy?',
      answer: 'By running inference directly on the device, sensitive user data never leaves the edge. Only anonymized behavioral features or alerts are sent to the cloud, ensuring compliance with data protection regulations.',
    },
    {
      question: 'Which ML frameworks do you use?',
      answer: 'Our models are built with PyTorch and optimized for edge deployment using TorchScript and ONNX. We also leverage Python for data processing and cloud-based training.',
    },
    {
      question: 'Can I integrate this with my existing system?',
      answer: 'Yes. We provide REST APIs and SDKs for Python, JavaScript, and mobile platforms. Our cloud component can be deployed on your infrastructure or ours.',
    },
    {
      question: 'What kind of behaviors can be monitored?',
      answer: 'Anything from login attempts and file access to IoT sensor readings and e-commerce clicks. Our models adapt to the specific features of your domain.',
    },
    {
      question: 'How accurate is the anomaly detection?',
      answer: 'Accuracy depends on the quality and quantity of training data, but our deep learning models typically achieve >95% precision with very low false positive rates after tuning.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about our UBA platform.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="ml-6 flex-shrink-0 text-gray-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-indigo-50 rounded-lg p-6">
          <p className="text-gray-700">Still have questions?</p>
          <a
            href="/contact"
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;