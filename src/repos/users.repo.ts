import fs from 'fs';

const FILE_NAME = './assets/users.json';

export class UsersRepo {
  static getAll(resolve: any, reject: any) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  }
}
