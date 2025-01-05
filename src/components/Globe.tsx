import React from "react";
import Globe from "react-globe.gl";

interface Destination {
  lat: number;
  lng: number;
  name: string;
  score: number;
}

const GlobeComponent = () => {
  const destinations: Destination[] = [
    { lat: 48.8566, lng: 2.3522, name: "Paris", score: 4.5 },
  ];

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      pointsData={destinations}
      pointLat={(d: object) => (d as Destination).lat}
      pointLng={(d: object) => (d as Destination).lng}
      pointLabel={(d: object) => `${(d as Destination).name}: ${(d as Destination).score}/5`}
    />
  );
};

export default GlobeComponent;