import { useEffect, useState } from 'react'
import { useEbay } from '@/app/hooks/useEbay'

export default function EbayPricesPage() {
    const { loading, getEbay } = useEbay()
    const [prices, setPrices] = useState<string[]>([])

    const fetchEbayPrices = async (productName: string) => {
        try {
            const data = await getEbay(productName)
            setPrices(data)
        } catch (err) {
            console.error('Error tracking price:', err)
        }
    }
}