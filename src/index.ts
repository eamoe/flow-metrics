import { Version3Client } from "../node_modules/jira.js";
import { JiraIssue } from "./jiraIssueClass";

require("dotenv").config();

async function main() {
  const client = new Version3Client({
    // host url from environment variable
    host: process.env.HOSTURL!,
    authentication: {
      basic: {
        //email from environment variable
        email: process.env.EMAIL!,
        // api token from environment variable
        apiToken: process.env.APITOKEN!,
      },
    },
    newErrorHandling: true,
  });

  const project = await client.projects.getProject({
    // project id from environment variable
    projectIdOrKey: process.env.PROJECTID!,
  });

  if (project) {
    const dataLog = await client.issueSearch.searchForIssuesUsingJql({
      jql: process.env.JQLFILTER!,
    });
    const issues = dataLog["issues"]!;

    issues.forEach((issue) => {
      const jiraIssue = new JiraIssue(
                                issue["key"],
                                issue["id"],
                                issue["fields"]["summary"],
                                issue["fields"]["created"],
                                issue["fields"]["resolutiondate"]!,
                                issue["fields"]["issuetype"]!["name"]!,
                                issue["fields"]["issuetype"]!["id"]!,
                                issue["fields"]["statuscategorychangedate"]
      );
      console.log(jiraIssue.toString());
    });
  } else {
    console.log("Project not found.");
  }
}

main();
