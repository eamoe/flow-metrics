import { Version3Client } from "jira.js";
import { Issue, IssueList } from "./jira_entities/jiraIssue";
import { IssueChangelog, IssuesChangelogList, Transition } from "./jira_entities/jiraIssueChangelog";
import { Project, IssueType } from  "./jira_entities/jiraProject";
import { Transaction, TransactionList } from "./data_transactions/transaction";

export class DataProcessor {

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
    return  `\n${this.issueList.toString()}\n` +
            `\n${this.changelogList.toString()}\n` +
            `\n${this.project.toString()}\n`;
            
  }

  public getIssueList(): IssueList {
    return this.issueList;
  }

  public getChangelogList(): IssuesChangelogList {
    return this.changelogList;
  }

  public getProject(): Project {
    return this.project;
  }


  public createTransactionalData(project: Project, issueList: IssueList, changelogList: IssuesChangelogList): TransactionList {
    let transactions = new TransactionList();
    changelogList.issueChangelog.forEach((changelog) => {
      
      let key = changelog.issueKey;
      let issue = issueList.findIssue(key)!;
      let projectId = project.id;
      let projectKey = project.key;
      let projectName = project.name;
      let issueId = issue?.id;
      let issueKey = issue?.key;
      let issueSummary = issue?.summary;
      let issueCreatedDate = issue?.created;
      let issueResolvedDate = issue?.resolutionDate;
      let issueTypeId = issue?.typeId;
      let issueTypeName = issue?.typeName;
      let issueStatusCategoryChangeDate = issue?.statusCategoryChangeDate;

      changelog.transitions.forEach((transition) => {
        let transitionId = transition.id;
        let transitionCreatedDate = transition.created;
        let transitionStatusFromId = transition.statusFromId;
        let transitionStatusFromName = transition.statusFromName;
        let transitionStatusToId = transition.statusToId;
        let transitionStatusToName = transition.statusToName;
        let transaction = new Transaction(projectId, projectKey, projectName, issueId, issueKey, issueSummary, issueCreatedDate, issueResolvedDate, issueTypeId, issueTypeName, issueStatusCategoryChangeDate, transitionId, transitionCreatedDate, transitionStatusFromId, transitionStatusFromName, transitionStatusToId, transitionStatusToName);
        transactions.addTransaction(transaction);
      });

    });
    return transactions;
  }

}