import { useState } from "react";
import AuthForm from "./components/AuthForm";

function App() {
  const [authType, setAuthType] = useState("login"); // או "register"

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <AuthForm type={authType} />
      <button
        className="mt-4 text-blue-500 underline"
        onClick={() => setAuthType(authType === "login" ? "register" : "login")}
      >
        {authType === "login" ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
}

export default App;
