import { Transaction } from "../DataSources/APIDataSource/transactions/transaction";

type FlowTimeItem = {
    key: string;
    date: Date;
    value: number;
  };

export class FlowTime {

    private flowTime: Array<FlowTimeItem> = new Array<FlowTimeItem>();
    private rawData: Array<Transaction>;
  
    constructor(rawData: Array<Transaction> = []) {
        this.rawData = rawData;
      }
  
    public toString = () : string => {
        return  `\n[Total: ${this.flowTime.length} item(s)]\n` +
                `\n${this.flowTime.map(i => i.toString()).join('\n')}`;
    }

    public fetchFlowTime(): void {
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

    public getFlowTime(): Array<FlowTimeItem> {
      return this.flowTime;
    }

    public createFlowTimeDistribution(): Map<number, number> {
      let flowTimeMap = new Map<number, number>();
      this.flowTime.forEach(function (item: FlowTimeItem) {
      let dateMillis = item.date.getTime();
      if (flowTimeMap.has(dateMillis)) {
        let value = flowTimeMap.get(dateMillis);
        if (value) { flowTimeMap.set(dateMillis, value + 1)};
      } else {
        flowTimeMap.set(dateMillis, 1);
      }
      });
    return flowTimeMap;
    }

}