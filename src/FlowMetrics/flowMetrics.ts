import { Transaction } from "../DataSources/APIDataSource/transactions/transaction";

type FlowItem = {
    key: string;
    //type: string;
    //currentStatus: string;
    datestamp: Date;
    duration: number;
    isCompleted: boolean;
  };

export class FlowMetrics {

  private rawData: Array<Transaction>;  
  private flowTime: Array<FlowItem>;
  
    constructor(rawData: Array<Transaction> = []) {
        this.rawData = rawData;
        this.flowTime = new Array<FlowItem>();
      }
  
    public toString = () : string => {
        return  `\n[Total: ${this.flowTime.length} item(s)]\n` +
                `\n${this.flowTime.map(i => i.toString()).join('\n')}`;
    }

    public fetchFlowMetrics(): void {
      this.fetchFlowItems();
    }

    private fetchFlowItems(): void {
      this.rawData.forEach((transaction) => {      
        const key = transaction["metadata"].key;
        const created = new Date(transaction["metadata"].created);
        const resolved = new Date(transaction["metadata"].resolved);
        const diffTime = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        if (diffTime >= 0) {
          const datestamp = new Date(`${resolved.getUTCFullYear()}-${resolved.getUTCMonth() + 1}-${resolved.getUTCDate() + 1}`);
          this.flowTime.push({key: key, datestamp: datestamp, duration: diffTime, isCompleted: true});
        } else {
          const nowDate = new Date();
          const datestamp = new Date(`${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth() + 1}-${nowDate.getUTCDate() + 1}`);
          const diffTime = (nowDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          this.flowTime.push({key: key, datestamp: datestamp, duration: diffTime, isCompleted: false});
        }
      });
    }

    public getFlowTime(): Array<FlowItem> {
      return this.flowTime;
    }

    public formFlowVelocityDistribution(): Map<number, number> {
      let flowVelocityMap = new Map<number, number>();
      this.flowTime.forEach(function (item: FlowItem) {
        if (item.isCompleted === true) {  
          let dateMillis = item.datestamp.getTime();
          if (flowVelocityMap.has(dateMillis)) {
            let value = flowVelocityMap.get(dateMillis);
            if (value) { flowVelocityMap.set(dateMillis, value + 1)};
          } else {
            flowVelocityMap.set(dateMillis, 1);
          }
        }
      });
    return flowVelocityMap;
    }

}