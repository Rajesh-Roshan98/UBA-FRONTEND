// common/Features.jsx
import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Real‑time Anomaly Detection',
      description: 'PyTorch models at the edge identify unusual behavior instantly, with millisecond latency.',
      icon: '⚡',
    },
    {
      title: 'Privacy by Design',
      description: 'All raw data stays on the device; only anonymized insights are shared with the cloud.',
      icon: '🔐',
    },
    {
      title: 'Continuous Learning',
      description: 'Cloud‑based retraining adapts to evolving user behaviors without manual intervention.',
      icon: '🔄',
    },
    {
      title: 'Multi‑platform Support',
      description: 'Works on mobile, IoT, and web – any environment where Python or ONNX can run.',
      icon: '📱',
    },
    {
      title: 'Explainable Alerts',
      description: 'Each alert comes with a clear reason: which behavior deviated and by how much.',
      icon: '📊',
    },
    {
      title: 'Scalable Architecture',
      description: 'From thousands to millions of users – our edge‑cloud design scales horizontally.',
      icon: '🌐',
    },
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Powerful Features
          </h1>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Everything you need to understand and protect user behavior across edge and cloud.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="relative group">
                <div className="h-full bg-gray-50 rounded-2xl p-8 ring-1 ring-gray-200 hover:ring-2 hover:ring-indigo-500 transition-all">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{feature.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/demo"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Request a demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;