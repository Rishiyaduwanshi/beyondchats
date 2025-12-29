import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchHTML(url) {
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
        }
    });

    return cheerio.load(data);
}


export function cleanContent($container) {
    $container
        .find('script, style, nav, footer, button, svg, form')
        .remove();

    return $container
        .text()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

export function isBlogArticleUrl(url) {
    const urlLower = url.toLowerCase();

    const excludedDomains = [
        'youtube.com', 'youtu.be',
        'facebook.com', 'fb.com',
        'twitter.com', 'x.com',
        'instagram.com',
        'linkedin.com',
        'pinterest.com', 'pin.it',
        'amazon.com', 'amazon.in', 'amzn.to',
        'flipkart.com',
        'reddit.com',
        'quora.com',
        'stackoverflow.com',
        'github.com',
        'beyondchats.com',  
    ];

    if (excludedDomains.some(domain => urlLower.includes(domain))) {
        return false;
    }

    if (urlLower.includes('/product/') || urlLower.includes('/buy/') ||
        urlLower.includes('/cart/') || urlLower.includes('/shop/')) {
        return false;
    }

    if (urlLower.includes('/login') || urlLower.includes('/signup') ||
        urlLower.includes('/register') || urlLower.includes('/auth')) {
        return false;
    }

    return true;
}

export function hasAuthWall(content) {
    if (!content || content.length < 100) return true;

    const authIndicators = [
        'sign in', 'log in', 'subscribe',
        'premium content', 'members only',
        'create an account', 'register to read'
    ];

    const contentLower = content.toLowerCase();
    return authIndicators.some(indicator =>
        contentLower.includes(indicator) && content.length < 1000
    );
}

export function validateContent(content, minLength = 500) {
    if (!content || content.length < minLength) {
        return {
            isValid: false,
            reason: `Content too short (${content?.length || 0} chars, need ${minLength}+)`
        };
    }

    if (hasAuthWall(content)) {
        return {
            isValid: false,
            reason: 'Content behind auth/paywall'
        };
    }

    return { isValid: true };
}
