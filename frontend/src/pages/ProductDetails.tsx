import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  const handleAddToCart = () => {
    if(!localStorage.getItem('access_token')){
      window.location.href = '/login';
      return;
    }
    addToCart(product.id);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto rounded-lg object-cover"
          />

          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-lg leading-8 text-gray-600 mb-6">{product.description}</p>

            <p className="text-4xl font-bold text-green-600 mb-8">
              ₹{product.price}
            </p>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Add to Cart 🛒
            </button>

            <div className="mt-4">
              <Link to="/" className="text-lg font-medium text-blue-600 hover:underline">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
