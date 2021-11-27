class ReferenceItem {
  title!: string;

  constructor(newTitle: string) {
    this.title = newTitle;
  }

  printItem(): void {
    console.log(`${this.title}`);
  }
}

class Journal extends ReferenceItem {
  constructor(title: string) {
    super(title);
  }

  contributors: string[] = [];
}

const journal = new Journal('Journal');
journal.printItem();
