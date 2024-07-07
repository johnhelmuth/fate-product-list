
import process from 'node:process';
import {getProducts, Product}  from './lib/products.js';

(async (path) => {
  console.log('check-csv-order: started.');

  // Parse CSV rows into object products.
  const products = await getProducts(path);
  // console.log('products: ', products);

  // Sort products
  const productsSorted = products.toSorted(Product.compRecords);
  // console.log('productsSorted: ', productsSorted);

  // Compare input products to sorted products, exit with process error on first difference.
  for (let i = 0; i < products.length; i++) {
    if (products[i].compare(productsSorted[i]) !== 0) {
      console.log(`Mismatch on line ${i+2}:\n input: "${products[i].toString()}"\nsorted: "${productsSorted[i].toString()}"`)
      process.exit(1);
    }
  }
  console.log(`check-csv-order: finished, ${path} is correctly ordered.`);
})('fate-product-list.csv');


