import fs from 'fs';
import shortid from 'shortid';

const FILE_NAME = './src/assets/books.json';

export class BooksRepo {
  static getBooks(resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  }

  static getBooksById(bookId: string, resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let books = JSON.parse(data.toString());
        if (bookId) {
          books = books.filter((book: { id: string; name: string }) => book.id === bookId);
          resolve(books);
        } else {
          resolve(books);
        }
      }
    });
  }

  static update(updatedBook: any, resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let book = JSON.parse(data.toString()).find((book: any) => book.id === updatedBook.id);
        if (book) {
          // This approach will also works for PATCH method
          Object.assign(book, updatedBook);
        }
        resolve(book);
      }
    });
  }

  static create(newBook: any, resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        newBook.id = shortid.generate();
        const books = JSON.parse(data.toString());
        books.push(newBook);
        resolve(books);
      }
    });
  }

  static delete(id: string, resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let index = JSON.parse(data.toString()).findIndex((p: any) => p.id === id);
        if (index > -1) {
          JSON.parse(data.toString()).splice(index, 1);
        }
        resolve(index);
      }
    });
  }
}
