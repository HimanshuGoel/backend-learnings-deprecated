import { Request, Response, Application, NextFunction } from 'express';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import qs from 'qs';

import { BooksRepo } from '../repos/books.repo';
import { BaseApiRoute } from './base-api.route';

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
      .get('/books/search', this.getFullTextSearchedBooks.bind(this))
      .get('/books/detailed-search', this.getDetailedSearchedBooks.bind(this))
      .get('/books/:bookId', this.getBookById.bind(this))
      .post('/books/:bookId', this.createBookById.bind(this))
      .put('/books/:bookId', this.updateBookById.bind(this))
      .delete('/books/:bookId', this.deleteBookById.bind(this));
  }

  private async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await BooksRepo.getBooks();
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
      const result = books.filter((book: { id: number; title: string }) =>
        Object.keys(query).reduce((found, key) => {
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
        }, true)
      );

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
      const { bookId } = req.params;
      const book = await BooksRepo.getBooksById(bookId);
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
      res.sendStatus(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
    }
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
      if (price && Number.isNaN(Number(price))) {
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
        const { bookId } = req.params;
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
      if (price && Number.isNaN(Number(price))) {
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
          data: { books: updatedBook }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.params;
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
}
