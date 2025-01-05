'use client'

import { useEffect, useState } from 'react'
import { useProducts } from '@/app/hooks/useProducts'

export default function ProductsPage() {
    const { loading, getProducts, addProduct } = useProducts()
    const [products, setProducts] = useState([])

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getProducts()
            setProducts(data)
        }
        loadProducts()
    }, [])

    const handleAddProduct = async( e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div>

        </div>
    )
}