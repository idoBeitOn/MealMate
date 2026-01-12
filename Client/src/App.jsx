import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Feed from "./components/Feed"; // זה הקומפוננט החדש שתיצור

function App() {
  const [authType, setAuthType] = useState("login"); // או "register"

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AuthForm type={authType} setAuthType={setAuthType} />}
        />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
