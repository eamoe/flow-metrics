export interface Transition {
    transitionId: string;
    transitionDate: Date;
    fromStatus: string;
    fromStatusString: string;
    toStatus: string;
    toStatusString: string;
}

export class JiraIssueChangelog {
    issueKey: string;
    transitions: Array<Transition>;


    constructor(issueId: string = "", transitions: Array<Transition> = []) {
        this.issueKey = issueId;
        this.transitions = transitions
    }

    public addTransition(issueKey: string, transition: Transition): void {
      this.issueKey = issueKey;
        this.transitions.push(transition);
      }

    public toString(): string {
        return this.transitions.map(
                                    t => this.issueKey + " " +
                                    t.transitionId + " " +
                                    t.transitionDate.toUTCString() + " " +
                                    t.fromStatusString +
                                    " -> " + t.toStatusString).join("\n");
    }

}

export class JiraIssuesChangelogList {
  
  jiraIssuesChangelog: Array<JiraIssueChangelog>;

  constructor(jiraIssuesChangelog: Array<JiraIssueChangelog> = []) {
    this.jiraIssuesChangelog = jiraIssuesChangelog;
  }

  public addIssue(issue: JiraIssueChangelog): void {
    this.jiraIssuesChangelog.push(issue);
  }

  public findIssueChangelog(issueKey: string): JiraIssueChangelog | undefined {
      return this.jiraIssuesChangelog.find(issueChangelog => issueChangelog.issueKey === issueKey);
  }
  
  public toString = () : string => {
    return  `${this.jiraIssuesChangelog.map(i => i.toString()).join('\n')}`;
  }

}