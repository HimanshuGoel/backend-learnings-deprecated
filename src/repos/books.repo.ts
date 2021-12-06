import { promises as fs } from 'fs';
import shortid from 'shortid';

const FILE_NAME = './src/assets/books.json';

export class BooksRepo {
  static async getBooks() {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    return JSON.parse(data.toString());
  }

  static async getBooksById(bookId: string) {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    let books = JSON.parse(data.toString());
    const book = books.filter((book: { id: string; name: string }) => book.id === bookId);
    return book;
  }

  static async update(updatedBook: any) {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    let book = JSON.parse(data.toString()).find((book: any) => book.id === updatedBook.id);
    if (book) {
      // This approach will also works for PATCH method
      Object.assign(book, updatedBook);
    }
    return book;
  }

  static async create(newBook: any) {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    newBook.id = shortid.generate();
    const books = JSON.parse(data.toString());
    books.push(newBook);
    return books;
  }

  static async delete(id: string) {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    let index = JSON.parse(data.toString()).findIndex((p: any) => p.id === id);
    if (index > -1) {
      JSON.parse(data.toString()).splice(index, 1);
    }
    return index;
  }
}
