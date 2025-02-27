import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Navbar = () => {
    const { data: session } = useSession();
    const name = session?.user.name 
        ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1) 
        : '';

    return (
        <div className="bg-backgroundDark text-textMain w-full flex flex-col justify-end items-end p-4 group relative">
            {/* Sekcja z nazwą i avatarem */}
            {session?
            <>
            <div className="flex justify-end items-center">
                <h2 className="font-bold mr-2">{name}</h2>
                <Image 
                    src={session?.user.avatar || "/default-avatar.png"} 
                    alt="avatar" 
                    width={50} 
                    height={50} 
                    className="rounded-full"
                />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-16 right-0 bg-backgroundDark shadow-md rounded-md p-2">
            <button onClick={() => signOut() } className="text-white font-bold">Wyloguj</button>
            </div>
            </>:
            <div className=" bg-backgroundDark shadow-md rounded-md p-2 h-1/6">
                <button onClick={() => signIn()} className="text-white font-bold">Zaloguj</button>
            </div>
            } 


        </div>
    );
};
