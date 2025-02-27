"use client"
import AuthButton from "./components/authButton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {Tabela} from "./components/tabela";
import { Navbar } from "./components/navbar";

export default function Home() {
  const session = useSession();

  return (
    <div className="h-full w-full  bg-background rounded-md">
      <Navbar/>
      {session.data ? 
      <div>
        
        <Tabela/>
      </div>
      : <h1>Logowanie przez Discord</h1>}
      <AuthButton />
    </div>
  );
}
