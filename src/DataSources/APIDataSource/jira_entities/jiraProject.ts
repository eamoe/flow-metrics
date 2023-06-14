export class Project {

  id: string;
  key: string;
  name: string;
  created: Date;
  resolved: Date;
  typeId: string;
  typeName: string;

  issueTypes: Array<IssueType>;
  
  constructor(id: string = "",
              key: string = "",
              name: string = "",
              created: Date = new Date(),
              resolved: Date = new Date(),
              typeId: string = "",
              typeName: string = "",
              issueTypes: Array<IssueType> = []) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.created = created;
    this.resolved = resolved;
    this.typeId = typeId;
    this.typeName = typeName;
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