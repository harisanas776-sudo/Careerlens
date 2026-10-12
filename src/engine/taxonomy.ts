/**
 * CareerLens AI — Technology & Domain Skill Taxonomy
 * Curated knowledge base for hierarchical skill extraction, synonym resolution,
 * and dependency-aware learning sequence prioritization.
 */

export interface SkillNode {
  id: string;
  name: string;
  category: 'AI_ML' | 'DATA_ENG' | 'BACKEND' | 'FRONTEND' | 'DEVOPS_CLOUD' | 'CORE_CS' | 'SYSTEMS';
  synonyms: string[];
  prerequisites: string[];
  importanceWeight: number; // 1 to 5 relative baseline importance
}

export const SKILL_TAXONOMY: SkillNode[] = [
  // --- AI & Machine Learning ---
  {
    id: 'python',
    name: 'Python',
    category: 'AI_ML',
    synonyms: ['python3', 'py'],
    prerequisites: [],
    importanceWeight: 5
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    category: 'AI_ML',
    synonyms: ['torch', 'torchvision'],
    prerequisites: ['python'],
    importanceWeight: 5
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    category: 'AI_ML',
    synonyms: ['tf', 'keras'],
    prerequisites: ['python'],
    importanceWeight: 4
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-Learn',
    category: 'AI_ML',
    synonyms: ['sklearn', 'scikit learn'],
    prerequisites: ['python'],
    importanceWeight: 4
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Transformers',
    category: 'AI_ML',
    synonyms: ['hugging face', 'transformers', 'hf', 'bert', 'roberta'],
    prerequisites: ['pytorch', 'python'],
    importanceWeight: 5
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    category: 'AI_ML',
    synonyms: ['cv2', 'computer vision'],
    prerequisites: ['python'],
    importanceWeight: 4
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    category: 'AI_ML',
    synonyms: ['neural networks', 'ann', 'cnn', 'rnn', 'lstm'],
    prerequisites: ['python', 'scikit-learn'],
    importanceWeight: 5
  },
  {
    id: 'rag',
    name: 'Retrieval-Augmented Generation (RAG)',
    category: 'AI_ML',
    synonyms: ['rag', 'retrieval augmented generation', 'langchain', 'llamaindex'],
    prerequisites: ['python', 'vector-databases'],
    importanceWeight: 5
  },
  {
    id: 'vector-databases',
    name: 'Vector Databases',
    category: 'AI_ML',
    synonyms: ['vector db', 'faiss', 'chroma', 'pinecone', 'milvus', 'weaviate', 'qdrant'],
    prerequisites: ['python'],
    importanceWeight: 4
  },
  {
    id: 'mlflow',
    name: 'MLflow',
    category: 'AI_ML',
    synonyms: ['mlops', 'weights & biases', 'wandb', 'experiment tracking'],
    prerequisites: ['python'],
    importanceWeight: 3
  },
  {
    id: 'model-quantization',
    name: 'Model Quantization & Optimization',
    category: 'AI_ML',
    synonyms: ['onnx', 'tensorrt', 'fp16', 'int8', 'quantization', 'openvino'],
    prerequisites: ['pytorch'],
    importanceWeight: 4
  },
  {
    id: 'pandas-numpy',
    name: 'Pandas & NumPy',
    category: 'DATA_ENG',
    synonyms: ['pandas', 'numpy', 'scipy', 'data manipulation'],
    prerequisites: ['python'],
    importanceWeight: 4
  },

  // --- Backend & APIs ---
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'BACKEND',
    synonyms: ['fast api', 'starlette', 'pydantic'],
    prerequisites: ['python'],
    importanceWeight: 4
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'BACKEND',
    synonyms: ['node', 'nodejs', 'npm'],
    prerequisites: ['javascript'],
    importanceWeight: 5
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'BACKEND',
    synonyms: ['express', 'expressjs'],
    prerequisites: ['nodejs'],
    importanceWeight: 4
  },
  {
    id: 'rest-apis',
    name: 'RESTful API Design',
    category: 'BACKEND',
    synonyms: ['rest', 'restful', 'rest api', 'api endpoints'],
    prerequisites: [],
    importanceWeight: 4
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'BACKEND',
    synonyms: ['apollo', 'graphql api'],
    prerequisites: ['rest-apis'],
    importanceWeight: 3
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'DATA_ENG',
    synonyms: ['postgres', 'psql', 'relational database'],
    prerequisites: ['sql'],
    importanceWeight: 5
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'DATA_ENG',
    synonyms: ['structured query language', 'mysql', 'sqlite', 'rdbms'],
    prerequisites: [],
    importanceWeight: 5
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'DATA_ENG',
    synonyms: ['mongo', 'nosql', 'document db'],
    prerequisites: [],
    importanceWeight: 3
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'BACKEND',
    synonyms: ['in-memory cache', 'caching', 'redis cache'],
    prerequisites: [],
    importanceWeight: 4
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'BACKEND',
    synonyms: ['kafka', 'message queue', 'rabbitmq', 'event-driven'],
    prerequisites: [],
    importanceWeight: 4
  },

  // --- Frontend ---
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'FRONTEND',
    synonyms: ['js', 'es6', 'ecmascript'],
    prerequisites: [],
    importanceWeight: 5
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'FRONTEND',
    synonyms: ['ts'],
    prerequisites: ['javascript'],
    importanceWeight: 5
  },
  {
    id: 'react',
    name: 'React',
    category: 'FRONTEND',
    synonyms: ['reactjs', 'react.js', 'react hooks'],
    prerequisites: ['javascript'],
    importanceWeight: 5
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'FRONTEND',
    synonyms: ['next', 'nextjs', 'ssr'],
    prerequisites: ['react'],
    importanceWeight: 4
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'FRONTEND',
    synonyms: ['tailwind', 'css3', 'modern css'],
    prerequisites: [],
    importanceWeight: 3
  },

  // --- Cloud & DevOps ---
  {
    id: 'docker',
    name: 'Docker',
    category: 'DEVOPS_CLOUD',
    synonyms: ['containerization', 'containers', 'dockerfile', 'docker compose'],
    prerequisites: ['linux'],
    importanceWeight: 5
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'DEVOPS_CLOUD',
    synonyms: ['k8s', 'container orchestration', 'helm'],
    prerequisites: ['docker'],
    importanceWeight: 4
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    category: 'DEVOPS_CLOUD',
    synonyms: ['aws', 's3', 'ec2', 'lambda', 'sagemaker', 'iam'],
    prerequisites: ['cloud-computing'],
    importanceWeight: 4
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    category: 'DEVOPS_CLOUD',
    synonyms: ['gcp', 'google cloud', 'vertex ai', 'bigquery', 'cloud run'],
    prerequisites: ['cloud-computing'],
    importanceWeight: 3
  },
  {
    id: 'ci-cd',
    name: 'CI/CD Pipelines',
    category: 'DEVOPS_CLOUD',
    synonyms: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins'],
    prerequisites: ['git'],
    importanceWeight: 4
  },
  {
    id: 'git',
    name: 'Git Version Control',
    category: 'CORE_CS',
    synonyms: ['git', 'github', 'gitlab', 'version control'],
    prerequisites: [],
    importanceWeight: 5
  },
  {
    id: 'linux',
    name: 'Linux / Bash',
    category: 'CORE_CS',
    synonyms: ['linux', 'bash', 'shell scripting', 'unix', 'ubuntu'],
    prerequisites: [],
    importanceWeight: 4
  },

  // --- Analytics & BI ---
  {
    id: 'tableau',
    name: 'Tableau',
    category: 'DATA_ENG',
    synonyms: ['tableau desktop', 'tableau server'],
    prerequisites: ['sql'],
    importanceWeight: 4
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    category: 'DATA_ENG',
    synonyms: ['power bi', 'dax', 'power query'],
    prerequisites: ['sql'],
    importanceWeight: 4
  },
  {
    id: 'spark',
    name: 'Apache Spark',
    category: 'DATA_ENG',
    synonyms: ['spark', 'pyspark', 'databricks'],
    prerequisites: ['python', 'sql'],
    importanceWeight: 4
  },
  {
    id: 'data-warehousing',
    name: 'Data Warehousing (Snowflake / BigQuery)',
    category: 'DATA_ENG',
    synonyms: ['snowflake', 'bigquery', 'redshift', 'dbt'],
    prerequisites: ['sql'],
    importanceWeight: 4
  },

  // --- Core CS ---
  {
    id: 'data-structures-algorithms',
    name: 'Data Structures & Algorithms',
    category: 'CORE_CS',
    synonyms: ['dsa', 'algorithms', 'data structures', 'problem solving'],
    prerequisites: [],
    importanceWeight: 5
  },
  {
    id: 'system-design',
    name: 'System Design & Distributed Systems',
    category: 'CORE_CS',
    synonyms: ['system design', 'distributed systems', 'scalability', 'microservices'],
    prerequisites: ['rest-apis'],
    importanceWeight: 4
  }
];

/**
 * Normalizes text and tokenizes into unigrams and bigrams
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}
