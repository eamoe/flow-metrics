export interface Metadata {   
    id: string;
    key: string;
    summary: string;
    created: Date;
    resolved: Date;
    typeId: string;
    typeName: string;
}

export interface Transition {
    id: string;
    created: Date;
    statusFromId: string;
    statusFromName: string;
    statusToId: string;
    statusToName: string;
}