import { ApiDataSource } from "./DataSources/APIDataSource/apiDataSource";
import { DataProcessor } from "./DataSources/dataProcessor";
import { DataSource } from "./DataSources/dataSource";
import { Storage } from "./DataStorage/storage";
require("dotenv").config();

async function main() {
  
  try {
    
    let dataSource: DataSource = new ApiDataSource();
    let dataProcessor: DataProcessor = new DataProcessor();
    
    let data = await dataProcessor.processData(dataSource);

    let storage = new Storage("rawData.json");
    storage.writeToFile(data);

    const newData = storage.readFromFile();
    console.log(JSON.parse(newData));

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
