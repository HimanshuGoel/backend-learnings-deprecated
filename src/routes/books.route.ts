import { Request, Response, Application, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import * as jwt from 'jsonwebtoken';

import qs from 'qs';

import { BooksRepo } from '../repos/books.repo';
import { CREATE_BOOK, READ_BOOK, UPDATE_BOOK } from '../constants/global.constant';

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
      .get('/books', this.verifyToken, this.getBooks)
      .get('/books/search', this.getFullTextSearchedBooks)
      .get('/books/detailed-search', this.getDetailedSearchedBooks)
      .get('/books/:id', this.getBookById)
      .post('/books/:id', this.createBookById)
      .put('/books/:id', this.updateBookById)
      .delete('/books/:id', this.deleteBookById);
  }

  private getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      // Sending hypermedia links to each response will reduces the coupling between client and server
      // as client can use links to navigate between resources and also to get the list of resources.
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
        BooksRepo.getBooks(
          function (response: any) {
            response.forEach((element: any) => {
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
              data: response
            });
          },
          function (err: Error) {
            next(err);
          }
        );
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

  private getFullTextSearchedBooks(req: Request, res: Response, next: NextFunction) {
    try {
      BooksRepo.getBooks(
        function (response: any) {
          const keywords = req.query.keywords as string;
          const result = response.filter((book: { id: number; title: string }) => {
            const fullText = book.id + book.title;
            return fullText.toLowerCase().indexOf(keywords.toLowerCase()) !== -1;
          });

          res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            statusText: ReasonPhrases.OK,
            message: 'Books retrieved successfully',
            data: result
          });
        },
        function (err: Error) {
          next(err);
        }
      );
    } catch (error) {
      next(error);
    }
  }

  // Get search based on query string parameters. Example -
  // api/books/detailed-search?name[val]=Essential Backpack&price[val]=100&price[op]=lt
  private getDetailedSearchedBooks(req: Request, res: Response, next: NextFunction) {
    try {
      BooksRepo.getBooks(
        function (response: any) {
          const query = qs.parse(req.query as any);

          const result = response.filter((book: { id: number; title: string }) => {
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
            data: result
          });
        },
        function (err: Error) {
          next(err);
        }
      );
    } catch (error) {
      next(error);
    }
  }

  private getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
        const bookId = req.params.id;
        BooksRepo.getBooksById(
          bookId,
          function (response: any) {
            response.forEach((element: any) => {
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
              data: response
            });
          },
          function (err: Error) {
            next(err);
          }
        );
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

  private createBookById(req: Request, res: Response, next: NextFunction) {
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
          const bookId = req.params.id;
          BooksRepo.create(
            bookId,
            function (response: any) {
              res.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                statusText: ReasonPhrases.CREATED,
                message: 'Book created successfully',
                data: response
              });
            },
            function (err: Error) {
              next(err);
            }
          );
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

  private updateBookById(req: Request, res: Response, next: NextFunction) {
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
          BooksRepo.update(
            req.body,
            function (response: any) {
              res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                statusText: ReasonPhrases.OK,
                message: 'Book updated successfully',
                data: response
              });
            },
            function (err: Error) {
              next(err);
            }
          );
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

  private deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(READ_BOOK)) {
        const bookId = req.params.id;
        BooksRepo.delete(
          bookId,
          function (response: any) {
            res.status(StatusCodes.NO_CONTENT).json({
              status: StatusCodes.NO_CONTENT,
              statusText: ReasonPhrases.NO_CONTENT,
              message: 'Book deleted successfully',
              data: { bookId: response }
            });
          },
          function (err: Error) {
            next(err);
          }
        );
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
