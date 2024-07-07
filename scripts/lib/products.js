
import fs from 'node:fs/promises';

import {parse as csvParse} from 'csv-parse/sync';

const compStrings = new Intl.Collator('en-us', {sensitivity: 'base'}).compare; // , ignorePunctuation: true

export async function getProducts(path) {

  const columnNameMap = new Map([
    ["Publisher Name", "publisherName"],
    ["Product title", "productTitle"],
    ["Link to the product", "productLink"]
  ]);

  const fileContents = await fs.readFile(path, {encoding: 'utf8'});

  // Parse CSV rows into object records.
  const records = csvParse(fileContents, {
    columns: header => header.map(column => {
      if (columnNameMap.has(column)) {
        return columnNameMap.get(column);
      }
    }).filter(name => !! name)
  });

  let products = records.map(record => { return new Product(record)});
  return products;
}

export class Product {

  publisherName = '';
  productTitle = '';
  productLink = '';

  /**
   * Product constructor.
   *
   * @param {publisherName: string, productTitle: string} record
   */
  constructor (record) {
    this.publisherName = record?.publisherName;
    this.productTitle = record?.productTitle;
    this.productLink = record?.productLink;
  }

  /**
   * Generates a string describing this product.
   *
   * @returns {string}
   */
  toString() {
    return `${this.publisherName},${this.productTitle},${this.productLink}`;
  }

  /**
   * Compares this Product to another product.
   *
   * @param {Product} b
   * @returns {number}
   */
  compare(b) {
    const pubCompare = compStrings(this.publisherName, b.publisherName);
    if (pubCompare === 0) {
      return compStrings(this.productTitle, b.productTitle);
    }
    return pubCompare;
  }

  /**
   * Compares 2 product records by publisher then title.
   *
   * Encapsulates method to match Array.prototype.sort() parameter convention.
   *
   * @param {Product} a
   * @param {Product} b
   *
   * @returns {number}
   */
  static compRecords(a, b) {
    return a.compare(b);
  }
}