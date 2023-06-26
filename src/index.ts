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
    
    let dataToStore = await dataProcessor.processData(dataSource);

    let storage: DataStorage = new JSONStorage("rawData.json", 'w');
    storage.sendDataToStorage(dataToStore);

    const rawMetricsData = JSON.parse(storage.retrieveDataFromStorage());

    let flowMetricsObject: FlowMetrics = new FlowMetrics(rawMetricsData["transactions"]);
    console.log(flowMetricsObject.getFlowItems());
    console.log(Object.fromEntries(flowMetricsObject.getFlowTimeDistribution()));
    console.log(Object.fromEntries(flowMetricsObject.getFlowVelocityDistribution()));

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
