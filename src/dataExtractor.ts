import { Version3Client } from "jira.js";
import { JiraIssue, JiraIssueList } from "./jiraIssue";
import { JiraIssueChangelog, JiraIssuesChangelogList, Transition } from "./jiraIssueChangelog";

export class JiraDataExtractor {

  client: Version3Client;
  issues: JiraIssueList;
  changelog: JiraIssuesChangelogList

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
    this.changelog = new JiraIssuesChangelogList();
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

  public async extractJiraIssuesChangelogData(): Promise<void> {
    
    const rawData = await this.client.issues.getChangeLogs( { issueIdOrKey: "SKP-17" } );

    let jiraIssueChangelog = new JiraIssueChangelog();
    
    jiraIssueChangelog.issueId = "SKP-17";

    rawData["values"]!.forEach((issueChangelog) => {
      let items = issueChangelog["items"]?.find((item) => item["fieldId"]! === "status");
      
      let transition: Transition = {  transitionId: issueChangelog["id"]!,
                                      transitionDate: new Date(issueChangelog["created"]!),
                                      fromStatus: items?.from!,
                                      fromStatusString: items?.fromString!,
                                      toStatus: items?.to!,
                                      toStatusString: items?.toString!
                                      };
      
      jiraIssueChangelog.addTransition(transition);
      
    });

    this.changelog.addIssue(jiraIssueChangelog);

  }
  
  public toString(): string {
    return  `${this.issues.toString()}\n` +
            `${this.changelog.toString()}`;
            
  }
}