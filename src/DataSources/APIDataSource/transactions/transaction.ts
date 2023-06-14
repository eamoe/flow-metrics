import { Metadata, Transition } from "../interfaces";
export class Transaction {
    
    metadata: Metadata;
    transitions: Array<Transition>;
  
    constructor(metadata: Metadata = {} as Metadata, transitions: Array<Transition> = []) {
      this.metadata = metadata;
      this.transitions = transitions;
    }
  
    public toString = (): string => {
        return  `${this.metadata}` +
                `${this.transitions.toString()}`;
    }
  
  }
  
  export class TransactionList {
    
    metadata: Metadata;
    transactions: Array<Transaction>;
  
    constructor(metadata: Metadata = {} as Metadata, transactions: Array<Transaction> = []) {
      this.metadata = metadata;
      this.transactions = transactions;
    }
  
    public toString = () : string => {
      return  `\n[Total: ${this.transactions.length} issue(s)]\n` +
              `\n${this.metadata}` +
              `\n${this.transactions.map(item => item.toString()).join('\n')}`;
    }
  
    public addTransaction(transaction: Transaction): void {
      this.transactions.push(transaction);
    }
  
  }