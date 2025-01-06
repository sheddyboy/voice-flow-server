export interface MarketplaceResponse {
  records: Record[];
  offset: string;
}

export interface Record {
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
