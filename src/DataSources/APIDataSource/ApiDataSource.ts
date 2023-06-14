import { DataSource } from "../dataSource";
import { Version3Client } from "jira.js";
import { Issue, IssueList } from "./jira_entities/jiraIssue";
import { IssueChangelog, IssuesChangelogList } from "./jira_entities/jiraIssueChangelog";
import { Project, IssueType } from  "./jira_entities/jiraProject";
import { Transaction, TransactionList } from "./transactions/transaction";
import { Metadata, Transition } from "./interfaces";

export class ApiDataSource implements DataSource {
    
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

  private async fetchJiraIssueData(): Promise<void> {
    
    const rawData = await this.client.issueSearch.searchForIssuesUsingJql({
      jql: process.env.JQLFILTER!,
    });

    rawData["issues"]!.forEach((issue) => {
      const item = new Issue(
        issue["key"],
        issue["id"],
        issue["fields"]["summary"],
        new Date(issue["fields"]["created"]),
        new Date(issue["fields"]["resolutiondate"]!),
        issue["fields"]["issuetype"]!["name"]!,
        issue["fields"]["issuetype"]!["id"]!
      );
      this.issueList.addIssue(item);
    });
  }

  private async fetchJiraIssuesChangelogData(): Promise<void> {

    let rawData: any;
    await Promise.all(this.issueList.issues.map(async (issue) => {

      rawData = await this.client.issues.getChangeLogs( { issueIdOrKey: issue.key } );

      let issueChangelog = new IssueChangelog();

      rawData["values"].forEach((value: any) => {
        let items = value["items"]?.find((item: any) => item["fieldId"]! === "status");
        
        let transition: Transition = {id: value["id"]!,
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

  private async fetchJiraProjectData(): Promise<void> {
    
    const rawData = await this.client.projects.getProject({
      projectIdOrKey: process.env.PROJECTID!,
    });

    this.project.id = rawData["id"];
    this.project.key = rawData["key"];
    this.project.name = rawData["name"];
    this.project.created = new Date(0);
    this.project.resolved = new Date(rawData["deletedDate"]!);
    this.project.typeId = rawData["projectTypeKey"]!;
    this.project.typeName = rawData["style"]!;
    

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

  public async fetchData(): Promise<void> {
    console.log("Extracting jira issue data...");
    await this.fetchJiraIssueData();
    console.log("Extracting jira issue changelog...");
    await this.fetchJiraIssuesChangelogData();
    console.log("Extracting jira project...");
    await this.fetchJiraProjectData();
  }

  public toString(): string {
    return  `\n${this.issueList.toString()}\n` +
            `\n${this.changelogList.toString()}\n` +
            `\n${this.project.toString()}\n`;
            
  }

  private convertToTransactions(project: Project,
                                issueList: IssueList,
                                changelogList: IssuesChangelogList): TransactionList {
    
    let transactions = new TransactionList();
    
    transactions.metadata = {
                              id: project.id,
                              key: project.key,
                              summary: project.name,
                              created: new Date(project.created),
                              resolved: new Date(project.resolved),
                              typeId: project.typeId,
                              typeName: project.typeName
    } as Metadata;

    changelogList.issueChangelog.forEach((changelog) => {
      
      let key = changelog.issueKey;
      let issue = issueList.findIssue(key)!;
      let issueMetadata: Metadata = { id: issue?.id,
                                      key: issue?.key,
                                      summary: issue?.summary,
                                      created: issue?.created,
                                      resolved: issue?.resolutionDate,
                                      typeId: issue?.typeId,
                                      typeName: issue?.typeName};

      let transaction = new Transaction();
      transaction.metadata = issueMetadata;

      changelog.transitions.forEach((transition) => {

        transaction.transitions.push({id: transition.id,
                                      created: transition.created,
                                      statusFromId: transition.statusFromId,
                                      statusFromName: transition.statusFromName,
                                      statusToId: transition.statusToId,
                                      statusToName: transition.statusToName} as Transition);

      });

      transactions.addTransaction(transaction);

    });
    return transactions;
  }

  public toJsonString(): string {
    return JSON.stringify(this.convertToTransactions( this.project,
                                                      this.issueList,
                                                      this.changelogList));
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

 }