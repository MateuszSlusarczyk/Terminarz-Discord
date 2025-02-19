import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId, availability } = body;

        if (!userId || !availability) {
            return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
        }
        console.log(userId, availability);
        // Sprawdzenie, czy użytkownik istnieje
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "Użytkownik nie istnieje" }, { status: 404 });
        }

        // Sprawdzenie, czy użytkownik już ma wpis w Week
        const existingWeek = await prisma.week.findUnique({
            where: { id: userId },
        });

        if (existingWeek) {
            // Aktualizacja dostępności
            await prisma.week.update({
                where: { id: userId },
                data: {
                    Poniedziałek: availability.Poniedziałek,
                    Wtorek: availability.Wtorek,
                    Środa: availability.Środa,
                    Czwartek: availability.Czwartek,
                    Piątek: availability.Piątek,
                    Sobota: availability.Sobota,
                    Niedziela: availability.Niedziela,
                },
            });
        } else {
            // Tworzenie nowego wpisu dostępności
            await prisma.week.create({
                data: {
                    id: userId,
                    userId,
                    Poniedziałek: availability.Poniedziałek,
                    Wtorek: availability.Wtorek,
                    Środa: availability.Środa,
                    Czwartek: availability.Czwartek,
                    Piątek: availability.Piątek,
                    Sobota: availability.Sobota,
                    Niedziela: availability.Niedziela,
                },
            });
        }

        return NextResponse.json({ message: "Dane zapisane" }, { status: 200 });

    } catch (error) {
        console.error("Błąd zapisu:", (error as any).stack);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
