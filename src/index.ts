import { JiraDataExtractor } from "./dataExtractor";

require("dotenv").config();

async function main() {
  
  let data = new JiraDataExtractor();
  
  console.log("Starting extraction of Jira issue data...");
  await data.extractJiraIssuesData();
  console.log("finishing extraction of Jira issue data...");

  console.log("Starting extraction of Jira issue changelog...");
  await data.extractJiraIssuesChangelogData();
  console.log("finishing extraction of Jira issue changelog...");
  
  console.log(data.toString());

}

main();
