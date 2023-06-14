import { Transition } from "../interfaces";

export class IssueChangelog {
  
  issueKey: string;
  transitions: Array<Transition>;


  constructor(issueKey: string = "", transitions: Array<Transition> = []) {
    this.issueKey = issueKey;
    this.transitions = transitions;
  }

  public addTransition(issueKey: string, transition: Transition): void {
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