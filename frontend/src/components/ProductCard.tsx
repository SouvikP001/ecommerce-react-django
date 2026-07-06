import {Link} from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL as string;
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
        <img
          src= {product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 truncate">{product.name}</h2>
        <p className="text-2xl font-bold text-black-600">₹{product.price}</p>
    </div>  
    </Link>  
    )
  
}

export default ProductCard;