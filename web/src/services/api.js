const API_BASE_URL = 'http://localhost:5050/api/v1';

class ApiService {
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
}

export default ApiService;
