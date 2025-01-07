import { useEffect, useState } from 'react'
import { useEbay } from '@/app/hooks/useEbay'

interface PriceRecord {
    price: number
    timestamp: string
}

interface PriceAnalysis {
    recommendedPrice: number
    margin: number
    strategy: 'market_median' | 'minimum_viable' | 'optimal_margin'
    timestamp: string
    COGS: number
}

export default function usePriceAggregation(productId: number, COGS : number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null)


    // Retrieve price history from Supabase
    const getPrices = async (): Promise<PriceRecord[]> => {
        setLoading(true)
        try {
            const response = await fetch(`/api/prices?productId=${productId}`)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching prices: ', error)
            setError(error as Error)
            throw error
        } finally {
            setLoading(false)
        }
    }
    // calculate the median
    const medianPrice = (prices: number[]): number => {
        if (!prices.length) return 0
        const sorted = [...prices].sort((a, b) => a - b)
        const middle = Math.floor(sorted.length / 2)

        if (sorted.length % 2 == 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2
        }
        return sorted[middle]
    }
    // subtract the median from COGS: if this is a negative number, try each price in the price history - COGS, whichever has the highest margin should be the price
    const calculateOptimal = (prices: number[], COGS: number) => {
        if (!prices.length) return COGS
        const median = medianPrice(prices)

        if (median > COGS) {
            return {
                recommendedPrice: median,
                margin: median - COGS,
                strategy: 'market_median' as const
            }
        }

        const minViable = prices.filter(price => price > COGS)
        if (!minViable.length) {
            return {
                recommendedPrice: COGS * 1.1, // 10% markup fallback
                margin: COGS * 0.1,
                strategy: 'minimum_viable' as const
            }
        }

        const optimalPrice = Math.min(...minViable)
        return {
            recommendedPrice: optimalPrice,
            margin: optimalPrice - COGS,
            strategy: 'optimal_margin' as const
        }

    }

    const aggregatePrices = async (): Promise<PriceAnalysis> => {
        setLoading(true);
        try {
            const price_history = await getPrices();
            const prices = price_history.map((record: PriceRecord) => record.price);
    
            const optimalPrice = calculateOptimal(prices, COGS);
    
            if (typeof optimalPrice === 'number') {
                const fallbackAnalysis: PriceAnalysis = {
                    recommendedPrice: optimalPrice,
                    margin: 0,
                    strategy: 'minimum_viable', 
                    timestamp: new Date().toISOString(),
                    COGS
                };
                setPriceAnalysis(fallbackAnalysis);
                return fallbackAnalysis;
            } else {
                const newAnalysis: PriceAnalysis = {
                    recommendedPrice: optimalPrice.recommendedPrice,
                    margin: optimalPrice.margin,
                    strategy: optimalPrice.strategy,
                    timestamp: new Date().toISOString(),
                    COGS
                };
                setPriceAnalysis(newAnalysis);
                return newAnalysis;
            }
        } catch (error) {
            setError(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        if (productId && COGS) {
            aggregatePrices()
        }
    }, [productId, COGS])

    return {
        loading,
        error,
        priceAnalysis,
        refreshAnalysis: aggregatePrices
    }

}