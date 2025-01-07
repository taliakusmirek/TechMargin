import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const supabase = await createClient();
        const { productId, price } = req.body;

        const { data, error } = await supabase
            .from('products')
            .update({ price })
            .match({ id: productId });

        if (error) {
            throw error;
        }
    
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error updating price:', error)
        res.status(500).json({ message: 'Failed to update price' })
    }
}