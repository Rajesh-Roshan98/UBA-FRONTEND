import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  Database,
  Users,
  Target,
  Eye,
  Workflow,
} from "lucide-react";

export default function AboutUs() {
  // Scroll-based parallax for blobs
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 800], [0, -50]);
  const blob2Y = useTransform(scrollY, [0, 800], [0, 30]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen w-full overflow-visible bg-slate-50 flex items-center justify-center font-sans selection:bg-indigo-100 selection:text-indigo-900 py-10">
      
      {/* MATRIX GRID BACKGROUND EFFECT (Same as Homepage) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-slate-50 to-white"></div>
        
        {/* The Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
          style={{
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        ></div>

        {/* Animated Color Blobs (Behind Grid) */}
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-150 h-150 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-150 h-150 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* CARDS AND CONTENT */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-16">
        {/* HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight">
            About Our System
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Detecting and Preventing Data Exfiltration in Cloud Using{" "}
            <span className="text-indigo-600 font-semibold">
              User Behavioral Analytics (UBA)
            </span>
          </p>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Target className="text-indigo-600" />
              Our Mission
            </h3>
            <p className="text-slate-600">
              To understand and analyze user activity patterns in cloud
              environments and build a system that identifies abnormal behavior,
              improving data security and preventing unauthorized actions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Eye className="text-indigo-600" />
              Our Vision
            </h3>
            <p className="text-slate-600">
              To develop an intelligent and scalable system that uses user
              behavior analysis to improve cloud security, build trust, and make
              systems more reliable and resilient.
            </p>
          </motion.div>
        </div>

        {/* PROJECT OVERVIEW */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
        >
          <h2 className="text-2xl font-bold mb-3">Project Overview</h2>
          <p className="text-slate-600 leading-relaxed">
            Our project focuses on enhancing cloud security by analyzing user
            behavior patterns to identify anomalies and prevent unauthorized
            data exfiltration. By leveraging machine learning and behavioral
            analytics, the system continuously monitors user activities such as
            login times, file access frequency, data transfer volume, and
            interaction patterns to distinguish between normal and suspicious
            behavior.
          </p>
        </motion.div>

        {/* SYSTEM WORKFLOW */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Workflow className="text-indigo-400" />
            System Workflow
          </h2>

          <ol className="relative ml-4">
            {[
              "User performs cloud activities",
              "Activity logs are collected",
              "Feature extraction and preprocessing",
              "UBA machine learning model analyzes behavior",
              "Anomaly detection",
              "Alerts and dashboard visualization",
            ].map((step, index) => (
              <li 
                key={index} 
                className="relative pl-6 pb-6 border-l border-gray-600 last:border-0 last:pb-0"
              >
                <span className="absolute -left-3 top-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* TECHNOLOGIES & FEATURES */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Database className="text-indigo-600" />
              Technologies Used
            </h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>React.js & Tailwind CSS</li>
              <li>Node.js & Express.js</li>
              <li>MongoDB</li>
              <li>Python (Machine Learning)</li>
              <li>Chart.js</li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" />
              Key Features
            </h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Real-time activity monitoring</li>
              <li>Anomaly detection</li>
              <li>Secure authentication</li>
              <li>Interactive dashboards</li>
            </ul>
          </motion.div>
        </div>

        {/* TEAM INFO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg z-10"
        >
          <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2">
            <Users className="text-indigo-600" />
            Academic & Team Details
          </h2>

          <p className="mb-4 text-slate-600">
            As part of the <strong>MCA curriculum at GIET University</strong>,
            this project bridges academic learning with real-world security
            challenges,
            <br />
            under the guidance of <strong>Mr. Mahesh Kumar Dakua Sir</strong>.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 z-10">
              <p className="font-semibold text-indigo-600">Rajesh Roshan</p>
              <p className="text-slate-600 text-sm">
                Machine Learning & UBA Model
              </p>
            </div>

            <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 z-10">
              <p className="font-semibold text-indigo-600">
                S. Ganesh Kumar Prusty
              </p>
              <p className="text-slate-600 text-sm">
                Backend Development
              </p>
            </div>

            <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 z-10">
              <p className="font-semibold text-indigo-600">Om Gouda</p>
              <p className="text-slate-600 text-sm">
                Frontend Development
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}