import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()} (${msg.location().url})`);
  });
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]', error.message);
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.error('[HTTP ERROR]', response.status(), response.url());
    }
  });

  try {
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded');
    const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML);
    console.log('Root HTML length:', rootHtml?.length);
  } catch (err) {
    console.error('PUPPETEER ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
