import { JiraDataExtractor } from "./dataExtractor";

require("dotenv").config();

async function main() {
  
  try {
    
    let data = new JiraDataExtractor();

    console.log("Extracting jira issue data...");
    await data.extractJiraIssuesData();

    console.log("Extracting jira issue changelog...");
    await data.extractJiraIssuesChangelogData();

    console.log("Extracting jira project...");
    await data.extractJiraProjectData();
    
    console.log(data.toString());

  } catch (e: any) {

    console.log(e.message);

  }

}

main();
