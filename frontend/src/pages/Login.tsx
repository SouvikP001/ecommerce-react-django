import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokens } from "../utils/auth";
import { Link } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

function Login() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL as string;

  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [msg, setMsg] = useState<string>("");

  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${BASE}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          username: form.username.trim().replace(/\s+/g, "_"),
        }),
      });

      const data: TokenResponse | { detail: string } = await res.json();

      if (res.ok) {
        saveTokens(data as TokenResponse);
        setMsg("Login successful!");

        setTimeout(() => {
          nav("/");
        }, 800);
      } else {
        setMsg((data as { detail: string }).detail || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMsg("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-4xl font-bold mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full p-4 text-lg border rounded"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-4 text-lg border rounded"
          />

          <button className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl">
            Login
          </button>
        </form>

        {msg && <p className="mt-3 text-xl">{msg}</p>}

        <div className="mt-4 text-xl">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
