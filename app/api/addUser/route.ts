import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obsługa metody POST
export const POST = async (req: NextRequest) => {
  try {
    // Parsowanie JSON-a z requestu
    const body = await req.json();

    const { name, avatar, accessToken, userId } = body;

    if (!name || !avatar || !accessToken || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        id: userId,
        nick: name,
        avatar,
        accessToken,
      },
    });

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// Obsługa innych metod
export const GET = async () => {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
};
