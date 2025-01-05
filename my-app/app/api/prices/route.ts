import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    try {
        const { data, error } = await supabase
            .from('price_history')
            .select('*')
            .eq('product_id', productId)
            .order('captured_at', { ascending: false})
    
        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: 'Error creating product'},
            { status: 500}
        )
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const body = await request.json()
        const {product_id, price, source} = body

        const { data, error } = await supabase
        .from('price_history')
        .insert([{
            product_id,
            price,
            source
        }])
        .select()
        .single()
    
        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {error: 'Error creating product'},
            { status: 500}
        )
    }
}