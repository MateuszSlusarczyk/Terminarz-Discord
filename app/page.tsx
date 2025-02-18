"use client"
import AuthButton from "./components/authButton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  useEffect(() => {
    console.log(session);
  }
  , [session]);
  return (
    <div>
      {session.data ? <h1>Witaj, {session.data.user.name}!</h1> : <h1>Logowanie przez Discord</h1>}
      <table>
        <thead>
          <tr>
            <th>Poniedziałek</th>
            <th>Wtorek</th>
            <th>Środa</th>
            <th>Czwartek</th>
            <th>Piątek</th>
            <th>Sobota</th>
            <th>Niedziela</th>
            <th>Termin</th>
          </tr>
        </thead>
       
      </table>
      <AuthButton />
    </div>
  );
}
