# Cloud User Behavioural Analytics (UBA) Using Python and ML

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![FastAPI](https://img.shields.io/badge/ML_Engine-FastAPI-green.svg)](https://fastapi.tiangolo.com/)
[![Isolation Forest](https://img.shields.io/badge/Algorithm-Isolation_Forest-orange.svg)](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Project Overview

Traditional perimeter-centric cybersecurity architectures are becoming fundamentally obsolete as digital transformation pushes enterprise data into elastic cloud infrastructures. Attackers frequently bypass static firewalls by leveraging compromised credentials and "living off the land" techniques to execute stealthy data exfiltration.

This project implements a highly scalable, **cloud-native User Behavioural Analytics (UBA) platform** designed to autonomously detect and prevent insider threats and account takeovers. By monitoring user actions post-authentication, the system shifts security from a **"Trust but Verify"** model to a mathematically rigorous **Zero Trust** paradigm.

---

## 🏗️ System Architecture

The platform utilizes a **fully decoupled microservices architecture** to isolate high-concurrency web tasks from computationally intensive machine learning inference.

### High-Level Architecture

```mermaid
graph TD
    A[React.js SPA Frontend] <-->|HTTPS / REST API| B[Node.js API Gateway]
    B <-->|Mongoose ODM| C[(MongoDB NoSQL Cluster)]
    B <-->|Asynchronous Subprocess| D[Python FastAPI Microservice]
    D <-->|Joblib| E[Isolation Forest .pkl Models]

```

## 🔄 End-to-End Workflow

- **Ingestion:** The Node.js gateway captures multi-source telemetry including spatial, temporal, and volumetric data.  

- **Feature Engineering:** Python scripts translate unstructured JSON logs into 25-dimensional numerical feature vectors.  

- **Inference:** The Isolation Forest algorithm evaluates vectors, calculating path lengths to isolate anomalies that are statistically "few and different".  

- **Response:** High-risk scores trigger immediate SOC alerts, dashboard notifications, and Nodemailer security warnings.  

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Strict middleware-enforced separation between User and Admin interfaces.  

- **Unsupervised ML Engine:** Utilizes role-specific Isolation Forest models that establish behavioral baselines without needing labeled attack data.  

- **Zero Trust Enforcement:** Integrates stateless JWT management with stateful database cross-referencing for instant session revocation.  

- **Real-Time Monitoring:** Dynamic React-based dashboards featuring circular risk score indicators and chronological activity timelines.  

- **Self-Cleaning Architecture:** Automated Time-To-Live (TTL) indexes permanently purge expired OTPs and session tokens.  

---

## 🛠️ Technology Stack

| Domain        | Technology                          | Purpose |
|--------------|------------------------------------|---------|
| Frontend     | React.js, Vite, Tailwind CSS       | High-speed UI rendering and responsive styling |
| Backend      | Node.js, Express.js                | Concurrent event-driven API gateway |
| Database     | MongoDB, Mongoose                  | NoSQL persistence with strict schema validation |
| ML Engine    | Python, FastAPI                    | Asynchronous machine learning inference |
| Data Science | Scikit-learn, Pandas, NumPy        | Anomaly detection and feature engineering |

---

## 📊 Empirical Results

Tested against a dataset of **4,000 unique user profiles** with **101 injected anomalies**, the system achieved:

- **F1-Score:** Flawless **1.0 (100%)** on research data  
- **False Positive Rate:** **0%**, effectively eliminating SOC alert fatigue  
- **End-to-End Latency:** Average detection resolves in **294 milliseconds**  

---

## 👥 Contributors

- **Rajesh Roshan (Regd. No: 24PG030074)** – AI & ML Focus, Backend Systems  

- **Om Prasad Gouda (Regd. No: 24PG030073)** – Frontend Development, UI/UX Design  

- **S. Ganesh Kumar Prusty (Regd. No: 24PG030072)** – Web Security, Database Management  

---

## 🎓 Academic Details

- **Project Supervisor:** Mr. Mahesh Kumar Dakua (Assistant Professor, Dept. of CSA)  

This project was submitted in partial fulfilment of the requirements for the **Master of Computer Application (MCA)** at **GIET University, Gunupur, Odisha**.