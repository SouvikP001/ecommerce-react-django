import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearTokens, getAccessToken } from "../utils/auth";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce(
    (total: number, item) => total + item.quantity,
    0,
  );

  const isLoggedIn = !!getAccessToken();

  const handleLogout = (): void => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 md:px-8 py-4 md:py-6 flex flex-wrap justify-between items-center fixed w-full top-0 z-50">

    {/* Logo */}
    <Link
        to="/"
        className="text-2xl md:text-3xl font-extrabold tracking-wide text-blue-700"
    >
        🛍️ QuickBasket
    </Link>

    {/* Right Side */}
    <div className="flex flex-wrap items-center justify-end gap-3 md:gap-8">

        {!isLoggedIn ? (
            <>
                <Link
                    to="/login"
                    className="text-base md:text-2xl font-semibold text-gray-800 hover:text-blue-600 transition"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="text-base md:text-2xl font-semibold text-gray-800 hover:text-blue-600 transition"
                >
                    Sign Up
                </Link>
            </>
        ) : (
            <button
                onClick={handleLogout}
                className="text-base md:text-2xl font-semibold text-gray-800 hover:text-blue-600 transition"
            >
                Logout
            </button>
        )}

        <Link
            to="/cart"
            className="relative text-lg md:text-3xl font-semibold text-gray-800 hover:text-blue-600 transition"
        >
            🛒 Cart

            {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 md:-right-4 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full px-1.5 md:px-2 py-0.5">
                    {cartCount}
                </span>
            )}
        </Link>

    </div>

</nav>
  );
}

export default Navbar;
