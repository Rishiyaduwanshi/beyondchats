import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { AppError } from './utils/appError.js';
import httpLogger from './utils/appLogger.js';
import globalErrorHandler from './middlewares/globalError.mid.js';
import { corsOptions } from '../config/cors.js';

const app = express();

app.use(cors(corsOptions));
app.use(httpLogger);
app.use(rateLimit(config.GLOBAL_RATE_LIMIT_CONFIG));
app.use(rateLimit(config.PER_IP_RATE_LIMIT_CONFIG));
app.use(express.json());

// Routes
import indexRoutes from './routes/index.js';
import blogRoutes from './routes/blog.routes.js';
import llmBlogRoutes from './routes/llmBlog.route.js';

// API routes
const api = express.Router();

api.get("/", (_, res) => {
  res.redirect("/")
})

app.use('/', indexRoutes);
api.use('/blogs', blogRoutes);
api.use('/llmblogs', llmBlogRoutes);

app.use(`/api/v${config.VERSION.split(".")[0]}`, api);

// 404 handler for undefined routes
app.use((_, __, next) => {
  next(new AppError({ statusCode: 404, message: 'Route not found' }));
});

app.use(globalErrorHandler);
export default app;
