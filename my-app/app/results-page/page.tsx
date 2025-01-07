import usePriceAggregation from '@/app/hooks/priceAgg';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { useState, useEffect } from 'react';

interface Product {
    id: number,
    name: string;
    category: string;
    sub_category: string;
    current_unit_price: number;
    cogs: number;
    current_stock: number;
    predicted_price?: number;
    created_at: Date;
}

export default function ResultsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products'); 
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getPredictedPrice = (product: Product) => {
        const { priceAnalysis, loading: priceLoading } = usePriceAggregation(product.id, product.cogs);
        return priceAnalysis || product.predicted_price || null;
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8 text-center">Predicted Product Prices</h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const predictedPrice = getPredictedPrice(product);
                        
                        return (
                            <div key={product.id} className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600">Category: {product.category}</p>
                                <p className="text-gray-600">Sub-Category: {product.sub_category}</p>
                                <p>Your Unit Price: ${product.current_unit_price.toFixed(2)}</p>
                                <p>Cost to Produce (COGS): ${product.cogs.toFixed(2)}</p>
                                <p>Current Stock: {product.current_stock}</p>
                                <p className="font-semibold text-blue-600">
                                    Predicted Price: 
                                    {predictedPrice ? `$${predictedPrice}` : 'Not available'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center">No products found.</p>
            )}
        </div>
    );
}