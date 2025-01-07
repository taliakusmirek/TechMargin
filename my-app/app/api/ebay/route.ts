import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

const EBAY_DEV_ID = process.env.EBAY_DEV_ID // add once dev account is approved

async function getEBAY(keyword: string) {
    const url = `https://svcs.ebay.com/services/search/FindingService/v1?` +
    `OPERATION-NAME=findItemsByKeywords` +
    `&SERVICE-VERSION=1.0.0` +
    `&SECURITY-APPNAME=${EBAY_DEV_ID}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&REST-PAYLOAD` +
    `&keywords=${encodeURIComponent(keyword)}` +
    `&paginationInput.entriesPerPage=5` +
    `&sortOrder=PricePlusShippingLowest`

    try {
        const response = await fetch(url)
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: 'Error fetching from eBAY API'},
            { status: 500}
        )
    }
}


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const productName = searchParams.get('product_name')

    if (!productName) {
        return NextResponse.json(
            {error: 'Error creating product'},
            { status: 500}
        )
    }
    try {
        const ebayData = await getEBAY(productName)
        
        // store in price_history DB of supabase
        const supabase = await createClient()

        // select lowest price found in eBay results
        const items = ebayData?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item;
        const firstItem = items[0];
        const price = firstItem?.sellingStatus?.[0]?.currentPrice?.[0]?.__value__;


        // post to supabase with lowest price from eBAY API call that was found
        const { data, error } = await supabase
        .from('price_history')
        .insert([{
            product_id: searchParams.get('product_id'),
            price: parseFloat(price),
            price_source: 'ebay',
        }])
    
        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: 'Error fetching eBay product price data'},
            { status: 500}
        )
    }
}
