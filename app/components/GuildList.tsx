"use client"
import { useEffect, useState } from "react";

interface Guild {
  id: string;
  name: string;
  icon: string;
}

export const GuildList = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  useEffect(() => {
    const fetchGuilds = async () => {
      const res = await fetch("/api/discord/guilds");
      const data = await res.json();
      setGuilds(data);
    };
    fetchGuilds();
  }, []);

  return (
    <div>
      <h2>Twoje serwery</h2>
      <ul>
        {guilds.map((guild) => (
          <li key={guild.id}>{guild.name}</li>
        ))}
      </ul>
    </div>
  );
};


