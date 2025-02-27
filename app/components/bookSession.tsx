import React, { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface WeekAvailability {
    Poniedziałek: string;
    Wtorek: string;
    Środa: string;
    Czwartek: string;
    Piątek: string;
    Sobota: string;
    Niedziela: string;
}

interface campaignData {
    id: number;
    Nazwa: string;
    Gracze: { id: string; nick: string; daty: WeekAvailability[] }[];
    MistrzGry: { id: string; nick: string }[];
    ZarezerwowanyDzien: string;
    DataTerminu: string;
}

const BookSession: React.FC = () => {
    const [isBooking, setIsBooking] = useState(false);
    const [campaignList, setCampaignList] = useState<campaignData[]>([]);
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [sessionDetails, setSessionDetails] = useState({
        campaignId: "",
        date: "",
        time: "",
    });

    // Pobranie dostępnych kampanii
    useEffect(() => {
        const getCampaigns = async () => {
            try {
                const res = await fetch("/api/getCampaigns");
                if (!res.ok) throw new Error("Błąd pobierania kampanii");
                const data: campaignData[] = await res.json();

                console.log(data);
                setCampaignList(data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };
        getCampaigns();
    }, []);

    // Sprawdzenie dostępnych dni po wybraniu kampanii
    const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const campaignId = e.target.value;
        setSessionDetails({ ...sessionDetails, campaignId });

        const selectedCampaign = campaignList.find((c) => c.id.toString() === campaignId);
        if (!selectedCampaign) return;

        // Pobranie dostępności graczy
        const playersAvailability = selectedCampaign.Gracze.map((player) => player.daty[0]);

        // Lista dni tygodnia
        const daysOfWeek: (keyof WeekAvailability)[] = [
            "Poniedziałek",
            "Wtorek",
            "Środa",
            "Czwartek",
            "Piątek",
            "Sobota",
            "Niedziela",
        ];

        // Sprawdzenie, które dni mają u wszystkich graczy status "Tak"
        const available = daysOfWeek.filter((day) =>
            playersAvailability.every((availability) => availability[day] === "Tak")
        );

        setAvailableDays(available);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSessionDetails({ ...sessionDetails, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // const res = await fetch("/api/bookSession", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(sessionDetails),
            // });

            // if (!res.ok) throw new Error("Rezerwacja nie powiodła się");

            alert("Termin zarezerwowany pomyślnie!");
            setIsBooking(false);
        } catch (error) {
            console.error("Error booking session:", error);
            alert("Nie można zarezerwować terminu.");
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsBooking(!isBooking)}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded transition-all duration-300 hover:bg-blue-700"
            >
                Zarezerwuj Termin
            </button>

            {isBooking && (
                <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded bg-background">
                    <h3 className="font-bold mb-2">Wybierz kampanię i dostępny termin:</h3>

                    {/* Wybór kampanii */}
                    <div>
                        <label htmlFor="campaign">Sesja:</label>
                        <select
                            id="campaign"
                            name="campaignId"
                            value={sessionDetails.campaignId}
                            onChange={handleCampaignChange}
                            required
                            className="border rounded px-2 py-1 bg-background w-full mb-2"
                        >
                            <option value="">Wybierz kampanię</option>
                            {campaignList.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.Nazwa}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Wybór dostępnego dnia */}
                    <div>
                        <label htmlFor="date">Dostępny dzień:</label>
                        <select
                            id="date"
                            name="date"
                            value={sessionDetails.date}
                            onChange={handleChange}
                            required
                            className="border rounded px-2 py-1 bg-background w-full mb-2"
                        >
                            <option value="">Wybierz dzień</option>
                            {availableDays.length > 0 ? (
                                availableDays.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    Brak dostępnych dni
                                </option>
                            )}
                        </select>
                    </div>

                    {/* Wybór godziny */}
                    <div>
                        <label htmlFor="time">Godzina:</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={sessionDetails.time}
                            onChange={handleChange}
                            required
                            className="border rounded px-2 py-1 bg-background w-full mb-2"
                        />
                    </div>

                    {/* Przycisk do potwierdzenia lub anulowania */}
                    <div className="space-x-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-700"
                        >
                            Potwierdź
                        </button>
                        <button
                            onClick={() => setIsBooking(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded transition-all hover:bg-red-700"
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookSession;
