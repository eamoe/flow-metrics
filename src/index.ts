import { ApiDataSource } from "./DataSources/APIDataSource/apiDataSource";
import { DataProcessor } from "./DataSources/dataProcessor";
import { DataSource } from "./DataSources/dataSource";
import { DataStorage } from "./DataStorage/dataStorage";
import { JSONStorage } from "./DataStorage/JSONStorage";
import { FlowMetrics } from "./FlowMetrics/flowMetrics";
require("dotenv").config();

async function main() {
  
  try {
    
    let dataSource: DataSource = new ApiDataSource();
    let dataProcessor: DataProcessor = new DataProcessor();
    
    let data = await dataProcessor.processData(dataSource);

    let storage: DataStorage = new JSONStorage("rawData.json", 'w');
    storage.sendDataToStorage(data);

    const newData = storage.retrieveDataFromStorage();

    let flowMetricsObject: FlowMetrics = new FlowMetrics(JSON.parse(newData)["transactions"]);
    console.log(flowMetricsObject.getFlowItems());
    let flowVelocityMap: Map<number, number> = flowMetricsObject.formFlowVelocityDistribution();
    flowVelocityMap.forEach((value: number, key: number) => {
      console.log(new Date(key), value);
    });
    const result = Object.fromEntries(flowVelocityMap);
    console.log(result);

    console.log(Object.fromEntries(flowMetricsObject.formFlowTimeDistribution()));

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
