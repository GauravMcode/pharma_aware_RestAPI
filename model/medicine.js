const Medicine = class {
    constructor(title, price, imageUrl, pageUrl, description) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.pageUrl = pageUrl;
    }
}

module.exports = Medicine;