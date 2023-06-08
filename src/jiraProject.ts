export class JiraProject {

  projectId: string;
  projectKey: string;
  projectName: string;

  issueTypes: Array<IssueType>;

  constructor(projectId: string = "",
              projectKey: string = "",
              projectName: string = "",
              issueTypes: Array<IssueType> = []) {
    this.projectId = projectId;
    this.projectKey = projectKey;
    this.projectName = projectName;
    this.issueTypes = issueTypes;
  }

  public toString(): string {
    return (
      `${this.projectId} ${this.projectKey} ${this.projectName}\n` +
      `${this.issueTypes.join('\n')}`
    );
  }
}

export class IssueType {
  
  issueTypeId: string;
  issueTypeIconUrl: string;
  IssueTypeName: string;
  IsSubtask: boolean;

  constructor(
              issueTypeId: string = "",
              issueTypeIconUrl: string = "",
              issueTypeName: string = "",
              IsSubtask: boolean = false) {
    this.issueTypeId = issueTypeId;
    this.issueTypeIconUrl = issueTypeIconUrl;
    this.IssueTypeName = issueTypeName;
    this.IsSubtask = IsSubtask;
  }

  public toString(): string {
    return `${this.issueTypeId} ${this.IssueTypeName} ${this.IsSubtask}`;
  }

}