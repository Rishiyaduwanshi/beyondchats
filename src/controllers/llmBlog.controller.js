import llmBlog from '../models/llmBlog.model.js';
import appResponse from '../utils/appResponse.js';
import { NotFoundError, BadRequestError } from '../utils/appError.js';

/* ===== CRUD ===== */
export const getBlogs = async (req, res, next) => {
    try {
        const MIN_LIMIT = 1;
        const MAX_LIMIT = 50;
        const limit = Number(req.query?.limit) || 20;

        if (isNaN(limit)) {
            throw new BadRequestError('Limit must be a valid number');
        }

        if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
            throw new BadRequestError(`Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
        }

        const blogs = await llmBlog.find().sort({ createdAt: 1 }).limit(limit).lean();

        appResponse(res, {
            message: 'Blogs fetched successfully',
            data: {
                blogs,
                count: blogs.length
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getBlogById = async (req, res, next) => {
    try {
        const blog = await llmBlog.findById(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        appResponse(res, {
            message: 'Blog fetched successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const blog = await llmBlog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        appResponse(res, {
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await llmBlog.findByIdAndDelete(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        appResponse(res, {
            message: 'Blog deleted successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

export const getBlogVersionsByOriginalId = async (req, res, next) => {
    try {
        const { originalBlogId } = req.params;

        if (!originalBlogId) throw new BadRequestError('Original blog ID is required');

        const blogVersions = await llmBlog
            .find({ originalBlog: originalBlogId })
            .select("-originalBlog")
            .sort({ version: 1 })
            .lean();

        if (!blogVersions || blogVersions.length === 0) {
            throw new NotFoundError('No blog versions found for this original blog');
        }

        appResponse(res, {
            message: 'Blog versions fetched successfully',
            data: {
                originalBlogId,
                versions: blogVersions
            }
        });
    } catch (error) {
        next(error);
    }
};