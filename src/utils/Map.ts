export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function convertCoordsToTopAndLeftValues(coords: Coordinates): {
  top: number;
  left: number;
} {
  const { latitude, longitude } = coords;
  const x = ((longitude + 180) / 360) * 100 + 100;
  const y = ((90 - latitude) / 180) * 100;
  return { top: y, left: x };
}

export function generateBezierCurve(
    start: Coordinates,
    end: Coordinates,
    controlOffset: number,
    steps: number
  ): Coordinates[] {
    const control = {
      latitude: (start.latitude + end.latitude) / 2 + controlOffset,
      longitude: (start.longitude + end.longitude) / 2,
    };
  
    const points: Coordinates[] = [];
    for (let t = 0; t <= 1; t += 1 / steps) {
      const x =
        Math.pow(1 - t, 2) * start.longitude +
        2 * (1 - t) * t * control.longitude +
        Math.pow(t, 2) * end.longitude;
      const y =
        Math.pow(1 - t, 2) * start.latitude +
        2 * (1 - t) * t * control.latitude +
        Math.pow(t, 2) * end.latitude;
      points.push({ longitude: x, latitude: y });
    }
    return points;
  };