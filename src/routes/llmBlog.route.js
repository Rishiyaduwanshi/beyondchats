import express from 'express';
import { getBlogs, getBlogById, updateBlog, deleteBlog, getBlogVersionsByOriginalId } from '../controllers/llmBlog.controller.js'

const router = express.Router();

router.get('/', getBlogs);
router.get('/versions/:originalBlogId', getBlogVersionsByOriginalId);
router.get('/:id', getBlogById);
router.post('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
