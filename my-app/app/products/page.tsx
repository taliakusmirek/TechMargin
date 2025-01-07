'use client'

import { useEffect, useState } from 'react'
import { useProducts } from '@/app/hooks/useProducts'
import { timeStamp } from 'console'
import { useNavigate } from 'react-router-dom';

interface Product {
    name: string;
    category: string;
    sub_category: string;
    current_unit_price: number;
    cogs: number;
    current_stock: number;
    predicted_price?: number;
    created_at: Date;
}

export default function ProductsPage() {
    const {loading, getProducts, addProduct} = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getProducts()
            setProducts(data)
        }
        loadProducts()
    }, [getProducts])

    const handleAddProduct = async (formData:FormData) => {
        const product = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            sub_category: formData.get("sub_category") as string,
            current_unit_price: Number(formData.get("current_unit_price")),
            cogs: Number(formData.get("cogs")),
            current_stock: Number(formData.get("current_stock")),
            created_at: new Date(),
        }
        await addProduct(product);

        // Refresh product list after added
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        navigate('/results-page');
    }

    return (
        <div className="p-8">
            <form action={handleAddProduct} className="space-y-4 mb-8 h-max">
                <h2 className="text-xl font-bold mb-12 flex items-center justify-center">Predict a Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
                    <div>
                        <label htmlFor="name" className='mr-4 p-8'>Product Name</label>
                        <input type="text" id="name" name="name" required></input>
                    </div>

                    <div>
                        <label htmlFor="category" className='mr-4 p-8'>Tech Category</label>
                        <input type="text" id="category" name="category" required></input>
                    </div>

                    <div>
                        <label htmlFor="sub_category" className='mr-4 p-8'>Sub Category</label>
                        <input type="text" id="sub_category" name="sub_category" required></input>
                    </div>

                    <div>
                        <label htmlFor="current_unit_price" className='mr-4 p-8'>Your Unit Price</label>
                        <input type="number" id="current_unit_price" name="current_unit_price" required min="0" step="0.01"></input>
                    </div>

                    <div>
                        <label htmlFor="cogs" className='mr-4 p-8'>Cost to Produce</label>
                        <input type="number" id="cogs" name="cogs" required min="0" step="0.01"></input>
                    </div>

                    <div>
                        <label htmlFor="current_stock" className='mr-4 p-8'>Current Stock</label>
                        <input type="number" id="current_stock" name="current_stock" required min="0" step="0.01"></input>
                    </div>
                </div>

                <div className='flex items-center justify-center'>
                    <button type="submit"           className="bg-[#0900E9] text-white font-medium text-sm py-3 px-6 rounded hover:bg-[#0700b8] transition duration-200">Submit</button>
                </div>
            </form>

            <div>
                <h4 className="text-m font-bold mt-24 mb-12 flex items-center justify-center">Recent Product Predictions</h4>
                {loading ? (
                    <p className='flex items-center justify-center'>Loading...</p>
                ) : (
                    <div className="grid gap-4 items-center justify-center">
                        {products.map((product, index) => (
                            <div key={index}>
                                <h3 className="font-bold">{product.name}</h3>
                                <p>Category: {product.category}</p>
                                <p>Your Price: ${product.current_unit_price}</p>
                                <p>Predicted Price: ${product.predicted_price || 'Not available'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}