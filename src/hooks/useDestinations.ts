import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDestinations() {
  // Change l’URL si besoin, ici on utilise ton endpoint custom
  const { data, error, isLoading, mutate } = useSWR(
    "/api/destinations/getFromId",
    fetcher
  );

  return {
    destinations: data,  // Données récupérées
    isLoading,
    error,
    mutate,              // Fonction pour forcer le re-fetch
  };
}
