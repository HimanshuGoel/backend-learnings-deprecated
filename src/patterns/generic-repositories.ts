// https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

export interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IRead<T> {
  find(item: T): Promise<T[]>;
  findOne(id: string): Promise<T>;
}

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  // //creating a property to use your code in all instances
  // // that extends your base repository and reuse on methods of class
  // public readonly _collection: Collection;

  // //we created constructor with arguments to manipulate mongodb operations
  // constructor(db: Db, collectionName: string) {
  //   this._collection = db.collection(collectionName);
  // }

  create(item: T): Promise<boolean> {
    // const result: InsertOneWriteOpResult = await this._collection.insert(item);
    // // after the insert operations, we returns only ok property (that haves a 1 or 0 results)
    // // and we convert to boolean result (0 false, 1 true)
    // return !!result.result.ok;
    throw new Error('Method not implemented.');
  }
  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  find(item: T): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}

// now, we have all code implementation from BaseRepository
export class SpartanRepository extends BaseRepository<Spartan> {
  // // here, we can create all especific stuffs of Spartan Repository
  // countOfSpartans(): Promise<number> {
  //     return this._collection.count({})
  // }
}

// creating a function that execute self runs
(async () => {
  // connecting at mongoClient
  const connection = await MongoClient.connect('mongodb://localhost');
  const db = connection.db('warriors');

  // our operations
  // creating a spartan
  const spartan = new Spartan('Leonidas', 1020);

  // initializing the repository
  const repository = new SpartanRepository(db, 'spartans');

  // call create method from generic repository
  const result = await repository.create(spartan);
  console.log(`spartan inserted with ${result ? 'success' : 'fail'}`);

  //call specific method from spartan class
  const count = await repository.countOfSpartans();
  console.log(`the count of spartans is ${count}`);

  /**
   * spartan inserted with success
    the count of spartans is 1
   */
})();

// entities/Hero.ts

export class Hero {
  private name: string;
  private savedLifes: number;

  constructor(name: string, savedLifes: number) {
    this.name = name;
    this.savedLifes = savedLifes;
  }
}

// repositories/HeroRepository.ts

export class HeroRepository extends BaseRepository<Hero> {}

// importing mongoClient to connect at mongodb
// creating a function that execute self runs
(async () => {
  // connecting at mongoClient
  const connection = await MongoClient.connect('mongodb://localhost');
  const db = connection.db('warriors');

  // our operations
  // creating a spartan
  const spartan = new Spartan('Leonidas', 1020);

  // initializing the repository
  const repository = new SpartanRepository(db, 'spartans');

  // call create method from generic repository
  const result = await repository.create(spartan);
  console.log(`spartan inserted with ${result ? 'success' : 'fail'}`);

  //call specific method from spartan class
  const count = await repository.countOfSpartans();
  console.log(`the count of spartans is ${count}`);

  /**
     * spartan inserted with success
      the count of spartans is 1
     */

  const hero = new Hero('Spider Man', 200);
  const repositoryHero = new HeroRepository(db, 'heroes');
  const resultHero = await repositoryHero.create(hero);
  console.log(`hero inserted with ${result ? 'success' : 'fail'}`);
})();
