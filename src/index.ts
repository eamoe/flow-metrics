import { DataProcessor } from "./dataProcessor";

require("dotenv").config();

async function main() {
  
  try {
    
    let data = new DataProcessor();

    //console.log("Extracting jira issue data...");
    await data.extractJiraIssuesData();

    //console.log("Extracting jira issue changelog...");
    await data.extractJiraIssuesChangelogData();

    //console.log("Extracting jira project...");
    await data.extractJiraProjectData();
    
    //console.log(data.toString());

    console.log(data.createTransactionalData(data.getProject(), data.getIssueList(), data.getChangelogList()).toString());

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
