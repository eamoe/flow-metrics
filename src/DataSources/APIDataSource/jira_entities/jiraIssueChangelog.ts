// TODO: Remove this if statusCategoryChangeDate is not needed
export interface IssueTransition {   
  id: string;
  created: Date;
  statusFromId: string;
  statusFromName: string;
  statusToId: string;
  statusToName: string;
}

export class IssueChangelog {
  
  issueKey: string;
  transitions: Array<IssueTransition>;


  constructor(issueKey: string = "", transitions: Array<IssueTransition> = []) {
    this.issueKey = issueKey;
    this.transitions = transitions;
  }

  public addTransition(issueKey: string, transition: IssueTransition): void {
    this.issueKey = issueKey;
    this.transitions.push(transition);
  }

  public toString(): string {
    return this.transitions.map(t => this.issueKey + " " +
                                t.id + " " +
                                t.created.toUTCString() + " " +
                                t.statusFromName + " -> " +
                                t.statusToName).join("\n");
    }

}

export class IssuesChangelogList {
  
  issueChangelog: Array<IssueChangelog>;

  constructor(issueChangelog: Array<IssueChangelog> = []) {
    this.issueChangelog = issueChangelog;
  }

  public addIssue(issue: IssueChangelog): void {
    this.issueChangelog.push(issue);
  }

  public findIssueChangelog(issueKey: string): IssueChangelog | undefined {
      return this.issueChangelog.find(issueChangelog => issueChangelog.issueKey === issueKey);
  }
  
  public toString = () : string => {
    return `${this.issueChangelog.map(item => item.toString()).join('\n')}`;
  }

}