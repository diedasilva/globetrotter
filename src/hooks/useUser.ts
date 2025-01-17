import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser(userId?: string) {
  // On ne fetch pas si userId est null/undefined => clé SWR = null
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  return {
    user: data,     // L'utilisateur renvoyé par l'API
    error,
    isLoading,
    mutateUser: mutate, // Fonction pour revalider manuellement
  };
}
