import Groq from "groq-sdk";
import { config } from '../../config/index.js';
import { AppError } from "../utils/appError.js";


if (!config.GROQ_API_KEY) {
    throw new Error("No Groq API Key provided");
}

const groq = new Groq({
    apiKey: config.GROQ_API_KEY
});

export async function generateUpdatedArticle({
    originalArticle,
    referenceArticles
}) {

    if (!referenceArticles || !originalArticle) throw new AppError({ message: "Reference or original article is missing", statusCode: 400 })

    const systemPrompt = `
You are a senior SEO content strategist, technical blog editor, and plagiarism auditor.

GOAL:
Transform an existing blog post into a high-quality, Google-competitive article.

STRICT RULES (NON-NEGOTIABLE):
- Do NOT copy phrases, sentences, or structure from reference articles
- Given reference articles are the articles which are on the top of google ranking  ONLY for:
  - understanding search intent
  - identifying missing subtopics
  - improving topical depth
- The output must be 100% original and plagiarism-safe
- No paraphrasing of reference content
- Write naturally like a human expert, not an AI
- Avoid over-optimization or keyword stuffing

CONTENT GUIDELINES:
- Long-form, in-depth blog content
- Clear heading hierarchy (H1, H2, H3)
- Improve readability, flow, and clarity
- Add missing sections that users expect
- Maintain factual accuracy

OUTPUT FORMAT:
- Return clean Markdown only
- No explanations, no notes, no analysis
  ***
`;
    const userPrompt = `
TASK:
You are given:
1) An ORIGINAL ARTICLE
2) Two REFERENCE ARTICLES selected from top-ranking Google results

Your task:
- Rewrite and significantly enhance the ORIGINAL ARTICLE
- Improve clarity, depth, structure, and SEO competitiveness
- Expand sections where required
- Add new sections that align with search intent
- Keep the topic and meaning intact, but improve overall quality

ORIGINAL ARTICLE:
"""
${originalArticle.content}
"""

REFERENCE ARTICLE 1 (title, link,  meta desc & content):
Title: ${referenceArticles[0].title}
Meta Description: ${referenceArticles[0].metaDesc}
Link: ${referenceArticles[0].link}

Content:
"""
${referenceArticles[0].content}
"""

REFERENCE ARTICLE 2 (title, link, meta desc & content):
Title: ${referenceArticles[1].title}
Meta Description: ${referenceArticles[1].metaDesc}
Link: ${referenceArticles[1].link}

Content:
"""
${referenceArticles[1].content}
"""
`;

    try {

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            temperature: 0.6,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    strict: true,
                    name: "updated_blog",
                    schema: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            slug: { type: "string" },
                            metaDesc: { type: "string" },
                            contentMarkdown: { type: "string" },
                        },
                        required: [
                            "title",
                            "slug",
                            "metaDesc",
                            "contentMarkdown"
                        ],
                        additionalProperties: false
                    }
                }
            }
        });
        return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
        throw error;
    }
}



