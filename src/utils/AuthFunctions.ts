import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const handleLogin = async (
  email: string,
  password: string,
  setError: (error: string | null) => void,
  router: ReturnType<typeof useRouter>
) => {
  setError(null);

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    setError("Invalid email or password.");
    return false; 
  } else {
    router.push("/globe"); 
    return true; 
  }
};

export const registerUser = async (
email: string, password: string, name: string, setError: (error: string | null) => void, setIsLoading: (isLoading: boolean) => void, handleLogin: (
    email: string,
    password: string,
    setError: (error: string | null) => void,
    router: ReturnType<typeof useRouter>
) => Promise<boolean>, router: ReturnType<typeof useRouter>) => {
  setError(null); 
  setIsLoading(true);

  try {
    const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name,
        register: "true",
      });

    if (res?.error) {
      throw new Error(res.error);
    }

    router.push("/globe");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
