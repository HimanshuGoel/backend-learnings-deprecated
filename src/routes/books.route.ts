import { Request, Response, Application, NextFunction } from 'express';

import * as bcrypt from 'bcrypt';

import * as jwt from 'jsonwebtoken';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import qs from 'qs';
import { getUsers } from 'src/utilities/mock-data.utility';
import { BooksRepo } from '../repos/books.repo';

import BaseApiRoute from './base-api.route';
import { getJwtOptions } from '../utilities/mock-data.utility';
import { ADD_BOOK } from 'src/constants/global.constant';

export class BooksRoute extends BaseApiRoute {
  constructor(express: Application) {
    super();
    this.register(express);
  }

  public register(app: Application): void {
    app.use('/api', this.router);

    this.router
      .get('/login', this.doLogin)

      .get('/books', this.verifyToken, this.getBooks)
      .get('/books/search', this.getFullTextSearchedBooks)
      .get('/books/detailed-search', this.getDetailedSearchedBooks)
      .get('/books/:id', this.getBookById)
      .post('/books/:id', this.createBookById)
      .put('/books/:id', this.updateBookById)
      .delete('/books/:id', this.deleteBookById);
  }

  private doLogin(req: Request, res: Response, next: NextFunction) {
    let base64Encoding = (req.headers.authorization as string).split(' ')[1];
    let credentials = Buffer.from(base64Encoding, 'base64').toString().split(':');

    const username = credentials[0];
    const password = credentials[1];

    const users = getUsers();

    const user = users.find((user: any) => user.username === username);

    if (user) {
      bcrypt.compare(password, user.key, (err: any, result: any) => {
        if (result) {
          const token = this.generateJwtToken('', username);

          // res.cookie('token', token, { httpOnly: true });

          res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            statusText: ReasonPhrases.OK,
            message: 'Login successful',
            data: { username: user.username, role: user.role },
            token
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            statusText: ReasonPhrases.UNAUTHORIZED,
            message: 'Invalid credentials',
            data: { user: { username: result.userName, role: result.role } }
          });
        }
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        statusText: ReasonPhrases.UNAUTHORIZED,
        message: 'Invalid username or password'
      });
    }
  }

  private generateJwtToken(prevToken: string, username: string) {
    const name = username || this.getUsernameFromToken(prevToken);

    const users = getUsers();
    const user = users.find((user: any) => user.username === username);

    const options = {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.EXPIRY,
      issuer: process.env.ISSUER,
      subject: name || user.username,
      audience:
        user.role === 'admin'
          ? getJwtOptions().JWT_OPTIONS.ADMIN_AUDIENCE
          : getJwtOptions().JWT_OPTIONS.MEMBER_AUDIENCE
    };

    return jwt.sign({}, process.env.SECRET as jwt.Secret, options as jwt.SignOptions);
  }

  private getUsernameFromToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded!.sub;
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

  private getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.getAudienceFromToken(req.headers.authorization as string).includes(ADD_BOOK)) {
        BooksRepo.getBooks(
          function (response: any) {
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

  // Get full text based search
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

  // Get detailed search based on different query string parameters
  // products/detail-search?name[val]=Essential Backpack&price[val]=100&price[op]=lt
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
      const books = BooksRepo.getBooks();
      const id = Number(req.params.id);
      const response = books.find((book) => book.id === id);

      // Return status 404 if record is not found for updating, patching or deleting
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Book retrieved successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private createBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Create a new book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;

      const { price } = req.body;

      // Incase of wrong entity/data send from frontend and it fails the validation
      // of the server, then we should return 422 – Unprocessable entity status code

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
        res.status(StatusCodes.CREATED).json({
          status: StatusCodes.CREATED,
          statusText: ReasonPhrases.CREATED,
          message: 'Book created successfully',
          data: []
        });
      }
    } catch (error) {
      next(error);
    }
  }

  private updateBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Update a particular book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;

      // Return status 404 if record is not found for updating, patching or deleting
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        message: 'Book updated successfully',
        data: []
      });
    } catch (error) {
      next(error);
    }
  }

  private deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Delete a particular book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;

      // Return status 404 if record is not found for updating, patching or deleting
      res.status(StatusCodes.NO_CONTENT).json({
        status: StatusCodes.NO_CONTENT,
        statusText: ReasonPhrases.NO_CONTENT,
        message: 'Book deleted successfully',
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BooksRoute;

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
