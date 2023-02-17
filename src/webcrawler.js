const puppeteer = require("puppeteer");
const axios = require("axios");

const webCrawler = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://devgo.com.br/");

  const articles = await page.evaluate(() => {
    const articles = [];
    const elements = document.querySelectorAll(".blog-article-card-title");
    for (let element of elements) {
      const url = element.querySelector("a").getAttribute("href") || "";
      const title = element.querySelector("a").textContent.trim();
      const author = "DevGo";
      articles.push({ title, url, author });
    }
    return articles;
  });

 

  for (const article of articles) {
    console.log(article)
    try {
      const response = await axios.post(
        "https://devnology-trainee.herokuapp.com/articles",
        article
        
      );
      
      console.log(response.data);
    } catch (error) {
      console.log(`Failed to send article to API: ${error.message}`);
    }
  }

  await browser.close();
};

webCrawler();
