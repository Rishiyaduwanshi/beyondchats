import { Router } from 'express';
import appResponse from '../utils/appResponse.js';

const router = Router();

// API Documentation
const getAPIInfo = () => ({
  project: {
    name: 'BeyondChats Blog Enhancement API',
    version: '1.0.0',
    description: 'AI-powered blog content enhancement system that scrapes articles, researches top-ranking content, and generates optimized versions using LLM',
    author: {
      name: 'Abhinav Prakash',
      github: 'https://github.com/rishiyaduwanshi',
      portfolio: 'https://iamabhinav.dev'
    }
  },
  tech_stack: {
    backend: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    scraping: ['Cheerio', 'Axios'],
    ai: ['Groq API (LLaMA 3.1)', 'Google Search (SerpAPI)'],
    frontend: ['React', 'Vite', 'TailwindCSS', 'React Router', 'React Markdown']
  },
  features: [
    'Web scraping from BeyondChats blog',
    'Google search integration for competitive analysis',
    'Content scraping from top-ranking articles',
    'AI-powered content rewriting with LLM',
    'Version control for article iterations',
    'RESTful API architecture',
    'Markdown content support',
    'Reference citations'
  ],
  api_endpoints: {
    blogs: {
      scrape: {
        method: 'GET',
        path: '/api/v1/blogs/scrape',
        description: 'Scrape oldest articles from BeyondChats blog',
        query: { limit: 'Number of articles (1-20, default: 5)' }
      },
      list: {
        method: 'GET',
        path: '/api/v1/blogs',
        description: 'Get all scraped blog articles',
        query: { limit: 'Number of results (1-50, default: 20)' }
      },
      getById: {
        method: 'GET',
        path: '/api/v1/blogs/:id',
        description: 'Get single blog article by ID'
      },
      versions: {
        method: 'GET',
        path: '/api/v1/blogs/:id/versions',
        description: 'Get all AI-enhanced versions of a blog'
      },
      rewrite: {
        method: 'POST',
        path: '/api/v1/blogs/:id/rewrite',
        description: 'Generate AI-enhanced version using Google search & LLM'
      },
      update: {
        method: 'POST',
        path: '/api/v1/blogs/:id',
        description: 'Update blog article',
        body: { title: 'string', content: 'string', description: 'string' }
      },
      delete: {
        method: 'DELETE',
        path: '/api/v1/blogs/:id',
        description: 'Delete blog article'
      }
    },
    llm_blogs: {
      list: {
        method: 'GET',
        path: '/api/v1/llmblogs',
        description: 'Get all AI-enhanced articles',
        query: { limit: 'Number of results (1-50, default: 20)' }
      },
      getById: {
        method: 'GET',
        path: '/api/v1/llmblogs/:id',
        description: 'Get single AI-enhanced article by ID'
      },
      update: {
        method: 'POST',
        path: '/api/v1/llmblogs/:id',
        description: 'Update AI-enhanced article'
      },
      delete: {
        method: 'DELETE',
        path: '/api/v1/llmblogs/:id',
        description: 'Delete AI-enhanced article'
      }
    }
  },
  workflow: {
    steps: [
      '1. Scrape original articles from BeyondChats blog',
      '2. User triggers AI rewrite for an article',
      '3. System searches article title on Google (SerpAPI)',
      '4. Scrapes content from top 2 blog/article results',
      '5. Sends original + scraped content to LLM (Groq)',
      '6. LLM generates optimized version matching top-ranking style',
      '7. New version saved with references to source articles',
      '8. Version history maintained for each original article'
    ]
  },
  references: {
    docs: [
      { name: 'Groq API', url: 'https://console.groq.com/docs' },
      { name: 'Cheerio', url: 'https://cheerio.js.org/' },
      { name: 'SerpAPI', url: 'https://serpapi.com/search-api' },
      { name: 'React Markdown', url: 'https://github.com/remarkjs/react-markdown' }
    ],
    boilerplate: {
      name: 'Express Boilerplate',
      repo: 'https://github.com/rishiyaduwanshi/boiler',
      description: 'Ready-to-go Express.js starter with logging, error handling & auth'
    }
  },
  setup: {
    requirements: ['Node.js 18+', 'MongoDB', 'Groq API Key', 'SerpAPI Key'],
    env_variables: [
      'MONGO_URI - MongoDB connection string',
      'GROQ_API_KEY - Groq API key for LLM',
      'SERPAPI_KEY - SerpAPI key for Google search',
      'PORT - Server port (default: 5050)'
    ]
  }
});

// Root route - API documentation
router.get('/', (req, res) => {
  appResponse(res, {
    message: 'Welcome to BeyondChats Blog Enhancement API',
    data: getAPIInfo()
  });
});

// Health check route
router.get('/health', (req, res) => {
  const uptime = process.uptime();

  appResponse(res, {
    message: 'Server is healthy',
    data: {
      status: 'UP',
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

export default router;