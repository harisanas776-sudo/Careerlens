/**
 * CareerLens AI — Curated Sample Datasets for Demo & Benchmarking
 * Research-oriented test cases representing real-world candidates and role specifications.
 */

export interface SampleProfile {
  id: string;
  candidateName: string;
  roleTitle: string;
  targetRole: string;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior';
  resumeText: string;
  jobDescription: string;
  groundTruthFit: 'High Fit' | 'Moderate Fit' | 'Low Fit';
  notes: string;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'demo-ai-engineer',
    candidateName: 'Aarav Sharma',
    roleTitle: 'B.Tech CSE (AI & Data Science)',
    targetRole: 'Junior Machine Learning Engineer',
    experienceLevel: 'Entry-Level',
    notes: 'Strong ML fundamentals, PyTorch, computer vision projects, but lacks AWS deployment and CI/CD production experience.',
    groundTruthFit: 'High Fit',
    resumeText: `AARAV SHARMA
aarav.sharma@example.edu | +91 98765 43210 | linkedin.com/in/aarav-sharma | github.com/aarav-ai | Bangalore, India

PROFESSIONAL SUMMARY
Aspiring Machine Learning Engineer and final-year B.Tech CSE (AI) student with hands-on expertise in PyTorch, Scikit-Learn, and transformer models. Experienced in building computer vision pipelines, fine-tuning open-source LLMs, and optimizing inference latency. Seeking a Junior ML Engineer role to design production-grade intelligence systems.

TECHNICAL SKILLS
Languages: Python, C++, SQL, Bash
Frameworks & Libraries: PyTorch, TensorFlow, Hugging Face Transformers, OpenCV, Scikit-Learn, Pandas, NumPy, FastAPI
Data & ML Tools: MLflow, Docker, Git, Weights & Biases, PostgreSQL, FAISS
Concepts: Deep Learning, CNNs, Transformers, RAG, Transfer Learning, Model Quantization, Data Preprocessing

WORK & RESEARCH EXPERIENCE
Machine Learning Intern | NeuroTech Labs, Bangalore
June 2025 – August 2025
• Built an end-to-end defect detection pipeline using YOLOv8 and PyTorch, achieving 94.2% mAP@50 across a dataset of 12,000 industrial imagery samples.
• Optimized model inference latency from 85ms to 32ms per frame using ONNX Runtime and FP16 quantization, allowing real-time edge processing.
• Collaborated with backend engineers to expose model inference endpoints via FastAPI and containerized the service using Docker.
• Maintained experiment tracking across 40+ training runs using MLflow.

PROJECTS
MedVision: Explainable Chest X-Ray Diagnosis System | PyTorch, Hugging Face, Streamlit
• Implemented DenseNet-121 and Vision Transformers (ViT) to classify 14 pulmonary conditions from 80,000 NIH Chest X-ray images, yielding 0.88 macro AUC-ROC.
• Integrated Grad-CAM to generate visual heatmaps explaining model focus areas, increasing diagnostic interpretability for clinicians.
• Built vector similarity search with FAISS to retrieve visually similar historical patient cases in under 45ms.

Document Intelligence RAG Agent | LangChain, FAISS, FastAPI, Llama-3
• Designed a retrieval-augmented generation (RAG) system for technical research papers using Llama-3-8B and Hugging Face embeddings.
• Implemented hybrid search combining BM25 keyword retrieval and dense vector cosine similarity, improving retrieval recall by 18%.
• Deployed RESTful API with FastAPI and rate limiting, handling 25 concurrent queries.

Autonomous Quadcopter Navigation Simulation | C++, ROS2, OpenCV
• Developed visual odometry algorithms in C++ with OpenCV to estimate 3D trajectories in GPS-denied environments with <4% drift error.
• Published research findings at the National Student Symposium on Intelligent Robotics (2025).

EDUCATION
B.Tech in Computer Science & Engineering (Specialization: AI & ML)
Indian Institute of Technology / National Institute of Technology (2022 – 2026)
CGPA: 8.85 / 10.0 | Relevant Coursework: Deep Learning, Statistical NLP, Data Structures & Algorithms, Linear Algebra

ACHIEVEMENTS & CERTIFICATIONS
• Winner (Top 1% of 300+ teams) at Smart India Hackathon 2024 AI Track.
• DeepLearning.AI Deep Learning Specialization (Coursera).`,

