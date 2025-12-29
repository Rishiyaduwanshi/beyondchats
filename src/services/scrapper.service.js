import { fetchHTML, cleanContent, validateContent } from '../utils/helper.js';

const BASE_URL = 'https://beyondchats.com/blogs/';

/* ===== get last page ===== */
function getLastPageNumber($) {
  const pages = [];
  $('.page-numbers').each((_, el) => {
    const num = parseInt($(el).text());
    if (!isNaN(num)) pages.push(num);
  });
  return Math.max(...pages);
}

/* ===== fetch oldest links ===== */
async function getOldestBlogLinks(limit = 5) {
  const $first = await fetchHTML(BASE_URL);
  const lastPage = getLastPageNumber($first);

  const blogs = [];
  let page = lastPage;

  while (blogs.length < limit && page > 0) {
    const $ = await fetchHTML(`${BASE_URL}page/${page}/`);

    $('article h2 a').each((_, el) => {
      blogs.push({
        title: $(el).text().trim(),
        link: $(el).attr('href')
      });
    });

    page--;
  }

  return blogs.slice(0, limit);
}

async function scrapeBeyondChatsBlog(blog) {
  const $ = await fetchHTML(blog.link);

  const container =
    $('.elementor-widget-theme-post-content').first().length
      ? $('.elementor-widget-theme-post-content').first()
      : $('.entry-content').first();

  const content = container.length ? cleanContent(container) : '';

  return { ...blog, content };
}

export async function scrapeOldestBlogs(blog_limit) {
  const oldestBlogs = await getOldestBlogLinks(blog_limit);

  const allBlogs = [];

  for (const blog of oldestBlogs) {
    const fullBlog = await scrapeBeyondChatsBlog(blog);
    allBlogs.push(fullBlog);
  }

  return allBlogs;
}

export async function scrapeArticleContent(url) {
  try {
    const $ = await fetchHTML(url);

    const selectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main article',
      '[role="main"]',
      '.blog-post',
    ];

    let content = '';
    let container = null;

    for (const selector of selectors) {
      container = $(selector).first();
      if (container.length && container.text().trim().length > 200) {
        content = cleanContent(container);
        break;
      }
    }

    if (!content || content.length < 100) {
      const paragraphs = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    const title = $('h1').first().text().trim() ||
      $('title').text().trim() ||
      'No title found';

    const validation = validateContent(content);

    return {
      title,
      link: url,
      content,
      ...validation
    };

  } catch (error) {
    return {
      title: 'Scraping failed',
      link: url,
      content: '',
      contentLength: 0,
      isValid: false,
      reason: error.message
    };
  }
}
