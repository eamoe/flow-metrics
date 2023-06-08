export class JiraIssue {
    
  key: string;
  id: string;
  summary: string;
  created: Date;
  resolutionDate: Date;
  typeName: string;
  typeId: string;
  statusCategoryChangeDate: Date;

  constructor(key: string,
              id: string,
              summary: string,
              created: string,
              resolutionDate: string,
              typeName: string,
              typeId: string,
              statusCategoryChangeDate: string) {
      this.key = key;
      this.id = id;
      this.summary = summary;
      this.created = new Date(created);
      this.resolutionDate = new Date(resolutionDate);
      this.typeName = typeName;
      this.typeId = typeId;
      this.statusCategoryChangeDate = new Date(statusCategoryChangeDate);
    }

  public toString = () : string => {
    return  `[${this.typeName}] ${this.key}\n` +
            `Summary: ${this.summary}\n` +
            `Created: ${this.created.toUTCString()}\n` +
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