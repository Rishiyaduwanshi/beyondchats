import express from 'express';
import {
  scrapeBlogs,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rewriteBlog
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/scrape', scrapeBlogs);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/:id', updateBlog);
router.post('/:blogId/rewrite', rewriteBlog);
router.delete('/:id', deleteBlog);

export default router;
