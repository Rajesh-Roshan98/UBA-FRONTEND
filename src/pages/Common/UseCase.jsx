// common/UseCases.jsx
import React from 'react';

const UseCases = () => {
  const cases = [
    {
      title: 'Financial Fraud Detection',
      description: 'Identify unusual transaction patterns and account takeovers in real time using behavioral baselines.',
      industry: 'Banking & Finance',
      icon: '💰',
    },
    {
      title: 'Insider Threat Prevention',
      description: 'Detect employees accessing sensitive data outside normal hours or from unusual locations.',
      industry: 'Enterprise Security',
      icon: '🔒',
    },
    {
      title: 'E‑Commerce Personalization',
      description: 'Analyze clickstream data to recommend products and detect bots or fraudulent reviews.',
      industry: 'Retail',
      icon: '🛒',
    },
    {
      title: 'Healthcare Access Monitoring',
      description: 'Monitor who accesses patient records and flag potential privacy breaches.',
      industry: 'Healthcare',
      icon: '🏥',
    },
    {
      title: 'IoT Device Anomaly Detection',
      description: 'Spot compromised IoT devices by analyzing their communication patterns at the edge.',
      industry: 'Smart Home / Industrial IoT',
      icon: '📱',
    },
    {
      title: 'Remote Work Security',
      description: 'Build behavioral profiles for remote employees to detect compromised accounts.',
      industry: 'Cybersecurity',
      icon: '👥',
    },
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Use Cases
          </h1>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            From finance to healthcare, our UBA platform adapts to your domain while preserving privacy and delivering real‑time insights.
          </p>
        </div>

        {/* Case Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <div key={item.title} className="relative group">
                <div className="h-full bg-gray-50 rounded-2xl p-6 ring-1 ring-gray-200 hover:ring-2 hover:ring-indigo-500 transition-all">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{item.description}</p>
                  <div className="mt-4 flex items-center text-xs font-medium text-indigo-600">
                    <span className="bg-indigo-50 px-2 py-1 rounded-full">{item.industry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to see it in action?</span>
              <span className="block text-indigo-200 text-xl mt-2">We can tailor a demo to your industry.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCases;