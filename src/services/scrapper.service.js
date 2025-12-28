import { fetchHTML, cleanContent } from '../utils/helper.js';

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

/* ===== scrape full blog ===== */
async function scrapeFullBlog(blog) {
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
    const fullBlog = await scrapeFullBlog(blog);
    allBlogs.push(fullBlog);
  }

  return allBlogs;
}
