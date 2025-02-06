import { MarketplaceResponse, Record } from "@/types";
import { transformDataToRestructuredData } from "@/utils";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    const records = await fetchAllRecords();
    const responseData: MarketplaceResponse = {
      records,
      offset: "", // Empty string since we've fetched all records
    };

    return NextResponse.json(transformDataToRestructuredData(responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function fetchAllRecords(): Promise<Record[]> {
  let allRecords: Record[] = [];
  let offset: string | undefined = undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Marketplace`
    );

    // Add offset parameter if it exists
    if (offset) {
      url.searchParams.append("offset", offset);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Airtable: ${response.statusText}`
      );
    }

    const data = (await response.json()) as MarketplaceResponse;
    allRecords = [...allRecords, ...data.records];
    offset = data.offset;
  } while (offset); // Continue fetching while there's an offset

  return allRecords;
}
