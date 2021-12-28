import { Request, Response, Application, NextFunction, response } from 'express';
import formidable from 'formidable';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Validator, validate } from 'jsonschema';
import qs from 'qs';
import axios from 'axios';

import { BooksRepo } from '../repos/books.repo';

import BaseApiRoute from './base-api.route';

export class BooksRoute extends BaseApiRoute {
  constructor(express: Application) {
    super();
    this.register(express);
  }

  public register(app: Application): void {
    app.use('/api', this.router);
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.set('content-type', 'application/json');
      res.set('access-control-allow-origin', process.env.CORS_ALLOW_ORIGIN);
      res.set('access-control-allow-methods', 'GET, POST, PUT, DELETE');
      res.set('access-control-allow-headers', 'authorization, content-type');
      next();
    });

    this.router
      .get('/books', this.getBooks)
      .get('/books/search', this.getFullTextSearchedBooks)
      .get('/books/detailed-search', this.getDetailedSearchedBooks)
      .get('/books/:bookId', this.getBookById)
      .post('/books/:bookId', this.createBookById)
      .post('/upload', this.uploadBook)
      .put('/books/:bookId', this.updateBookById)
      .delete('/books/:bookId', this.deleteBookById);
  }

  private validateSchema() {
    var v = new Validator();
    var instance = 4;
    var schema = { type: 'number' };
    console.log(v.validate(instance, schema));

    console.log(validate(4, { type: 'number' }));

    var v = new Validator();

    // Address, to be embedded on Person
    var addressSchema = {
      id: '/SimpleAddress',
      type: 'object',
      properties: {
        lines: {
          type: 'array',
          items: { type: 'string' }
        },
        zip: { type: 'string' },
        city: { type: 'string' },
        country: { type: 'string' }
      },
      required: ['country']
    };

    // Person
    var schema1 = {
      id: '/SimplePerson',
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { $ref: '/SimpleAddress' },
        votes: { type: 'integer', minimum: 1 }
      }
    };

    var p = {
      name: 'Barack Obama',
      address: {
        lines: ['1600 Pennsylvania Avenue Northwest'],
        zip: 'DC 20500',
        city: 'Washington',
        country: 'USA'
      },
      votes: 'lots'
    };

    v.addSchema(addressSchema, '/SimpleAddress');
    console.log(v.validate(p, schema1));
  }

  private async uploadBook(req: Request, res: Response, next: NextFunction) {
    try {
      const form = new formidable.IncomingForm({
        uploadDir: __dirname,
        keepExtensions: true,
        maxFieldsSize: 5 * 1024 * 1024,
        maxFields: 20,
        encoding: 'utf-8',
        multiples: true
      });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
        } else {
          const book = {
            id: fields.id,
            title: fields.title,
            files: files
          };
          console.log(book);
          res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            statusText: ReasonPhrases.OK,
            message: 'Book uploaded successfully',
            data: { books, total: books.length }
          });
        }
      });

      form.on('progress', (bytesReceived, bytesExpected) => {
        console.log(bytesReceived / bytesExpected);
      });
      form.on('aborted', () => {
        console.log('Request aborted by the user');
      });
      form.on('error', (err) => {
        console.log(err);
        req.resume();
      });

      form.on('end', () => {
        console.log('Done: request successfully received');
        response.end('Success');
      });
    } catch (error) {
      next(error);
    }
  }

  private async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      // Sending hypermedia links to each response will reduces the coupling between client and server
      // as client can use links to navigate between resources and also to get the list of resources.
      const books = await BooksRepo.getBooks();
      books.forEach((element: any) => {
        element.updateBook = {
          id: element.id,
          method: 'PUT',
          href: `/api/books/${element.id}`,
          type: 'application/json',
          shape: 'http://localhost:8080/schema/save-book.schema.json'
        };
      });

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Books retrieved successfully',
        data: { books, total: books.length }
      });
    } catch (error) {
      next(error);
    }
  }

  private async getFullTextSearchedBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await BooksRepo.getBooks();
      const keywords = req.query.keywords as string;
      const result = books.filter((book: { id: number; title: string }) => {
        const fullText = book.id + book.title;
        return fullText.toLowerCase().indexOf(keywords.toLowerCase()) !== -1;
      });

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Books retrieved successfully',
        data: { books: result, total: result.length }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get search based on query string parameters. Example -
  // api/books/detailed-search?name[val]=Essential Backpack&price[val]=100&price[op]=lt
  private async getDetailedSearchedBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await BooksRepo.getBooks();
      const query = qs.parse(req.query as any);
      const result = books.filter((book: { id: number; title: string }) => {
        return Object.keys(query).reduce((found, key) => {
          const obj = query[key] as any;
          switch (obj.op) {
            case 'eq':
              return found && (book as any)[key] === obj.val;
            case 'lt':
              return found && (book as any)[key] < obj.val;
            case 'gt':
              return found && (book as any)[key] > obj.val;
            default:
              return found && (book as any)[key].indexOf(obj.val) !== -1;
          }
        }, true);
      });

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Books retrieved successfully',
        data: { books: result, total: result.length }
      });
    } catch (error) {
      next(error);
    }
  }

  private async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const bookId = req.params.bookId;
      const book = await BooksRepo.getBooksById(bookId);
      book.forEach((element: any) => {
        element.updateBook = {
          id: element.id,
          method: 'PUT',
          href: `/api/books/${element.id}`,
          type: 'application/json',
          shape: 'http://localhost:8080/schema/save-book.schema.json'
        };
      });
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Books retrieved successfully',
        data: { books: book, total: book.length }
      });
    } catch (error) {
      next(error);
    }
  }

  private async createBookById(req: Request, res: Response, next: NextFunction) {
    if (!req.is('json')) {
      res.sendStatus(415); // -> Unsupported media type if request doesn't have JSON body
    }

    this.validateSchema();

    // Check if request payload content-type matches json, because body-parser does not check for content types
    try {
      const { name, price } = req.body;
      const errors = [];
      if (!name) {
        errors.push({
          field: 'name',
          error: 'required',
          message: 'Name is required',
          value: name
        });
      }
      if (name && name > 25) {
        errors.push({
          field: 'name',
          error: 'length',
          message: 'Name cannot be longer than 25 characters',
          value: name
        });
      }
      if (price && isNaN(Number(price))) {
        errors.push({
          field: 'price',
          error: 'type',
          message: 'Price must be a number',
          value: name
        });
      }
      if (errors.length > 0) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(errors);
      } else {
        const bookId = req.params.bookId;
        const newBook = await BooksRepo.create(bookId);
        res.status(StatusCodes.CREATED).json({
          status: StatusCodes.CREATED,
          statusText: ReasonPhrases.CREATED,
          message: 'Book created successfully',
          data: { book: newBook, total: newBook.length }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async updateBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, price } = req.body;
      const errors = [];
      if (!id) {
        errors.push({
          field: 'id',
          error: 'required',
          message: 'Id is required',
          value: id
        });
      }
      if (!name) {
        errors.push({
          field: 'name',
          error: 'required',
          message: 'Name is required',
          value: name
        });
      }
      if (name && name > 25) {
        errors.push({
          field: 'name',
          error: 'length',
          message: 'Name cannot be longer than 25 characters',
          value: name
        });
      }
      if (price && isNaN(Number(price))) {
        errors.push({
          field: 'price',
          error: 'type',
          message: 'Price must be a number',
          value: name
        });
      }
      if (errors.length > 0) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(errors);
      } else {
        const updatedBook = BooksRepo.update(req.body);
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          statusText: ReasonPhrases.OK,
          message: 'Book updated successfully',
          // data: { books: updatedBook, total: updatedBook.length },
          data: { books: updatedBook }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const bookId = req.params.bookId;
      const deletedBookIndex = BooksRepo.delete(bookId);
      res.status(StatusCodes.NO_CONTENT).json({
        status: StatusCodes.NO_CONTENT,
        statusText: ReasonPhrases.NO_CONTENT,
        message: 'Book deleted successfully',
        data: { bookId: deletedBookIndex }
      });
    } catch (error) {
      next(error);
    }
  }

  private async usingAxiosPackage() {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const data = await axios.get(url);
    console.log(data);
  }

  private async usingAxiosWithPost() {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const data = {
      title: 'foo',
      body: 'bar',
      userId: 1
    };
    const response = await axios.post(url, data);
    console.log(response);
  }
}

export interface IResponse {
  status: StatusCodes;
  statusText: ReasonPhrases;
  message: string;
  data?: Array<any>;
  error?: {
    code: 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR' | 'BAD_REQUEST';
    message: string;
  };
}
