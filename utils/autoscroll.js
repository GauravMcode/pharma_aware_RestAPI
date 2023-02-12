/*To scroll till down to get dynamic elements as well
src :https://github-com.translate.goog/chenxiaochun/blog/issues/38?_x_tr_sl=zh-CN&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=sc*/
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 50;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= ((scrollHeight - window.innerHeight) / 2)) {
                    clearInterval(timer);
                    resolve();
                }
            }, 20);
        });
    })
}

module.exports = autoScroll;