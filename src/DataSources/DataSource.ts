export interface DataSource {
    
    fetchData: (dataSource: DataSource) => void;
    toJsonString: () => string;
    toString: () => string;
    
}