"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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

    const getUsers = async () => {
        try {
            const res = await fetch("/api/getUser");
            if (!res.ok) throw new Error("Błąd pobierania użytkowników");
            const data: UserData[] = await res.json();
            console.log(data);
            setUsersList(data);
        } catch (error) {
            console.error("Błąd pobierania użytkowników:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleEdit = () => {
        if (!session?.user?.id) return;
        const user = usersList?.find((u) => u.id === session.user.id);
        if (user && user.daty && user.daty.length > 0) {
            setEditedAvailability(user.daty[0]); // Pobranie pierwszej dostępności
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

    return (
        <>
            <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Użytkownik</th>
                        <th>Poniedziałek</th>
                        <th>Wtorek</th>
                        <th>Środa</th>
                        <th>Czwartek</th>
                        <th>Piątek</th>
                        <th>Sobota</th>
                        <th>Niedziela</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList === null ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center" }}>Ładowanie...</td>
                        </tr>
                    ) : usersList.length > 0 ? (
                        usersList.map((user) => (
                            <tr key={user.id} style={user.id === session?.user?.id ? { backgroundColor: "#f0f8ff" } : {}}>
                                <td>{user.nick}</td>
                                {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map((day) => (
                                    <td key={day}>
                                        {isEditing && user.id === session?.user?.id ? (
                                            <select value={editedAvailability[day as keyof WeekAvailability] || "-"} onChange={(e) => handleChange(day as keyof WeekAvailability, e.target.value)}>
                                                <option value="-">-</option>
                                                <option value="Tak">Tak</option>
                                                <option value="Nie">Nie</option>
                                                <option value="Może">Może</option>
                                            </select>
                                        ) : (
                                            user.daty && user.daty.length > 0 ? user.daty[0][day as keyof WeekAvailability] || "Brak danych" : "Brak danych"
                                        )}
                                    </td>
                                ))}
                                <td>Brak terminu</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center" }}>Brak użytkowników</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {session && (
                <>
                    {!isEditing ? (
                        <button onClick={handleEdit}>Edytuj</button>
                    ) : (
                        <>
                            <button onClick={handleSave}>Zapisz</button>
                            <button onClick={handleCancel}>Anuluj</button>
                        </>
                    )}
                </>
            )}
        </>
    );
};
