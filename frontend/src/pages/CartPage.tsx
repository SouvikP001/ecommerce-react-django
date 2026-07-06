import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems,total, removeFromCart, updateQuantity } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  console.log("Cart Items:", cartItems);

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <h1 className="text-5xl font-extrabold mb-8 mt-6 text-center">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-3xl font-semibold text-gray-600 mt-10">
          Your cart is empty.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{item.product_name}</h2>
                <p className="text-lg text-gray-600">₹{item.product_price}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>

                <span className="text-xl font-bold">{item.quantity}</span>

                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>

                <button
                  className="text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-green-600">Total:</h2>
            <p className="text-xl font-semibold">₹{total.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
