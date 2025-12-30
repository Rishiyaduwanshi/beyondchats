import Blog from '../models/blog.model.js';
import { searchBlogArticles } from '../services/search.service.js';
import { scrapeArticleContent } from '../services/scrapper.service.js';
import { generateUpdatedArticle } from '../services/llm.service.js';
import appResponse from '../utils/appResponse.js';
import { NotFoundError, BadRequestError } from '../utils/appError.js';
import llmBlog from '../models/llmBlog.model.js';

/**
 * PHASE 2: Process blog - Search Google, scrape top blogs
 */
export const processBlog = async (req, res, next) => {
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
