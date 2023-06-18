import { ApiDataSource } from "./DataSources/APIDataSource/apiDataSource";
import { DataProcessor } from "./DataSources/dataProcessor";
import { DataSource } from "./DataSources/dataSource";
import { DataStorage } from "./DataStorage/dataStorage";
import { JSONStorage } from "./DataStorage/JSONStorage";
import { FlowTime } from "./LeadTime/flowTime";
require("dotenv").config();

async function main() {
  
  try {
    
    let dataSource: DataSource = new ApiDataSource();
    let dataProcessor: DataProcessor = new DataProcessor();
    
    let data = await dataProcessor.processData(dataSource);

    let storage: DataStorage = new JSONStorage("rawData.json", 'w');
    storage.sendDataToStorage(data);

    const newData = storage.retrieveDataFromStorage();

    let flowTime: FlowTime = new FlowTime(JSON.parse(newData)["transactions"]);
    flowTime.fetchCustomerLeadTime();
    let customerLeadTimeDistribution: Map<number, number> = flowTime.createFlowTimeDistribution(flowTime.getCustomerLeadTime());
    customerLeadTimeDistribution.forEach((value: number, key: number) => {
      console.log(new Date(key), value);
    });

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
