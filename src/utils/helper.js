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
