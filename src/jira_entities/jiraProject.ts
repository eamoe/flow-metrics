export class Project {

  id: string;
  key: string;
  name: string;

  issueTypes: Array<IssueType>;
  
  constructor(id: string = "",
              key: string = "",
              name: string = "",
              issueTypes: Array<IssueType> = []) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.issueTypes = issueTypes;
  }
  
  public toString(): string {
    return (
      `${this.id} ${this.key} ${this.name}\n` +
      `${this.issueTypes.join('\n')}`
    );
  }

}
  
export class IssueType {
    
  id: string;
  name: string;
  isSubtask: boolean;
  iconUrl: string;
  
  constructor(id: string = "",
              name: string = "",
              isSubtask: boolean = false,
              iconUrl: string = "") {
    this.id = id;
    this.name = name;
    this.isSubtask = isSubtask;
    this.iconUrl = iconUrl;
  }
  
  public toString(): string {
    return `${this.id} ${this.name} ${this.isSubtask}`;
  }
  
}