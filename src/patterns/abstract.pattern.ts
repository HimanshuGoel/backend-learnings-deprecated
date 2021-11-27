abstract class AbstractBookClass {
  title!: string;

  abstract printCitation(): void;

  constructor(newTitle: string) {
    this.title = newTitle;
  }

  printItem(): void {
    console.log(`${this.title}`);
  }
}

class Book extends AbstractBookClass {
  constructor(title: string) {
    super(title);
  }

  printCitation(): void {
    console.log(`${this.title}`);
  }

  contributors: string[] = [];
}

// const abstractBook = new AbstractBookClass('Book'); // Error: Abstract classes cannot be instantiated directly.

const book = new Book('Book');
book.printCitation();
