import { Request, Response, Application, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import * as jwt from 'jsonwebtoken';

import { BooksRepo } from '../repos/books.repo';
import { CREATE_BOOK, READ_BOOK, UPDATE_BOOK } from '../constants/global.constant';

import BaseApiRoute from './base-api.route';

export class BooksWithAuthRoute extends BaseApiRoute {
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
      .get('/books-with-auth', this.verifyToken, this.getBooks)
      .get('/books-with-auth/:bookId', this.getBookById)
      .post('/books-with-auth/:bookId', this.createBookById)
      .put('/books-with-auth/:bookId', this.updateBookById)
      .delete('/books-with-auth/:bookId', this.deleteBookById);
  }

  private async getBooks(req: Request, res: Response, next: NextFunction) {
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

    try {
      // Sending hypermedia links to each response will reduces the coupling between client and server
      // as client can use links to navigate between resources and also to get the list of resources.
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
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
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          statusText: ReasonPhrases.FORBIDDEN,
          message: 'You are not authorized to access this resource'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private getAudienceFromToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded! as any['aud'];
  }

  private verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    if (token) {
      jwt.verify(token, process.env.SECRET as jwt.Secret, (err: any, decoded: any) => {
        if (err) {
          res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            statusText: ReasonPhrases.UNAUTHORIZED,
            message: 'Invalid token'
          });
        } else {
          next();
        }
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        statusText: ReasonPhrases.UNAUTHORIZED,
        message: 'No token provided'
      });
    }
  }

  private async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
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
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          statusText: ReasonPhrases.FORBIDDEN,
          message: 'You are not authorized to access this resource'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async createBookById(req: Request, res: Response, next: NextFunction) {
    // Check if request payload content-type matches json, because body-parser does not check for content types
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(CREATE_BOOK)) {
        const { name, author, price } = req.body;
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
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          statusText: ReasonPhrases.FORBIDDEN,
          message: 'You are not authorized to access this resource'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async updateBookById(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(UPDATE_BOOK)) {
        const { id, name, author, price } = req.body;
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
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          statusText: ReasonPhrases.FORBIDDEN,
          message: 'You are not authorized to access this resource'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private async deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
        const bookId = req.params.bookId;
        const deletedBookIndex = BooksRepo.delete(bookId);
        res.status(StatusCodes.NO_CONTENT).json({
          status: StatusCodes.NO_CONTENT,
          statusText: ReasonPhrases.NO_CONTENT,
          message: 'Book deleted successfully',
          data: { bookId: deletedBookIndex }
        });
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          statusText: ReasonPhrases.FORBIDDEN,
          message: 'You are not authorized to access this resource'
        });
      }
    } catch (error) {
      next(error);
    }
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
