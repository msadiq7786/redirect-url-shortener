import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import { getUser } from "../db/auth";

type User = Awaited<ReturnType<typeof getUser>>;

type UserContextType = {
  user: User | null;
  loading: boolean | null;
  error?: Error | null;
  fetchUser: () => Promise<User | null | undefined>;
  isAuthenticated: boolean;
  initialized: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { data: user, loading, fn: fetchUser } = useFetch(getUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser().finally(() => setInitialized(true));
  }, []);
  return (
    <UserContext.Provider
      value={{ user, loading, fetchUser, isAuthenticated, initialized }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
}

export default UserProvider;
