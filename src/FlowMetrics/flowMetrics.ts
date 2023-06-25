import { Transaction } from "../DataSources/APIDataSource/transactions/transaction";

type FlowItem = {
    key: string;
    date: Date;
    value: number;
  };

export class FlowMetrics {

    private flowTime: Array<FlowItem> = new Array<FlowItem>();
    private rawData: Array<Transaction>;
  
    constructor(rawData: Array<Transaction> = []) {
        this.rawData = rawData;
      }
  
    public toString = () : string => {
        return  `\n[Total: ${this.flowTime.length} item(s)]\n` +
                `\n${this.flowTime.map(i => i.toString()).join('\n')}`;
    }

    public fetchFlowMetrics(): void {
      this.fetchFlowTime();
    }

    private fetchFlowTime(): void {
      this.rawData.forEach((transaction) => {      
        const key = transaction["metadata"].key;
        const created = new Date(transaction["metadata"].created);
        const resolved = new Date(transaction["metadata"].resolved);
        const diffTime = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        if (diffTime > 0) {
          const timestamp = new Date(`${resolved.getUTCFullYear()}-${resolved.getUTCMonth() + 1}-${resolved.getUTCDate() + 1}`);
          this.flowTime.push({key: key, date: timestamp, value: diffTime});
        }  
      });
    }

    public getFlowTime(): Array<FlowItem> {
      return this.flowTime;
    }

    public formFlowVelocityDistribution(): Map<number, number> {
      let flowVelocityMap = new Map<number, number>();
      this.flowTime.forEach(function (item: FlowItem) {
      let dateMillis = item.date.getTime();
      if (flowVelocityMap.has(dateMillis)) {
        let value = flowVelocityMap.get(dateMillis);
        if (value) { flowVelocityMap.set(dateMillis, value + 1)};
      } else {
        flowVelocityMap.set(dateMillis, 1);
      }
      });
    return flowVelocityMap;
    }

}