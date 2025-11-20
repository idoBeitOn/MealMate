import { useState } from "react";

function AuthForm() {
  const [type, setType] = useState("login"); // "login" או "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type.toUpperCase()} submitted:\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-white to-gray-50">
      <header className="w-full sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-center text-gray-900">
              MealMate
            </h1>

            <p className="mt-6 text-center max-w-2xl text-lg sm:text-xl font-semibold text-gray-600 leading-snug">
              Share recipes. Plan your week. Generate shopping lists — all in one place.
            </p>

            <div className="mt-3 text-center max-w-2xl text-lg sm:text-xl font-semibold text-gray-600 leading-snug">
              Your kitchen, simplified.
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full flex items-center justify-center px-6 py-12">
        <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-lg border border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              {type === "login" ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-gray-800 font-semibold cursor-pointer hover:underline"
              onClick={() => setType(type === "login" ? "register" : "login")}
            >
              {type === "login" ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
