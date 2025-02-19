"use client"
import AuthButton from "./components/authButton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {Tabela} from "./components/tabela";

export default function Home() {
  const session = useSession();

  return (
    <div>
      {session.data ? 
      <div>
        <h1>Witaj, {session.data.user.name}!</h1> 
       <Tabela/>
      </div>
      : <h1>Logowanie przez Discord</h1>}
      <AuthButton />
    </div>
  );
}
