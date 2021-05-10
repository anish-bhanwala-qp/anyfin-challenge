import { useEffect, useState } from "react";
import "./App.css";
import { Loading } from "./components/Loading";
import { useLocalStorageCache } from "./hooks/useLocalStorageCache";
import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/login/LoginPage";
import { getUser, JWT_KEY, isTokenExpired } from "./services/AuthService";
import { User } from "./typings";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useLocalStorageCache<string>({
    key: JWT_KEY,
    cacheExpiryCheker: isTokenExpired,
    decoder: (value) => value,
    encoder: (value) => value,
  });

  const loginHandler = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  useEffect(() => {
    if (accessToken) {
      setUser(getUser(accessToken));
    }

    setLoading(false);
  }, [accessToken]);

  let content = <LoginPage onLogin={loginHandler} />;
  if (loading) {
    content = <Loading />;
  } else if (user) {
    content = <HomePage />;
  }

  return <div className="App">{content}</div>;
}

export default App;
