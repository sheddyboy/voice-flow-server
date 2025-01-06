import { MarketplaceResponse, RestructuredResponse } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Marketplace`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from Airtable");
    }

    const data = (await response.json()) as MarketplaceResponse;
    return NextResponse.json(transformDataToRestructuredData(data));
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function transformDataToRestructuredData(
  response: MarketplaceResponse
): RestructuredResponse {
  return response.records.reduce<RestructuredResponse>((acc, record) => {
    acc[record.fields.TemplateID] = record.fields.Downloads ?? 0;
    return acc;
  }, {});
}
