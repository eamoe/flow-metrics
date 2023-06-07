export class JiraIssue {
    
    issueKey: string;
    issueId: string;
    issueSummary: string;
    createdDate: Date;
    resolutionDate: Date;
    issueType: string;
    issueTypeId: string;
    statusCategoryChangeDate: Date;

    constructor(
                issueKey: string,
                issueId: string,
                issueSummary: string,
                createdDate: string,
                resolutionDate: string,
                issueType: string,
                issueTypeId: string,
                statusCategoryChangeDate: string) {
        this.issueKey = issueKey;
        this.issueId = issueId;
        this.issueSummary = issueSummary;
        this.createdDate = new Date(createdDate);
        this.resolutionDate = new Date(resolutionDate);
        this.issueType = issueType;
        this.issueTypeId = issueTypeId;
        this.statusCategoryChangeDate = new Date(statusCategoryChangeDate);
      }

    public toString = () : string => {
        return `[${this.issueType}] ${this.issueKey}\n` +
                `Summary: ${this.issueSummary}\n` +
                `Created: ${this.createdDate.toUTCString()}\n` +
                `Resolved: ${this.resolutionDate.toUTCString()}\n` +
                `---------------------------------------------`;
    }

}

export class JiraIssueList {
  
  jiraIssues: Array<JiraIssue>;

  constructor(jiraIssues: Array<JiraIssue> = []) {
    this.jiraIssues = jiraIssues;
  }

  public toString = () : string => {
    return  `[Total: ${this.jiraIssues.length} issue(s)]\n` +
            `---------------------------------------------\n` +
            `${this.jiraIssues.map(i => i.toString()).join('\n')}`;
  }

  public addIssue(issue: JiraIssue): void {
    this.jiraIssues.push(issue);
  }

}