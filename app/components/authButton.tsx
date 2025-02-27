"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

 
    return (
    session ? (
        ""
      
    ) : (
      <button onClick={() => signIn()}>Zaloguj przez Discord</button>
    )
    );
}
 
export default AuthButton;
