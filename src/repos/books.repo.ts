import fs from 'fs';

class BooksRepo {
  static getBooks(resolve: any, reject: any) {
    const fileName = './assets/books.json';

    fs.readFile(fileName, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  }

  static searchBooks(searchObject: { id: number; name: string }, resolve: any, reject: any) {
    const fileName = './assets/books.json';

    fs.readFile(fileName, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let books = JSON.parse(data.toString());
        if (searchObject) {
          books = books.filter(
            (book: { id: number; name: string }) =>
              (searchObject.id ? book.id === searchObject.id : true) &&
              (searchObject.name
                ? book.name.toLocaleLowerCase().indexOf(searchObject.name.toLocaleLowerCase())
                : true)
          )[0];
        }
        resolve(books);
      }
    });
  }

  static update(newData: { id: number; name: string }, id, resolve: any, reject: any) {
    const fileName = './assets/books.json';

    fs.readFile(fileName, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let book = JSON.parse(data.toString()).find(
          (book: { id: number; name: string }) => book.id === id
        );
        if (book) {
          // This Object.assign() approach is also works with PATCH method
          Object.assign(book, newData);
        }
        resolve(book);
      }
    });
  }

  static delete(id: number, resolve: any, reject: any) {
    const fileName = './assets/books.json';

    fs.readFile(fileName, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let index = JSON.parse(data.toString()).findIndex((p) => p.id === id);
        if (index > -1) {
          JSON.parse(data.toString()).splice(index, 1);
        }
        resolve(index);
      }
    });
  }
}

export { BooksRepo };
// export function getEpisodes() {
//   return [
//     {
//       id: 1,
//       title: 'The One Where Ross Finds Out',
//       season: 2,
//       episode: 7
//     },
//     {
//       id: 2,
//       title: 'The One With All the Resolutions',
//       episode: 11,
//       season: 5
//     },
//     {
//       id: 3,
//       title: 'The One With The Cop',
//       season: 5,
//       episode: 16
//     }
//   ];
// }

// export function getBooks() {
//   return [
//     { id: 1, name: 'The Lord of the Rings' },
//     { id: 2, name: 'The Hobbit' }
//   ];
// }
