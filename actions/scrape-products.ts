'use server';

import { revalidatePath } from 'next/cache';
import puppeteer from 'puppeteer';

export const scrapeProdcuts = async (url: string) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const navigatepromise = page.waitForNavigation({
      waitUntil: 'networkidle0',
      timeout: 120000,
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

    await page.addScriptTag({
      url: 'https://code.jquery.com/jquery-3.6.0.min.js',
    });

    await navigatepromise;

    const isJQueryLoaded = await page.evaluate(() => !!(window as any)?.jQuery);
    if (!isJQueryLoaded) {
      throw new Error('jQuery not loaded');
    }

    const data = await page.evaluate(() => {
      const price = $('div.amount--3NTpl').text().trim();
      const title = $('h1.title--3s1R8').text().trim();
      const description = $('div.description--1nRbz').find('p').text().trim();

      let features: string[] = [];
      $('._27f9c8ac')
        .children()
        .each(function () {
          features?.push($(this).text());
        });

      return { title, price, description, features };
    });

    await browser.close();
    revalidatePath('/');
    return { ...data, url };
  } catch (error) {
    return null;
  }
};
