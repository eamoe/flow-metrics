export class Issue {
    
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
            `Resolved: ${this.resolutionDate.toUTCString()}\n`;
  }

}

export class IssueList {
  
  issues: Array<Issue>;

  constructor(issues: Array<Issue> = []) {
    this.issues = issues;
  }

  public toString = () : string => {
    return  `\n[Total: ${this.issues.length} issue(s)]\n` +
            `\n${this.issues.map(i => i.toString()).join('\n')}`;
  }

  public addIssue(issue: Issue): void {
    this.issues.push(issue);
  }

}