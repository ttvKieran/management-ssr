module.export.newPriceProduct = (product) => {
    const newPrice = (product.price * (100 - product.didiscountPercentage) / 100).toFixed(0);
    return parseInt(newPrice);
}