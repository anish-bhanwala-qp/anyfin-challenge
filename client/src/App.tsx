import { useEffect, useState } from "react";
import "./App.css";
import { Loading } from "./components/Loading";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { getUser } from "./services/AuthService";
import { User } from "./typings/User";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUser = getUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    setLoading(false);
  }, []);

  let content = <LoginPage onLogin={setUser} />;
  if (loading) {
    content = <Loading />;
  } else if (user) {
    content = <HomePage />;
  }

  return <div className="App">{content}</div>;
}

export default App;
