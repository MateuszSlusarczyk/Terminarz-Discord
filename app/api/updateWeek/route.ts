import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const { userId, week } = await req.json();
        if (!userId || !week) {
            return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { currentWeek: week },
        });

        return NextResponse.json({ message: "Tydzień zaktualizowany" }, { status: 200 });
    } catch (error) {
        console.error("Błąd zapisu:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
