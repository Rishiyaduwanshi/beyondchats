import { scrapeArticleContent } from "../src/services/scrapper.service.js";

// const result = await scrapeArticleContent("https://www.gcc-marketing.com/chatbot-development-a-comprehensive-guide-for-beginners/")
const result = await scrapeArticleContent("https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca")

console.log(result)