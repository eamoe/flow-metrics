import { ApiDataSource } from "./DataSources/APIDataSource/apiDataSource";
import { DataProcessor } from "./DataSources/dataProcessor";
import { DataSource } from "./DataSources/dataSource";
import { DataStorage } from "./DataStorage/dataStorage";
import { JSONStorage } from "./DataStorage/JSONStorage";
require("dotenv").config();

async function main() {
  
  try {
    
    let dataSource: DataSource = new ApiDataSource();
    let dataProcessor: DataProcessor = new DataProcessor();
    
    let data = await dataProcessor.processData(dataSource);

    let storage: DataStorage = new JSONStorage("rawData.json", 'w');
    storage.sendDataToStorage(data);

    const newData = storage.retrieveDataFromStorage();
    console.log(JSON.parse(newData));

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
