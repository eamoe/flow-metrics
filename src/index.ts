import { DataProcessor } from "./DataSources/dataProcessor";

require("dotenv").config();

async function main() {
  
  try {
    
    let dataProcessor = new DataProcessor();
    let data = await dataProcessor.processData();

    console.log(data);

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
