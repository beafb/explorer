const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const fetch = require('node-fetch')

exports.handler = async (event, context, callback) => {
  let data = null
  let browser = null
  console.log('spawning chrome headless')
  try {
    const executablePath = await chromium.executablePath

    // setup
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
    })
    console.log('0')
    // Do stuff with headless chrome
    const page = await browser.newPage()
    await page.goto('https://www.amendes.gouv.fr/');
  // const b = getData('ab',function(data){
  //   return(data);
  // })
  const resp = await fetch('https://paiement-multicanal-api.ca.gouv.fr/api/v1/recherche/amende?numAmende=075062031211358761&cleAmende=89', {
    headers: {
        'Connection': 'keep-alive',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'Accept': 'application/json, text/plain, */*',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
        'sec-ch-ua-platform': '"macOS"',
        'Origin': 'https://www.amendes.gouv.fr',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://www.amendes.gouv.fr/',
        'Accept-Language': 'fr,en-US;q=0.9,en;q=0.8'
    }
});
  data = await resp.json()

  } catch (error) {
    console.log('error', error)
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: error
      })
    })
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close()
    }
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      title: data,
    })
  })
}
