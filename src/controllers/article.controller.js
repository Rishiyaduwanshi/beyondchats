import Blog from '../models/blog.model.js';
import { searchBlogArticles } from '../services/search.service.js';
import { scrapeArticleContent } from '../services/scrapper.service.js';
import appResponse from '../utils/appResponse.js';
import { NotFoundError, BadRequestError } from '../utils/appError.js';

/**
 * PHASE 2: Process article - Search Google, scrape top articles
 */
export const searchOnGoogle = async (req, res, next) => {
    try {
        const { blogId } = req.params;

        console.log("blogId------",  blogId)

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

        for (const result of searchResults) {
            const article = await scrapeArticleContent(result.link);

            if (article.isValid) {
                scrapedArticles.push(article)
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (scrapedArticles.length === 0) {
            throw new BadRequestError('Could not scrape valid content from search results');
        }

        appResponse(res, {
            message: `Found and scraped ${scrapedArticles.length} reference articles`,
            data: {
                originalBlog: blog,
                referenceArticles: scrapedArticles
            }
        });
    } catch (error) {
        next(error);
    }
};
