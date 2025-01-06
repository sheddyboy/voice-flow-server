import { MarketplaceResponse, RestructuredResponse } from "@/types";

export function transformDataToRestructuredData(
  response: MarketplaceResponse
): RestructuredResponse {
  return response.records.reduce<RestructuredResponse>((acc, record) => {
    acc[record.fields.TemplateID] = record.fields.Downloads ?? 0;
    return acc;
  }, {});
}
