export interface DataSource {
    fetchData: () => void;
    toJson: () => string;
}