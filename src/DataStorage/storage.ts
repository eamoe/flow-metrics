import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class Storage {

  public static syncWriteFile(filename: string, data: any) {
    
    writeFileSync(join(__dirname, filename), data, {
      flag: 'w',
    });

  }

  public static syncReadFile(filename: string): string {
    
    const contents = readFileSync(join(__dirname, filename), 'utf-8');
    return contents;
    
  }

}