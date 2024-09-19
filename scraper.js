import axios from 'axios';
import * as cheerio from 'cheerio';  // Use named import for cheerio

export const scrapeGoogleNews = async (query) => {
    const url = `https://news.google.com/search?q=${encodeURIComponent(query)}`;
    
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const articles = [];

        $('article').each((index, element) => {
            const title = $(element).find('h3').text();
            const link = $(element).find('a').attr('href');
            if (title && title.toLowerCase().includes('liberia')) {
                articles.push({
                    title,
                    link: link ? (link.startsWith('http') ? link : `https://news.google.com${link}`) : null,
                });
            }
        });

        return articles;
    } catch (error) {
        console.error(`Failed to retrieve news: ${error.message}`);
        return [];
    }
};

// Remove the IIFE if you don't need it in this file
