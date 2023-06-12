import { ApiDataSource } from "./APIDataSource/ApiDataSource";
export class DataProcessor {

  public async processData(): Promise<string> {
    let dataSource = new ApiDataSource();
    await dataSource.fetchData();
    let data = dataSource.toJson();
    return data;
  }

}