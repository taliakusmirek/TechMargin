import { useState } from 'react'

export function useProducts() {
    const [loading, setLoading] = useState(false)

    const getProducts = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error: ', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const addProduct = async (productData: any) => {
        setLoading(true)
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error: ', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        getProducts,
        addProduct,
    }
}