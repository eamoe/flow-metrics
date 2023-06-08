import { Version3Client } from "jira.js";
import { JiraIssue, JiraIssueList } from "./jira_entities/jiraIssue";
import { JiraIssueChangelog, JiraIssuesChangelogList, Transition } from "./jira_entities/jiraIssueChangelog";
import { JiraProject, IssueType } from  "./jira_entities/jiraProject";

export class JiraDataExtractor {

  client: Version3Client;
  issuesList: JiraIssueList;
  changelogList: JiraIssuesChangelogList;
  project: JiraProject;

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
    this.issuesList = new JiraIssueList();
    this.changelogList = new JiraIssuesChangelogList();
    this.project = new JiraProject();
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
      this.issuesList.addIssue(jiraIssue);
    });
  }

  public async extractJiraIssuesChangelogData(): Promise<void> {

    let rawData: any;
    await Promise.all(this.issuesList.jiraIssues.map(async (jiraIssue) => {

      rawData = await this.client.issues.getChangeLogs( { issueIdOrKey: jiraIssue.issueKey } );

      let jiraIssueChangelog = new JiraIssueChangelog();

      rawData["values"].forEach((issueChangelog: any) => {
        let items = issueChangelog["items"]?.find((item: any) => item["fieldId"]! === "status");
        
        let transition: Transition = {  transitionId: issueChangelog["id"]!,
                                        transitionDate: new Date(issueChangelog["created"]!),
                                        fromStatus: items?.from!,
                                        fromStatusString: items?.fromString!,
                                        toStatus: items?.to!,
                                        toStatusString: items?.toString!
                                        };
        
        jiraIssueChangelog.addTransition(jiraIssue.issueKey, transition);
      });
      
      this.changelogList.addIssue(jiraIssueChangelog);

    }));

  }

  public async extractJiraProjectData(): Promise<void> {
    
    const rawData = await this.client.projects.getProject({
      projectIdOrKey: process.env.PROJECTID!,
    });

    this.project.projectId = rawData["id"];
    this.project.projectKey = rawData["key"];
    this.project.projectName = rawData["name"];

    let issueTypes: Array<IssueType> = [];

    rawData["issueTypes"]?.forEach((item) => {
      const issueType = new IssueType(item["id"],
                                      item["iconUrl"],
                                      item["name"],
                                      item["subtask"]);
      issueTypes.push(issueType);
    });
    this.project.issueTypes = issueTypes;

  }

  public toString(): string {
    return  `${this.issuesList.toString()}\n` +
            `${this.changelogList.toString()}\n` +
            `${this.project.toString()}\n`;
            
  }
}