import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";


function CheckoutPage() {
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const navigate = useNavigate();
    const { clearCart } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL as string;

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
          const res = await authFetch(`${BASEURL}/api/orders/create/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);

          if (res.ok) {
            setMessage("Order placed successfully!");
            fetch(`${BASEURL}/api/cart/`);
            clearCart();

            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            setMessage(
              data.error || "Failed to place order. Please try again!",
            );
          }
        } catch (error) {
          console.error(error);
          setMessage(String(error));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-5xl font-extrabold text-center mb-8">
                    Checkout
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                        required
                        className="w-full p-4 text-lg border rounded-xl"
                    />

                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Full Address"
                        required
                        className="w-full p-4 text-lg border rounded-xl"
                    />

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="w-full p-4 text-lg border rounded-xl"
                    />

                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full p-4 text-lg border rounded-xl"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="ONLINE">Online Payment</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition duration-300"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>

                    {message && (
                        <p className="text-center text-green-700 font-bold mt-4">
                            {message}
                        </p>
                    )}

                    {/* <button className="w-full bg-green-600 text-white py-2 rounded">
                        Place Order
                    </button> */}
                </form>
            </div>
        </div>
    );
}

export default CheckoutPage;