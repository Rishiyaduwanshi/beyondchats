const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api/v1';

class ApiService {
    // Scrape blogs
    static async scrapeBlogs(limit = 5) {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/scrape?limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error scraping blogs:', error);
            throw error;
        }
    }

    // Get all blogs
    static async getAllBlogs() {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error;
        }
    }

    // Get single blog by ID
    static async getBlogById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blog:', error);
            throw error;
        }
    }

    // Get all LLM blogs
    static async getAllLLMBlogs() {
        try {
            const response = await fetch(`${API_BASE_URL}/llmblogs`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching LLM blogs:', error);
            throw error;
        }
    }

    // Get single LLM blog by ID
    static async getLLMBlogById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/llmblogs/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching LLM blog:', error);
            throw error;
        }
    }

    // Get all versions of a blog by original blog ID
    static async getBlogVersions(originalBlogId) {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/${originalBlogId}/versions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blog versions:', error);
            throw error;
        }
    }

    // Rewrite blog with AI
    static async rewriteBlog(blogId) {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/rewrite`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error rewriting blog:', error);
            throw error;
        }
    }

    // Delete blog
    static async deleteBlog(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }

    // Delete LLM blog
    static async deleteLLMBlog(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/llmblogs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting LLM blog:', error);
            throw error;
        }
    }
}

export default ApiService;
