import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  password2: string;
}

interface ErrorResponse {
  username?: string[];
  password?: string[];
  email?: string[];
  password2?: string[];
  detail?: string;
  [key: string]: unknown;
}

function Signup() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL as string;

  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
    password2: "",
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
      const res = await fetch(`${BASE}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          username: form.username.trim().replace(/\s+/g, "_"),
        }),
      });

      const data: ErrorResponse = await res.json();

      if (res.ok) {
        setMsg("Account created. Redirecting to login...");

        setTimeout(() => {
          nav("/login");
        }, 1200);
      } else {
        setMsg(
          (data.username?.[0] as string) ||
            (data.password?.[0] as string) ||
            (data.email?.[0] as string) ||
            (data.password2?.[0] as string) ||
            data.detail ||
            JSON.stringify(data),
        );
      }
    } catch (err) {
      console.error(err);
      setMsg("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-4xl font-bold mb-4">Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-4 text-lg border rounded"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
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

          <input
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full p-4 text-lg border rounded"
          />

          <button className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl">
            Create Account
          </button>
        </form>

        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </div>
  );
}

export default Signup;
