import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false})
    
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
        const {name, category, sub_category, current_unit_price, cogs, created_at, current_stock} = body

        const { data, error } = await supabase
        .from('products')
        .insert([{
            name,
            category,
            sub_category,
            current_unit_price,
            cogs,
            created_at,
            current_stock
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