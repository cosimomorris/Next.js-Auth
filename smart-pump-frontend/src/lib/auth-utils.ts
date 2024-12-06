import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface ErrorResponse {
  data?: {
    message: string;
  };
  status?: number;
}

export function useAuth(redirectTo: string = "/login") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  return { session, status };
}

export function getAuthHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function handleAuthError(error: AxiosError<ErrorResponse>) {
  if (error.response?.status === 401) {
    return "Your session has expired. Please login again.";
  }
  return "An error occurred";
}
