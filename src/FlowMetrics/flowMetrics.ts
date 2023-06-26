import { Transaction } from "../DataSources/APIDataSource/transactions/transaction";

type FlowItem = {
    key: string;
    typeId: string;
    startDatestamp: Date;
    endDatestamp: Date;
    duration: number;
    isCompleted: boolean;
  };
export class FlowMetrics {

  private flowItems: Array<FlowItem>;
  private flowVelocityDistribution: Map<number, number>;
  private flowTimeDistribution: Map<number, number>;
    
  constructor(rawData: Array<Transaction> = []) {
    this.flowItems = this.fetchFlowItems(rawData);
    this.flowTimeDistribution = this.formFlowTimeDistribution();
    this.flowVelocityDistribution = this.formFlowVelocityDistribution();
  }

  private fetchFlowItems(rawData: Array<Transaction>): Array<FlowItem> {
    let localFlowItems: Array<FlowItem> = [];
    rawData.forEach((transaction: Transaction) => {      
      const key = transaction["metadata"].key;
      const typeId = transaction["metadata"].typeId;
      const created = new Date(transaction["metadata"].created);
      const resolved = new Date(transaction["metadata"].resolved);
      const diffTime = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (diffTime >= 0) {
        const datestamp = new Date(`${resolved.getUTCFullYear()}-${resolved.getUTCMonth() + 1}-${resolved.getUTCDate() + 1}`);
        localFlowItems.push({key: key, typeId: typeId, startDatestamp: created, endDatestamp: datestamp, duration: diffTime, isCompleted: true});
      } else {
        const nowDate = new Date();
        const datestamp = new Date(`${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth() + 1}-${nowDate.getUTCDate() + 1}`);
        const diffTime = (nowDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        localFlowItems.push({key: key, typeId: typeId, startDatestamp: created, endDatestamp: datestamp, duration: diffTime, isCompleted: false});
      }
    });
    return localFlowItems;
  }

  public toString = () : string => {
    return  `\n[Total: ${this.flowItems.length} item(s)]\n` +
            `\n${this.flowItems.map(i => i.toString()).join('\n')}`;
  }

  public getFlowItems(): Array<FlowItem> {
    return this.flowItems;
  }

  public getFlowTimeDistribution(): Map<number, number> {
    return this.flowTimeDistribution;
  }

  public getFlowVelocityDistribution(): Map<number, number> {
    return this.flowVelocityDistribution;
  }

  private formFlowVelocityDistribution(): Map<number, number> {
    let flowVelocityMap = new Map<number, number>();
    this.flowItems.forEach(function (item: FlowItem) {
      if (item.isCompleted === true) {
        let dateMillis = item.endDatestamp.getTime();
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

  private formFlowTimeDistribution(): Map<number, number> {
    let flowTimeMap = new Map<number, number>();
    this.flowItems.forEach(function (item: FlowItem) {
      if (item.isCompleted === true) {
        let flowTime = Math.ceil(item.duration);
        if (flowTimeMap.has(flowTime)) {
          let value = flowTimeMap.get(flowTime);
          if (value) { flowTimeMap.set(flowTime, value + 1)};
        } else {
          flowTimeMap.set(flowTime, 1);
        }
      }
    });
  return flowTimeMap;
  }

}