import { useState } from 'react'

export function useEbay() {
    const [loading, setLoading] = useState(false)
    
    const getEbay = async (productName: string) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/ebay-prices?productName=${encodeURIComponent(productName)}`)
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
        getEbay,
    }
}