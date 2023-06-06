import { JiraDataExtractor } from "./dataExtractor";

require("dotenv").config();

async function main() {
  
  let data = new JiraDataExtractor();
  
  await data.extractJiraIssuesData();
  
  console.log(data.toString());

}

main();
