import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url, selector) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const results = [];
    $(selector).each((i, element) => {
      results.push({
        text: $(element).text().trim(),
        html: $(element).html(),
        attributes: element.attribs
      });
    });

    return results;
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to fetch URL: ${error.response.status}`);
    }
    throw new Error('Failed to scrape website');
  }
}