    jobDescription: `Position: Junior Machine Learning Engineer
Company: Stratosphere AI Solutions
Location: Bangalore / Hybrid

About the Role:
We are seeking a talented Junior Machine Learning Engineer to join our Applied AI team. You will assist in designing, training, evaluating, and deploying computer vision and natural language processing models for enterprise clients.

Key Responsibilities:
• Train and fine-tune deep learning models using PyTorch and Hugging Face Transformers.
• Build scalable data preprocessing and feature extraction pipelines in Python and SQL.
• Containerize machine learning microservices using Docker and deploy with FastAPI.
• Track experiments, hyperparameters, and artifacts using MLflow or Weights & Biases.
• Collaborate with software engineers to optimize inference latency and memory footprints.
• Implement explainability techniques (SHAP, Grad-CAM) to justify model outputs to stakeholders.

Requirements:
• Bachelor's or Master's degree in Computer Science, AI, Data Science, or related quantitative discipline.
• Strong programming proficiency in Python, with clean code principles and Git version control.
• Solid theoretical and practical foundation in Deep Learning, CNNs, and Transformer architectures.
• Hands-on experience with PyTorch, Scikit-Learn, and OpenCV or Hugging Face.
• Experience building REST APIs with FastAPI or Flask and containerizing with Docker.
• Understanding of evaluation metrics (AUC-ROC, F1-Score, Precision, Recall, mAP).

Nice to Have:
• Experience with cloud platforms (AWS S3, SageMaker, or GCP Vertex AI).
• Familiarity with Vector Databases (Milvus, Pinecone, FAISS) and RAG workflows.
• Contributions to open-source ML projects or published technical papers.`
  },
  {
    id: 'demo-fullstack-dev',
    candidateName: 'Priya Nambiar',
    roleTitle: 'Full-Stack Software Engineer',
    targetRole: 'Senior Full-Stack Engineer (React & Python/FastAPI)',
    experienceLevel: 'Mid-Level',
    notes: 'Extensive React and Node.js expertise, but lacks Python/FastAPI backend depth and Kubernetes orchestration.',
    groundTruthFit: 'Moderate Fit',
    resumeText: `PRIYA NAMBIAR
priya.nambiar@email.com | +91 91234 56789 | linkedin.com/in/priya-nambiar | github.com/priyan-dev | Mumbai, India

SUMMARY
Full-Stack Software Engineer with 3+ years of experience building modern web applications using React, TypeScript, Node.js, and PostgreSQL. Passionate about component performance, design systems, and responsive web architecture.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3/Tailwind, SQL
Frontend: React, Next.js, Redux Toolkit, React Query, Webpack, Vite
Backend: Node.js, Express.js, REST APIs, GraphQL, Socket.io
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git

EXPERIENCE
Full-Stack Developer | CloudMatrix Technologies, Mumbai
September 2023 – Present
• Engineered customer analytics dashboard in React 18 and TypeScript, reducing client-side bundle size by 35% through dynamic imports.
• Built RESTful microservices using Node.js and Express, serving 250,000 daily active users with 99.9% uptime.
• Migrated relational database schemas on PostgreSQL with Prisma ORM, optimizing slow indexing queries to reduce response times by 40%.
• Spearheaded transition from legacy CSS to Tailwind CSS design system, improving component reuse across 4 engineering pods.

Software Engineer | AppVenture Studio, Pune
July 2022 – August 2023
• Developed responsive user interfaces with Next.js and Redux Toolkit for an e-commerce platform with over $2M GMV.
• Integrated Stripe and Razorpay payment gateways with webhook idempotency.
• Wrote automated integration tests with Jest and React Testing Library, achieving 82% unit test coverage.

PROJECTS
DevCollab: Real-Time Collaborative Markdown Workspace | React, Socket.io, Node.js
• Created browser-based collaborative markdown editor using CRDTs and WebSockets with sub-50ms sync latency.
• Implemented authentication with JWT and session caching in Redis.

EDUCATION
B.Tech in Information Technology | University of Mumbai (2018 – 2022) | CGPA: 8.4 / 10.0`,

    jobDescription: `Position: Senior Full-Stack Engineer (React & Python/FastAPI)
Company: Nexus Enterprise Cloud
Location: Remote / Bangalore

Role Overview:
We are looking for a Senior Full-Stack Engineer to architect next-generation cloud services. You will bridge our React/TypeScript frontend applications with robust Python FastAPI backend microservices and Kubernetes infrastructure.

Responsibilities:
• Architect scalable, accessible web applications using React, TypeScript, and modern state management.
• Develop high-performance backend microservices using Python (FastAPI / asyncio) and PostgreSQL.
• Implement distributed background tasks using Celery, Redis, and message queues (Kafka or RabbitMQ).
• Deploy and maintain cloud infrastructure on AWS using Docker, Kubernetes (K8s), and CI/CD pipelines (GitHub Actions).
• Mentor junior engineers, conduct code reviews, and drive architecture decisions.

Requirements:
• 4+ years of professional full-stack software development experience.
• Expert proficiency with modern React, TypeScript, and state management libraries.
• Strong hands-on backend experience with Python and FastAPI (or Django REST Framework).
• Deep knowledge of relational database design, query optimization, and PostgreSQL.
• Experience with Docker and container orchestration with Kubernetes.
• Familiarity with automated testing (PyTest, Jest) and CI/CD workflows.

Nice to have:
• Experience with GraphQL APIs.
• Knowledge of distributed caching and event-driven architectures.`
  },
  {
    id: 'demo-data-analyst',
    candidateName: 'Rohan Deshmukh',
    roleTitle: 'Junior Data Analyst',
    targetRole: 'Data Analyst & BI Specialist',
    experienceLevel: 'Entry-Level',
    notes: 'Strong in Excel, Tableau, SQL, and exploratory data analysis. Solid fit for business intelligence analytics.',
    groundTruthFit: 'High Fit',
    resumeText: `ROHAN DESHMUKH
rohan.deshmukh@email.com | +91 98111 22334 | linkedin.com/in/rohan-deshmukh-analytics | Pune, India

PROFESSIONAL SUMMARY
Data Analyst with 1.5 years of experience translating raw transactional datasets into executive BI dashboards and actionable growth insights. Proficient in Advanced SQL, Tableau, Power BI, Python (Pandas/Seaborn), and statistical hypothesis testing.

SKILLS
Analytics Tools: Tableau Desktop, Power BI, Advanced Excel (Power Query, VBA), Metabase
Programming & Querying: SQL (PostgreSQL, MySQL, BigQuery), Python (Pandas, NumPy, Matplotlib, Seaborn)
Techniques: Cohort Analysis, A/B Testing, Churn Prediction, Regression Analysis, Data Cleaning, ETL

EXPERIENCE
Junior Data Analyst | RetailPulse Analytics, Pune
January 2024 – Present
• Formulated complex SQL queries involving window functions and CTEs to extract customer retention cohorts across 1.4 million transactions.
• Designed and launched 6 interactive Tableau dashboards monitored daily by VP of Sales, cutting weekly manual reporting time by 14 hours.
• Conducted exploratory data analysis and hypothesis testing for marketing campaigns, identifying customer segments with 28% higher conversion.
• Automated weekly data ingestion pipelines using Python and Google BigQuery, reducing data refresh latency from 24 hours to 2 hours.

Data Analytics Intern | FinEdge Insights
July 2023 – December 2023
• Cleaned and preprocessed unstructured customer survey datasets using Python Pandas, resolving 95% of data inconsistency issues.
• Built Power BI reports to track sales KPIs and quarterly commission payouts for a 50-person sales team.

PROJECTS
E-Commerce Customer Lifetime Value & Churn Prediction | Python, Scikit-Learn, Streamlit
• Conducted RFM (Recency, Frequency, Monetary) segmentation and built logistic regression model to forecast customer churn with 81% precision.
• Published interactive Streamlit web dashboard with interactive sensitivity sliders.

EDUCATION
B.Sc. in Statistics & Computer Applications | Pune University (2020 – 2023) | Distinction (82%)`,

    jobDescription: `Position: Data Analyst & BI Specialist
Company: Omnichannel Retail Corp
Location: Pune / Hybrid

Key Responsibilities:
• Query enterprise data warehouses (Snowflake, PostgreSQL, BigQuery) using advanced SQL to extract clean reporting tables.
• Build, maintain, and publish business intelligence dashboards in Tableau or Power BI for senior leadership.
• Analyze customer acquisition, churn, and revenue trends to deliver data-backed recommendations.
• Partner with product and engineering teams to design tracking events and validate data pipelines.
• Perform statistical hypothesis testing and cohort analysis on marketing initiatives.

Qualifications:
• 1 to 3 years of experience as a Data Analyst, BI Analyst, or similar analytical role.
• Advanced proficiency in SQL (joins, subqueries, window functions, aggregations).
• Demonstrated portfolio creating polished dashboards in Tableau, Power BI, or Looker.
• Practical familiarity with Python (Pandas) for data wrangling and statistical analysis.
• Strong communication skills to present analytical findings to non-technical stakeholders.`
  }
];

