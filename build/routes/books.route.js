"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
class Books {
    constructor() {
        this.books = [
            { id: 1, name: 'The Lord of the Rings' },
            { id: 2, name: 'The Hobbit' }
        ];
    }
    routes(app) {
        // Received the express instance from app.ts file
        app.route('/books').get((req, res) => {
            res.status(200).send(this.books);
        });
        app.route('/books/:id').get((req, res) => {
            // Show info about a specific book
            const id = Number(req.params.id);
            const selectedBook = this.books.find((book) => book.id === id);
            res.status(200).send(selectedBook);
        });
        app.route('/books/:id').post((req, res) => {
            // Create a new book, then redirect somewhere
            const name = req.body.name;
            const attack = req.body.attack;
        });
        app.route('/books/:id').put((req, res) => {
            // Update a particular book and redirect somewhere
        });
        app.route('/books/:id').delete((req, res) => {
            // Delete a particular book and redirect somewhere
        });
    }
}
exports.Books = Books;
