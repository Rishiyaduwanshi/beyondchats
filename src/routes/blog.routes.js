import express from 'express';
import {
  scrapeBlogs,
  getBlogs,
  getBlogById,
  deleteBlog
} from '../controllers/blog.controller.js';

const router = express.Router();

// Specific routes first, before dynamic :id routes
router.get('/scrape', scrapeBlogs);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.delete('/:id', deleteBlog);

export default router;
