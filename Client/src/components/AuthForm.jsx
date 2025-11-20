import { useState } from "react";

function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type.toUpperCase()} submitted:\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-600">
      <div className="bg-white/30 backdrop-blur-md p-10 rounded-3xl shadow-xl w-full max-w-lg border border-white/20">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-100 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/20 text-gray-900 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-100 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/20 text-gray-900 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500/80 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600/90 transition"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="text-indigo-200 font-semibold cursor-pointer hover:underline">
            {type === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
