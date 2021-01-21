const puppeteer = require('puppeteer')
const URL = 'http://pre.elpais.com.co/'
const fs = require('fs')
const device = process.argv.slice(2,3)  //  dispositivo
const name = process.argv.slice(3,4)    //  nombre del archivo
const query = process.argv.slice(4,5)   //  ruta interna

;(async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  await page.setViewport({
    width: device == "mobile" ? 380: 1200,
    height: device == "mobile" ? 540 : 920
  })

  await page.coverage.startCSSCoverage()
  await page.goto(URL, {waitUntil: 'load'}) // domcontentload, load, networkidle0

  const cssCoverage = await page.coverage.stopCSSCoverage()

  let createContent = new Promise( (resolve, reject) =>{
    let criticalCSS = ''
    for (const entry of cssCoverage) {
      for (const range of entry.ranges) {
        criticalCSS += entry.text.slice(range.start, range.end) + "\n"
      }
    }
    resolve(criticalCSS);
  })

  createContent.then( criticalCSS => {
    console.log(criticalCSS)
    //fs.writeFileSync('critical.css', criticalCss);
  })
  

  await page.close()
  await browser.close()
})()
