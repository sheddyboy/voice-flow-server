import { AirTableRecord, MarketplaceResponse } from "@/types";
import { transformDataToRestructuredData } from "@/utils";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";
// export const dynamic = "force-dynamic";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = "Marketplace";

// export async function GET() {
//   try {
//     const response = await fetch(
//       `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`,
//       {
//         headers: {
//           Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//         },
//         // next: { revalidate: 3600 }, // Cache for 1 hour
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch data from Airtable");
//     }

//     const data = (await response.json()) as MarketplaceResponse;
//     return NextResponse.json(transformDataToRestructuredData(data));
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const records = await fetchAllRecords();
    return NextResponse.json(
      transformDataToRestructuredData({ records, offset: "" })
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function fetchAllRecords(): Promise<AirTableRecord[]> {
  const allRecords: AirTableRecord[] = [];
  let offset: string | undefined = undefined;

  try {
    do {
      const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`
      );
      if (offset) url.searchParams.append("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) throw new Error("Failed to fetch data from Airtable");

      const data: MarketplaceResponse = await response.json();
      console.log({ records: data.records.length, offset: data.offset });
      allRecords.push(...data.records); // Append new records
      console.log({ offset: data.offset });
      offset = data.offset; // Get next offset
    } while (offset); // Continue fetching until there's no offset

    return allRecords;
  } catch (error) {
    console.error("Error fetching Airtable records:", error);
    throw new Error("Failed to retrieve all records");
  }
}
