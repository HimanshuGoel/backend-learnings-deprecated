// Generic arrays
const books: Array<BookType> = [];

interface BookType {
  title: string;
  catalogNumber: number;
}

// Generic functions
function logAndReturn<T>(value: T): T {
  console.log(value);
  return value;
}
const someString = logAndReturn<string>('Hello');
const someNumber = logAndReturn<number>(0);
const someBook = logAndReturn<BookType>({ title: 'The Dark Tower' });

function purge<T>(items: Array<T>): Array<T> {
  return items.splice(2, items.length);
}
const purgedResult = purge<string>(['a', 'b', 'c', 'd', 'e']);

// Generic interfaces and class with constraints
interface CatalogItem {
  catalogNumber: number;
}

interface Inventory<T> {
  add(item: T): void;
  remove?(item: T): void;
  getItems?(): Array<T>;
}
let bookInventory: Inventory<BookType>;

class Catalog<T extends CatalogItem> implements Inventory<T> {
  private catalog: Array<T> = [];
  add(item: T): void {
    this.catalog.push(item);
  }
}
let bookCatalog: Catalog<BookType> = new Catalog<BookType>();
