export interface MarketplaceResponse {
  records: AirTableRecord[];
  offset: string;
}

export interface AirTableRecord {
  id: string;
  createdTime: Date;
  fields: Fields;
}

export interface Fields {
  "Template Name": string;
  Downloads?: number;
  TemplateID: string;
  CreatorID: string;
  "Created At": Date;
  "Last Updated": Date;
}

export interface RestructuredResponse {
  [templateID: string]: number;
}
