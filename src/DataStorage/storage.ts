import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class Storage {

  private fileName: string;
  private flag: string;

  constructor(fileName: string = "rawData.json", flag: string = "w") {
    this.flag = flag;
    this.fileName = fileName;
  }

  public writeToFile(data: string) {
    
    writeFileSync(join(__dirname, this.fileName), data, {
      flag: this.flag,
    });

  }

  public readFromFile(): string {
    
    const data = readFileSync(join(__dirname, this.fileName), 'utf-8');
    return data;

  }

}