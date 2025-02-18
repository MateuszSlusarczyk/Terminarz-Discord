import { useState } from "react";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const createUser = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar, accessToken, userId: "test-user" }),
    });
    console.log(response);
  };

  return (
    <div className="text-black">
      <input type="text" placeholder="Nazwa" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Avatar" onChange={(e) => setAvatar(e.target.value)} />
      <input type="text" placeholder="Token" onChange={(e) => setAccessToken(e.target.value)} />
      <button onClick={createUser}>Dodaj użytkownika</button>
    </div>
  );
};

export default CreateUser;
