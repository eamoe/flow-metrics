export class Transaction {
    
    projectId: string;
    projectKey: string;
    projectName: string;
    issueId: string;
    issueKey: string;
    issueSummary: string;
    issueCreatedDate: Date;
    issueResolvedDate: Date;
    issueTypeId: string;
    issueTypeName: string;
    statusCategoryChangeDate: Date;
    transitionId: string;
    transitionCreatedDate: Date;
    transitionStatusFromId: string;
    transitionStatusFromName: string;
    transitionStatusToId: string;
    transitionStatusToName: string;
  
    constructor(projectId: string,
                projectKey: string,
                projectName: string,
                issueId: string,
                issueKey: string,
                issueSummary: string,
                issueCreatedDate: Date,
                issueResolvedDate: Date,
                issueTypeId: string,
                issueTypeName: string,
                statusCategoryChangeDate: Date,
                transitionId: string,
                transitionCreatedDate: Date,
                transitionStatusFromId: string,
                transitionStatusFromName: string,
                transitionStatusToId: string,
                transitionStatusToName: string) {
            this.projectId = projectId;
            this.projectKey = projectKey;
            this.projectName = projectName;
            this.issueId = issueId;
            this.issueKey = issueKey;
            this.issueSummary = issueSummary;
            this.issueCreatedDate = issueCreatedDate;
            this.issueResolvedDate = issueResolvedDate;
            this.issueTypeId = issueTypeId;
            this.issueTypeName = issueTypeName;
            this.statusCategoryChangeDate = statusCategoryChangeDate;
            this.transitionId = transitionId;
            this.transitionCreatedDate = transitionCreatedDate;
            this.transitionStatusFromId = transitionStatusFromId;
            this.transitionStatusFromName = transitionStatusFromName;
            this.transitionStatusToId = transitionStatusToId;
            this.transitionStatusToName = transitionStatusToName;
      }
  
    public toString = (): string => {
        return  `${this.projectId}: ` +
                `${this.projectKey}: ` +
                `${this.projectName}: ` +
                `${this.issueId}: ` +
                `${this.issueKey}: ` +
                `${this.issueSummary}: ` +
                `${this.issueCreatedDate}: ` +
                `${this.issueResolvedDate}: ` +
                `${this.issueTypeId}: ` +
                `${this.issueTypeName}: ` +
                `${this.statusCategoryChangeDate}: ` +
                `${this.transitionId}: ` +
                `${this.transitionCreatedDate}: ` +
                `${this.transitionStatusFromId}: ` +
                `${this.transitionStatusFromName}: ` +
                `${this.transitionStatusToId}: ` +
                `${this.transitionStatusToName}`;
    }
  
  }
  
  export class TransactionList {
    
    transactions: Array<Transaction>;
  
    constructor(transactions: Array<Transaction> = []) {
      this.transactions = transactions;
    }
  
    public toString = () : string => {
      return  `\n[Total: ${this.transactions.length} issue(s)]\n` +
              `\n${this.transactions.map(item => item.toString()).join('\n')}`;
    }
  
    public addTransaction(transaction: Transaction): void {
      this.transactions.push(transaction);
    }
  
  }