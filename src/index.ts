import { ApiDataSource } from "./DataSources/APIDataSource/apiDataSource";
import { DataProcessor } from "./DataSources/dataProcessor";
import { DataSource } from "./DataSources/dataSource";
import { DataStorage } from "./DataStorage/dataStorage";
import { JSONStorage } from "./DataStorage/JSONStorage";
import { FlowTime } from "./FlowTime/flowTime";
require("dotenv").config();

async function main() {
  
  try {
    
    let dataSource: DataSource = new ApiDataSource();
    let dataProcessor: DataProcessor = new DataProcessor();
    
    let data = await dataProcessor.processData(dataSource);

    let storage: DataStorage = new JSONStorage("rawData.json", 'w');
    storage.sendDataToStorage(data);

    const newData = storage.retrieveDataFromStorage();

    let flowTimeObject: FlowTime = new FlowTime(JSON.parse(newData)["transactions"]);
    flowTimeObject.fetchFlowTime();
    let flowTimeMap: Map<number, number> = flowTimeObject.createFlowTimeDistribution();
    flowTimeMap.forEach((value: number, key: number) => {
      console.log(new Date(key), value);
    });
    const result = Object.fromEntries(flowTimeMap);
    console.log(result);

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
