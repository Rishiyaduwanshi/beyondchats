import axios from 'axios';
import { config } from '../../config/index.js';
import { isBlogArticleUrl } from '../utils/helper.js';


export async function searchGoogle(query, numResults = 10) {
    try {
        const apiKey = config.SERPAPI;

        if (!apiKey) {
            throw new Error('SERPAPI_KEY not found in environment variables');
        }

        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: `${query} -filetype:pdf -filetype:doc -filetype:docx -filetype:ppt -filetype:pptx -filetype:json -site:youtube.com -site:vimeo.com`,
                api_key: apiKey,
                engine: 'google',
                num: numResults,
            }
        });

        const organicResults = response.data.organic_results || [];

        const blogArticles = organicResults
            .filter(result => isBlogArticleUrl(result.link))
            .map(result => ({
                title: result.title,
                link: result.link,
                metaDesc: result.snippet,
                position: result.position
            }));

        return blogArticles;
    } catch (error) {
        throw new Error(`Google search failed: ${error.message}`);
    }
}


export async function searchBlogArticles(articleTitle, count = 2) {
    try {
        console.log(`🔍 Searching Google for: "${articleTitle}"`);

        const results = await searchGoogle(articleTitle, 20);

        if (results.length === 0) {
            throw new Error('No suitable blog/article results found');
        }

        const topResults = results.slice(0, count);

        console.log(`✅ Found ${topResults.length} blog/article results`);
        topResults.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}`);
            console.log(`   ${result.link}`);
        });

        return topResults;
    } catch (error) {
        console.error('Error searching blog articles:', error.message);
        throw error;
    }
}
