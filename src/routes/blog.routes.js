import express from 'express';
import {
  scrapeBlogs,
  getBlogs,
  getBlogById,
  deleteBlog
} from '../controllers/blog.controller.js';
import { searchOnGoogle } from '../controllers/article.controller.js';

const router = express.Router();

router.get('/scrape', scrapeBlogs);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.get('/:blogId/search', searchOnGoogle); 
router.delete('/:id', deleteBlog);

export default router;
