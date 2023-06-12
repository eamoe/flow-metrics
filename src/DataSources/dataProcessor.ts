import { DataSource } from "./dataSource";
export class DataProcessor {

  public async processData(dataSource: DataSource): Promise<string> {
    
    await dataSource.fetchData(dataSource);
    return dataSource.toJsonString();

  }

}