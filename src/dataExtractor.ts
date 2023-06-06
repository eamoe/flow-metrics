import { JiraIssue, JiraIssueList } from "./jiraIssue";
import { Version3Client } from "jira.js";

export class JiraDataExtractor {

  client: Version3Client;
  issues: JiraIssueList;

  constructor() {
    this.client = new Version3Client({
      host: process.env.HOSTURL!,
      authentication: {
        basic: {
          email: process.env.EMAIL!,
          apiToken: process.env.APITOKEN!,
        },
      },
      newErrorHandling: true,
    });
    this.issues = new JiraIssueList();
  }

  public async extractJiraIssuesData(): Promise<void> {
    
    const rawData = await this.client.issueSearch.searchForIssuesUsingJql({
      jql: process.env.JQLFILTER!,
    });

    rawData["issues"]!.forEach((issue) => {
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
      this.issues.addIssue(jiraIssue);
    });
  }

  public toString(): string {
    return `${this.issues.toString()}`;
  }
}
