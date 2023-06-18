export interface DataStorage {
    
    sendDataToStorage: (data: string) => void;
    retrieveDataFromStorage: () => string;
    
}