import Blog from '../models/blog.model.js';
import llmBlog from '../models/llmBlog.model.js';
import { scrapeOldestBlogs, scrapeArticleContent } from '../services/scrapper.service.js';
import { searchBlogArticles } from '../services/search.service.js';
import { generateUpdatedArticle } from '../services/llm.service.js';
import appResponse from '../utils/appResponse.js';
import { NotFoundError, BadRequestError } from '../utils/appError.js';


/* ===== SCRAPE & SAVE ===== */
export const scrapeBlogs = async (req, res, next) => {
    try {
        const MIN_LIMIT = 1;
        const MAX_LIMIT = 20;
        const blog_limit = Number(req.query?.limit) || 5;

        if (isNaN(blog_limit)) {
            throw new BadRequestError('Limit must be a valid number');
        }

        if (blog_limit < MIN_LIMIT || blog_limit > MAX_LIMIT) {
            throw new BadRequestError(`Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
        }

        const blogs = await scrapeOldestBlogs(blog_limit);

        await Blog.bulkWrite(blogs.map(blog => ({
            updateOne: {
                filter: { link: blog.link },
                update: { $set: blog },
                upsert: true
            }
        })));

        appResponse(res, {
            statusCode: 201,
            message: 'Blogs scraped successfully',
            data: {
                blogs,
                count: blogs.length
            }
        });
    } catch (error) {
        next(error);
    }
};

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

        const blogs = await Blog.find().sort({ createdAt: 1 }).limit(limit).lean();

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
        const blog = await Blog.findById(req.params.id);

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
        const blog = await Blog.findByIdAndUpdate(
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
        const blog = await Blog.findByIdAndDelete(req.params.id);

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

/* ===== REWRITE BLOG WITH LLM ===== */
export const rewriteBlog = async (req, res, next) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        const searchResults = await searchBlogArticles(blog.title, 2);


        if (searchResults.length === 0) {
            throw new BadRequestError('No blog/article results found for this topic');
        }

        // Step 2: Scrape content from those URLs
        const scrapedArticles = [];
        const referenceBlogLinks = [];

        for (const result of searchResults) {
            const article = await scrapeArticleContent(result.link, result.metaDesc, result.position);
            if (article.isValid) {
                referenceBlogLinks.push(result.link)
                scrapedArticles.push(article)
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (scrapedArticles.length === 0) {
            throw new BadRequestError('Could not scrape valid content from search results');
        }

        // Step 3: Now llm will generate updated content 
        const llmResult = await generateUpdatedArticle({
            originalArticle: blog,
            referenceArticles: scrapedArticles
        });

        const newLlmBlog = new llmBlog({
            originalBlog: blogId,
            title: llmResult.title,
            metaDesc: llmResult.metaDesc,
            contentMarkdown: llmResult.contentMarkdown,
            references: referenceBlogLinks
        });

        const savedLlmBlog = await newLlmBlog.save();

        console.log('✅ Article processing complete!');

        appResponse(res, {
            message: `Found and scraped ${scrapedArticles.length} reference articles`,
            data: {
                blog: {
                    original: blog,
                    updated: savedLlmBlog
                }
            }
        });
    } catch (error) {
        next(error);
    }
};