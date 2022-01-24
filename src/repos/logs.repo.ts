import fs from 'fs';

const FILE_NAME = './logs/logs.txt';

export class LogsRepo {
  static write(data: any, resolve: any, reject: any) {
    let toWrite = '*'.repeat(80) + '\r\n';
    toWrite += 'Date/Time: ' + new Date().toLocaleDateString() + '\r\n';
    toWrite += 'Exception Info: ' + JSON.stringify(data) + '\r\n';
    toWrite += '*'.repeat(80) + '\r\n';
    fs.writeFile(FILE_NAME, toWrite, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  }
}
