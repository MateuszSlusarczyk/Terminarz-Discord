import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obsługa metody GET
export const GET = async (req: NextRequest) => {
  try {
   
    const kampanie = await prisma.kampania.findMany(
        {
            include: {
                Gracze: {
                  include: {
                    daty: true
                  },
                },
                MistrzGry: true
            }
        }
    );

    return NextResponse.json(kampanie, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// Obsługa innych metod
export const POST = async () => {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
};
