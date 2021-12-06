import { promises as fs } from 'fs';

const FILE_NAME = './src/assets/users.json';

export class UsersRepo {
  static async getAll() {
    const data = await fs.readFile(FILE_NAME, 'utf8');
    return JSON.parse(data.toString());
  }
}
