import express from 'express';
import {
  scrapeBlogs,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blog.controller.js';
import { processBlog } from '../controllers/article.controller.js';

const router = express.Router();

router.get('/scrape', scrapeBlogs);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/:id', updateBlog);
router.post('/:blogId/rewrite', processBlog);
router.delete('/:id', deleteBlog);

export default router;
