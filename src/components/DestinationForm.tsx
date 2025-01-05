"use client";

import { useState } from "react";

export default function DestinationForm({ userId }: { userId: number }) {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [review, setReview] = useState("");
  const [globalScore, setGlobalScore] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/destinations/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        name,
        latitude,
        longitude,
        review,
        globalScore,
        description,
      }),
    });

    if (res.ok) {
      alert("Destination added!");
    } else {
      alert("Failed to add destination");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Latitude</label>
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Longitude</label>
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Global Score</label>
        <input
          type="number"
          value={globalScore}
          onChange={(e) => setGlobalScore(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Add Destination</button>
    </form>
  );
}
