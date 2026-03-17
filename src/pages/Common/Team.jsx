// common/Team.jsx
import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief AI Scientist',
      bio: 'Former lead ML researcher at DeepMind, specializing in anomaly detection and privacy‑preserving learning.',
      image: 'https://via.placeholder.com/300x300?text=Sarah+Chen', // Replace with actual image
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Edge Engineering',
      bio: 'Built low‑latency inference pipelines for autonomous vehicles; expert in embedded systems and PyTorch Mobile.',
      image: 'https://via.placeholder.com/300x300?text=Michael+Rodriguez',
    },
    {
      name: 'Priya Patel',
      role: 'Cloud Architect',
      bio: 'Scalable cloud infrastructure specialist with 10+ years at AWS; designs our hybrid edge‑cloud data plane.',
      image: 'https://via.placeholder.com/300x300?text=Priya+Patel',
    },
    {
      name: 'Dr. James Okafor',
      role: 'Behavioral Psychologist',
      bio: 'Bridges the gap between raw data and human behavior; ensures our models capture meaningful patterns.',
      image: 'https://via.placeholder.com/300x300?text=James+Okafor',
    },
    {
      name: 'Linda Wu',
      role: 'Product Manager',
      bio: 'Former cybersecurity consultant; translates customer needs into actionable features.',
      image: 'https://via.placeholder.com/300x300?text=Linda+Wu',
    },
    {
      name: 'David Kim',
      role: 'Lead Full‑Stack Developer',
      bio: 'Builds the dashboards and APIs that make UBA insights accessible to security teams.',
      image: 'https://via.placeholder.com/300x300?text=David+Kim',
    },
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Meet the Team
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            We are a diverse group of researchers, engineers, and domain experts passionate about making behavioral analytics secure and accessible.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="space-y-4">
                <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                  <img
                    className="object-cover shadow-lg rounded-lg"
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-indigo-600">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us Banner */}
        <div className="mt-24 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">We're growing!</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            If you're passionate about edge AI, behavioral analytics, or privacy tech, check out our open positions.
          </p>
          <div className="mt-5">
            <a
              href="/careers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View careers
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;