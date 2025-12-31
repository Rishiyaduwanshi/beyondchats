import express from 'express';
import {
  scrapeBlogs,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rewriteBlog
} from '../controllers/blog.controller.js';
import { getBlogVersionsByOriginalId } from '../controllers/llmBlog.controller.js';

const router = express.Router();

router.get('/scrape', scrapeBlogs);
router.get('/', getBlogs);
router.get('/:id/versions', getBlogVersionsByOriginalId); 
router.post('/:blogId/rewrite', rewriteBlog); 
router.get('/:id', getBlogById);
router.post('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
