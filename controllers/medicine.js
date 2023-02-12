const puppeteer = require('puppeteer');
const io = require('../utils/socket');

const Medicine = require('../model/medicine')
const autoScroll = require('../utils/autoscroll')


exports.getMedInfo = async function (req, res, next) {
    const socketId = req.socketId;
    browser = await puppeteer.launch({ defaultViewport: false });
    page = await browser.newPage();
    const medicineName = req.params.searchTerm;
    const MED_NO = process.env.MED_NO;
    console.log(`Searching for: ${medicineName}`);
    let meds_1mg = [];
    await page.goto(`https://www.1mg.com/search/all?name=${medicineName}`, { waitUntil: 'domcontentloaded' }),
        await autoScroll(page); //scroll till half
    meds_1mg = await page.$$eval('div.style__horizontal-card___1Zwmt', divs => divs.map(div => {
        return {
            title: div.querySelector('.style__pro-title___3zxNC').textContent,
            price: div.querySelector('.style__price-tag___B2csA').textContent,
            imageUrl: '',
            pageUrl: div.querySelector('a').href,
            description: ""  //ProductDescription__description-content___A_qCZ
        }
    }));
    if (meds_1mg.length === 0) {
        // style__product-box___3oEU6
        meds_1mg = await page.$$eval('div.style__product-box___3oEU6', divs => divs.map(div => {
            return {
                title: div.querySelector('.style__pro-title___3G3rr').textContent,
                price: div.querySelector('.style__price-tag___KzOkY').textContent,
                imageUrl: '',
                pageUrl: div.querySelector('a').href,
                description: ""
            }
        }));
    }
    meds_1mg = meds_1mg.filter((value, index, arr) => index < MED_NO); //limit till 13 elements
    const images = await page.$$eval('.style__loaded___22epL', imgs => imgs.map(image => image.getAttribute('src')))
    for (let i = 0; i < meds_1mg.length; i++) {
        if (i >= images.length) {
            continue;
        }
        meds_1mg[i].imageUrl = images[i];
    }
    await browser.close();
    res.status(200).json({ meds_1mg: meds_1mg })

    if (!socketId) {
        console.log('Socket id undefined: Socket not connected')
        return;
    }
    let medLinks = [];
    meds_1mg.forEach(element => {
        medLinks.push(element.pageUrl);
    });

    /* Going to new page and blocking for image  request on that page */
    try {
        const browser1 = await puppeteer.launch({ defaultViewport: false });
        const page1 = await browser1.newPage();
        await page1.setRequestInterception(true)
        page1.on('request', (request) => {
            if (request.resourceType() === 'image') request.abort()
            else request.continue()
        })
        //getting desc for each med
        for (let i = 0; i < medLinks.length; i++) {
            await page1.goto(medLinks[i], { waitUntil: 'domcontentloaded' });
            // await autoScroll(page1);
            let description;
            if (medLinks[i].includes('drugs')) {
                console.log('drug..');
                description = await page1.$eval('#overview > div > div > div > div', desc => desc.innerText);
            }
            else if (medLinks[i].includes('otc')) {
                description = await page1.$eval('div.ProductDescription__description-content___A_qCZ', desc => desc.innerText);
            }
            // descLinks.push(description);
            io.getIO().to(socketId).emit('fetchDescription', description);
        }

        await browser1.close();
        // res.status(200).json({ descLinks: descLinks });
        return;
    }
    catch (err) {
        console.log(err);
    }
}



// (async () => {
//     let medicines = await medInfo('paracetamol');
//     medDesc(medicines);
// })()