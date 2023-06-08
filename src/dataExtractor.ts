import { Version3Client } from "jira.js";
import { Issue, IssueList } from "./jira_entities/jiraIssue";
import { IssueChangelog, IssuesChangelogList, Transition } from "./jira_entities/jiraIssueChangelog";
import { Project, IssueType } from  "./jira_entities/jiraProject";

export class JiraDataExtractor {

  private client: Version3Client;
  private issueList: IssueList;
  private changelogList: IssuesChangelogList;
  private project: Project;

  constructor() {
    this.client = new Version3Client({ host: process.env.HOSTURL!,
                                      authentication: {
                                        basic: {
                                          email: process.env.EMAIL!,
                                          apiToken: process.env.APITOKEN!,
                                        },
                                      },
                                      newErrorHandling: true,
                                    });
    this.issueList = new IssueList();
    this.changelogList = new IssuesChangelogList();
    this.project = new Project();
  }

  public async extractJiraIssuesData(): Promise<void> {
    
    const rawData = await this.client.issueSearch.searchForIssuesUsingJql({
      jql: process.env.JQLFILTER!,
    });

    rawData["issues"]!.forEach((issue) => {
      const item = new Issue(
        issue["key"],
        issue["id"],
        issue["fields"]["summary"],
        issue["fields"]["created"],
        issue["fields"]["resolutiondate"]!,
        issue["fields"]["issuetype"]!["name"]!,
        issue["fields"]["issuetype"]!["id"]!,
        issue["fields"]["statuscategorychangedate"]
      );
      this.issueList.addIssue(item);
    });
  }

  public async extractJiraIssuesChangelogData(): Promise<void> {

    let rawData: any;
    await Promise.all(this.issueList.issues.map(async (issue) => {

      rawData = await this.client.issues.getChangeLogs( { issueIdOrKey: issue.key } );

      let issueChangelog = new IssueChangelog();

      rawData["values"].forEach((value: any) => {
        let items = value["items"]?.find((item: any) => item["fieldId"]! === "status");
        
        let transition: Transition = {  id: value["id"]!,
                                        created: new Date(value["created"]!),
                                        statusFromId: items?.from!,
                                        statusFromName: items?.fromString!,
                                        statusToId: items?.to!,
                                        statusToName: items?.toString!
                                        };
        
        issueChangelog.addTransition(issue.key, transition);
      });
      
      this.changelogList.addIssue(issueChangelog);

    }));

  }

  public async extractJiraProjectData(): Promise<void> {
    
    const rawData = await this.client.projects.getProject({
      projectIdOrKey: process.env.PROJECTID!,
    });

    this.project.id = rawData["id"];
    this.project.key = rawData["key"];
    this.project.name = rawData["name"];

    let issueTypes: Array<IssueType> = [];

    rawData["issueTypes"]?.forEach((item) => {
      const issueType = new IssueType(item["id"],
                                      item["name"],
                                      item["subtask"],
                                      item["iconUrl"]);
      issueTypes.push(issueType);
    });
    this.project.issueTypes = issueTypes;

  }

  public toString(): string {
    return  `${this.issueList.toString()}\n` +
            `${this.changelogList.toString()}\n` +
            `${this.project.toString()}\n`;
            
  }
}