export interface Transition {
    transitionId: string;
    transitionDate: Date;
    fromStatus: string;
    fromStatusString: string;
    toStatus: string;
    toStatusString: string;
}

export class JiraIssueChangelog {
    issueId: string;
    transitions: Array<Transition>;


    constructor(issueId: string = "", transitions: Array<Transition> = []) {
        this.issueId = issueId;
        this.transitions = transitions
    }

    public addTransition(transition: Transition): void {
        this.transitions.push(transition);
      }

    public toString(): string {
        return this.transitions.map(
                                    t => this.issueId + " " +
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

  public findIssueChangelog(issueId: string): JiraIssueChangelog | undefined {
      return this.jiraIssuesChangelog.find(issueChangelog => issueChangelog.issueId === issueId);
  }
  
  public toString = () : string => {
    return  `[Total: ${this.jiraIssuesChangelog.length} issue(s)]\n` +
            `---------------------------------------------\n` +
            `${this.jiraIssuesChangelog.map(i => i.toString()).join('\n')}`;
  }

}