export const BENCHMARK_EVAL_DATASET = [
  {
    id: 'eval-01',
    role: 'ML Engineer',
    profileSummary: 'Candidate with PyTorch, Scikit-learn, OpenCV, Docker, FastAPI, Python',
    candidateSkills: ['Python', 'PyTorch', 'Scikit-Learn', 'OpenCV', 'Docker', 'FastAPI', 'MLflow', 'Git'],
    jobSkills: ['Python', 'PyTorch', 'Hugging Face', 'Docker', 'FastAPI', 'MLflow', 'AWS', 'Deep Learning'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.62,
    semanticModelMatch: 0.84,
  },
  {
    id: 'eval-02',
    role: 'Frontend Dev applying to ML Engineer',
    profileSummary: 'Candidate with React, TypeScript, CSS, Next.js, Redux, HTML',
    candidateSkills: ['React', 'TypeScript', 'CSS', 'Next.js', 'Redux', 'HTML', 'JavaScript'],
    jobSkills: ['Python', 'PyTorch', 'Hugging Face', 'Docker', 'FastAPI', 'MLflow', 'AWS', 'Deep Learning'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.05,
    semanticModelMatch: 0.12,
  },
  {
    id: 'eval-03',
    role: 'Data Scientist to ML Engineer',
    profileSummary: 'Candidate with Python, Pandas, SQL, Scikit-Learn, LightGBM, Flask',
    candidateSkills: ['Python', 'Pandas', 'SQL', 'Scikit-Learn', 'Statistics', 'Flask'],
    jobSkills: ['Python', 'PyTorch', 'Deep Learning', 'Docker', 'FastAPI', 'MLflow', 'Scikit-Learn'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.40,
    semanticModelMatch: 0.72,
  },
  {
    id: 'eval-04',
    role: 'DevOps applying to Frontend',
    profileSummary: 'Candidate with Kubernetes, Terraform, Docker, AWS, Bash, Linux',
    candidateSkills: ['Kubernetes', 'Terraform', 'Docker', 'AWS', 'Bash', 'Linux'],
    jobSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.08,
  },
  {
    id: 'eval-05',
    role: 'Full Stack applying to Full Stack',
    profileSummary: 'Candidate with React, Node.js, Express, MongoDB, TypeScript, REST',
    candidateSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST', 'Docker'],
    jobSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST', 'AWS'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.71,
    semanticModelMatch: 0.89,
  },
  {
    id: 'eval-06',
    role: 'Backend Java applying to Python Backend',
    profileSummary: 'Candidate with Java, Spring Boot, MySQL, Microservices, Docker, Kafka',
    candidateSkills: ['Java', 'Spring Boot', 'MySQL', 'Microservices', 'Docker', 'Kafka'],
    jobSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Microservices', 'Docker', 'Kafka'],
    groundTruthRelevance: 1, // Moderate transfer
    keywordBaselineMatch: 0.50,
    semanticModelMatch: 0.75,
  },
  {
    id: 'eval-07',
    role: 'QA Engineer applying to Data Science',
    profileSummary: 'Candidate with Selenium, Cypress, JUnit, Test Automation, Jira',
    candidateSkills: ['Selenium', 'Cypress', 'JUnit', 'Test Automation', 'Jira'],
    jobSkills: ['Python', 'Machine Learning', 'Pandas', 'SQL', 'PyTorch', 'Statistics'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.11,
  },
  {
    id: 'eval-08',
    role: 'Data Analyst to BI Analyst',
    profileSummary: 'Candidate with SQL, Tableau, Power BI, Excel, Python, EDA',
    candidateSkills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Python', 'Pandas'],
    jobSkills: ['SQL', 'Tableau', 'Power BI', 'Data Warehousing', 'BigQuery', 'Python'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.67,
    semanticModelMatch: 0.88,
  },
  {
    id: 'eval-09',
    role: 'Mobile Dev applying to Data Engineer',
    profileSummary: 'Candidate with Swift, iOS, Kotlin, Android, Xcode, CoreData',
    candidateSkills: ['Swift', 'iOS', 'Kotlin', 'Android', 'Xcode', 'CoreData'],
    jobSkills: ['Spark', 'Hadoop', 'SQL', 'Python', 'Airflow', 'Kafka', 'Snowflake'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.06,
  },
  {
    id: 'eval-10',
    role: 'NLP Researcher to LLM Engineer',
    profileSummary: 'Candidate with PyTorch, Transformers, HuggingFace, BERT, Python, RAG',
    candidateSkills: ['PyTorch', 'Transformers', 'Hugging Face', 'BERT', 'Python', 'RAG', 'Vector DB'],
    jobSkills: ['Python', 'PyTorch', 'Transformers', 'LangChain', 'Llama', 'RAG', 'Vector DB', 'FastAPI'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.63,
    semanticModelMatch: 0.92,
  },
  {
    id: 'eval-11',
    role: 'Cloud Architect to Cloud Architect',
    profileSummary: 'Candidate with AWS, Azure, Terraform, Kubernetes, IAM, CI/CD',
    candidateSkills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'IAM', 'CI/CD', 'Security'],
    jobSkills: ['AWS', 'Terraform', 'Kubernetes', 'CloudFormation', 'CI/CD', 'Architecture'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.67,
    semanticModelMatch: 0.90,
  },
  {
    id: 'eval-12',
    role: 'Graphic Designer applying to Software Engineer',
    profileSummary: 'Candidate with Photoshop, Illustrator, Figma, UI/UX, Typography',
    candidateSkills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'Typography', 'InDesign'],
    jobSkills: ['Java', 'C++', 'Data Structures', 'Algorithms', 'SQL', 'Git'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.04,
  },
  {
    id: 'eval-13',
    role: 'Junior Web Dev to Frontend React',
    profileSummary: 'Candidate with HTML, CSS, JavaScript, Vue.js, Git',
    candidateSkills: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'Git'],
    jobSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Git', 'Redux'],
    groundTruthRelevance: 1, // Moderate transfer
    keywordBaselineMatch: 0.57,
    semanticModelMatch: 0.76,
  },
  {
    id: 'eval-14',
    role: 'Cybersecurity Analyst to Security Engineer',
    profileSummary: 'Candidate with SIEM, Wireshark, Penetration Testing, Linux, Python, SOC',
    candidateSkills: ['SIEM', 'Wireshark', 'Penetration Testing', 'Linux', 'Python', 'SOC'],
    jobSkills: ['SIEM', 'Penetration Testing', 'Network Security', 'Python', 'Linux', 'AWS'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.67,
    semanticModelMatch: 0.87,
  },
  {
    id: 'eval-15',
    role: 'Content Writer applying to Backend Dev',
    profileSummary: 'Candidate with Copywriting, SEO, WordPress, Content Strategy',
    candidateSkills: ['Copywriting', 'SEO', 'WordPress', 'Content Strategy', 'Blogging'],
    jobSkills: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'gRPC', 'Microservices'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.03,
  },
  {
    id: 'eval-16',
    role: 'Embedded C Dev to IoT Engineer',
    profileSummary: 'Candidate with C, C++, FreeRTOS, STM32, I2C, SPI, UART, Firmware',
    candidateSkills: ['C', 'C++', 'FreeRTOS', 'STM32', 'I2C', 'SPI', 'UART', 'Firmware'],
    jobSkills: ['C', 'C++', 'Embedded Systems', 'IoT', 'MQTT', 'FreeRTOS', 'Linux'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.57,
    semanticModelMatch: 0.85,
  },
  {
    id: 'eval-17',
    role: 'System Admin to Site Reliability Engineer',
    profileSummary: 'Candidate with Linux, Bash, Networking, Monitoring, Docker, Ansible',
    candidateSkills: ['Linux', 'Bash', 'Networking', 'Monitoring', 'Docker', 'Ansible'],
    jobSkills: ['Linux', 'Kubernetes', 'Prometheus', 'Grafana', 'Go', 'Docker', 'Terraform'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.43,
    semanticModelMatch: 0.74,
  },
  {
    id: 'eval-18',
    role: 'Accountant applying to Machine Learning',
    profileSummary: 'Candidate with Tally, QuickBooks, Auditing, Tax, Financial Modeling',
    candidateSkills: ['Tally', 'QuickBooks', 'Auditing', 'Tax', 'Financial Modeling', 'Excel'],
    jobSkills: ['Python', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Linear Algebra'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.05,
  },
  {
    id: 'eval-19',
    role: 'Data Engineer to Analytics Engineer',
    profileSummary: 'Candidate with SQL, dbt, Snowflake, Airflow, Python, Data Modeling',
    candidateSkills: ['SQL', 'dbt', 'Snowflake', 'Airflow', 'Python', 'Data Modeling'],
    jobSkills: ['SQL', 'dbt', 'Snowflake', 'Looker', 'Data Modeling', 'Git'],
    groundTruthRelevance: 1, // Relevant
    keywordBaselineMatch: 0.67,
    semanticModelMatch: 0.91,
  },
  {
    id: 'eval-20',
    role: 'Mechanical CAD Drafter applying to Full Stack',
    profileSummary: 'Candidate with AutoCAD, SolidWorks, CATIA, GD&T, 3D Modeling',
    candidateSkills: ['AutoCAD', 'SolidWorks', 'CATIA', 'GD&T', '3D Modeling'],
    jobSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'CSS'],
    groundTruthRelevance: 0, // Irrelevant
    keywordBaselineMatch: 0.0,
    semanticModelMatch: 0.02,
  }
];
