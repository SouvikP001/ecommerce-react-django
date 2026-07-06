import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL as string;

    useEffect(() => {
        fetch(`${BASEURL}/api/products/`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then((data: Product[]) => {
            setProducts(data);
            setLoading(false);
        })
        .catch((error: Error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-6 bg-white shadow-md">
                Product List
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.length > 0 ? (
                    products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No products available.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductList;