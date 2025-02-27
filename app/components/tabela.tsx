"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookSession from "./bookSession";

interface WeekAvailability {
    Poniedziałek: string;
    Wtorek: string;
    Środa: string;
    Czwartek: string;
    Piątek: string;
    Sobota: string;
    Niedziela: string;
}

interface UserData {
    id: string;
    nick: string;
    daty?: WeekAvailability[];
}

export const Tabela = () => {

    const { data: session } = useSession();
    const [currentWeek, setCurrentWeek] = useState("");
    const [usersList, setUsersList] = useState<UserData[] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAvailability, setEditedAvailability] = useState<WeekAvailability>({
        Poniedziałek: "-",
        Wtorek: "-",
        Środa: "-",
        Czwartek: "-",
        Piątek: "-",
        Sobota: "-",
        Niedziela: "-",
    });
    const getCurrentWeek = () => {
        const today = new Date();
        
        // Znajdujemy poniedziałek (pierwszy dzień tygodnia)
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay() + 1); // +1 bo getDay() zwraca 0 dla niedzieli
    
        // Znajdujemy niedzielę (ostatni dzień tygodnia)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6); // +6 dni od poniedziałku
    
        // Format YYYY-MM-DD - YYYY-MM-DD
        const week = `${firstDay.toISOString().split("T")[0]} - ${lastDay.toISOString().split("T")[0]}`;
        
        return week;
    };
    

    const getUsers = async () => {
        try {
            const res = await fetch("/api/getUser");
            if (!res.ok) throw new Error("Błąd pobierania użytkowników");
            const data: UserData[] = await res.json();
            setUsersList(data);
        } catch (error) {
            console.error("Błąd pobierania użytkowników:", error);
        }
    };

    useEffect(() => {
        getUsers();
        const week = getCurrentWeek();
        setCurrentWeek(week);
        if (session?.user?.id) {
            fetch("/api/updateWeek", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, week }),
            });
        }
    }, []);

    const handleEdit = () => {
        if (!session?.user?.id) return;
        const user = usersList?.find((u) => u.id === session.user.id);
        
        if (user && user.daty && user.daty.length > 0) {
            setEditedAvailability(user.daty[0]);
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (day: keyof WeekAvailability, value: string) => {
        setEditedAvailability((prev) => ({
            ...prev,
            [day]: value,
        }));
    };

    const handleSave = async () => {
        if (!session?.user?.id) return;

        const response = await fetch("/api/updateAvailability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session.user.id,
                availability: editedAvailability,
            }),
        });

        if (response.ok) {
            getUsers();
            setIsEditing(false);
        } else {
            console.error("Błąd zapisu");
        }
    };

    // Funkcja zwracająca odpowiedni kolor dla nieaktywnych użytkowników
    const getColorClass = (value: string) => {
        switch (value) {
            case "Tak":
                return "bg-[linear-gradient(to_right,rgba(76,175,80,1)_0%,rgba(76,175,80,0.5)_100%)]"; // Zielony (#4CAF50) - jasny → ciemniejszy
            case "Nie":
                return "bg-[linear-gradient(to_right,rgba(244,67,54,1)_0%,rgba(244,67,54,0.5)_100%)]"; // Czerwony (#F44336) - jasny → ciemniejszy
            case "Może":
                return "bg-[linear-gradient(to_right,rgba(255,152,0,1)_0%,rgba(255,152,0,0.5)_100%)]"; // Pomarańczowy (#FF9800) - jasny → ciemniejszy
            default:
                return "bg-[linear-gradient(to_right,rgba(156,163,175,1)_0%,rgba(156,163,175,0.3)_100%)]"; // Szary (domyślny)
        }
    };
    

    return (
        <>
            <table className="w-full border border-accent1 table-fixed">
                <thead className="border">
                    <tr className="border-b bg-accent1">
                        <th className="border-r p-2">Użytkownik</th>
                        <th className="border-r p-2">Poniedziałek</th>
                        <th className="border-r p-2">Wtorek</th>
                        <th className="border-r p-2">Środa</th>
                        <th className="border-r p-2">Czwartek</th>
                        <th className="border-r p-2">Piątek</th>
                        <th className="border-r p-2">Sobota</th>
                        <th className="border-r p-2">Niedziela</th>
                        <th className="p-2">Data</th>
                    </tr>
                </thead>

                <tbody >
                    {usersList === null ? (
                        <tr>
                            <td colSpan={9} className="text-center p-4">Ładowanie...</td>
                        </tr>
                    ) : usersList.length > 0 ? (
                        usersList.map((user) => (
                            <tr key={user.id} 
                            className={`border-b ${user.id === session?.user?.id ? `${isEditing ? "animate-brightness bg-accent1" : ""}` : ""}`}
                        >
                        

                                <td className="border-r p-2">{user.nick}</td>
                                {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map((day) => {
                                    const value =
                                        user.daty && user.daty.length > 0 ? user.daty[0][day as keyof WeekAvailability] || "Brak danych" : "Brak danych";

                                    return (
                                        <td
                                            key={day}
                                            className={`border-r p-2 text-center w-1/8
                                                ${isEditing ? `${user.id !== session?.user?.id ?  `${getColorClass(value)}`:"" }` :`${getColorClass(value)}`}
                                            }`}
                                        >
                                            {isEditing && user.id === session?.user?.id ? (
                                                <select
                                                    value={editedAvailability[day as keyof WeekAvailability] || "-"}
                                                    onChange={(e) => handleChange(day as keyof WeekAvailability, e.target.value)}
                                                    className="border rounded px-2 py-1 bg-background"
                                                >
                                                    <option value="-">-</option>
                                                    <option value="Tak">Tak</option>
                                                    <option value="Nie">Nie</option>
                                                    <option value="Może">Może</option>
                                                </select>
                                            ) : (
                                                value
                                            )}
                                        </td>
                                    );
                                })}
                                <td className="text-center">{currentWeek}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center p-4">Brak użytkowników</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {session && (
                <div className="mt-4">
                    {!isEditing ? (
                        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-700">
                            Edytuj
                        </button>
                    ) : (
                        <div className="space-x-4">
                            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-green-700">
                                Zapisz
                            </button>
                            <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-red-700">
                                Anuluj
                            </button>
                        </div>
                    )}
                </div>
            )}
            {session?.user.rola == "Mistrz Gry" ? 
            <BookSession/>
            : <p>Nie</p>}
        </>
    );
};