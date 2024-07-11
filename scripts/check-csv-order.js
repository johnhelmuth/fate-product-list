
import process from 'node:process';
import {getProducts, Product}  from './lib/products.js';

(async (path) => {
  console.log('check-csv-order: started.');

  // Parse CSV rows into object products.
  const products = await getProducts(path);
  // console.log('products: ', products);

  let isOutOfOrder = false;

  // Compare each product to the next product, list if they are out of order.
  for (let i = 1; i < products.length; i++) {
    if (products[i-1].compare(products[i]) > 0) {
      if (! isOutOfOrder) {
        // This is the first one we found, print header for list of out of order products.
        console.log('\nProducts are out of order:\n');
        isOutOfOrder = true;
      }
      console.log(`Line ${i+1}: "${products[i-1].toString()}"\nLine ${i+2}: "${products[i].toString()}"`)
    }
  }
  if (! isOutOfOrder) {
    console.log(`${path} is correctly ordered.`);
  } else {
    process.exitCode = 1;
    console.log('');
  }
  console.log(`check-csv-order: finished.`);
})('fate-product-list.csv');


