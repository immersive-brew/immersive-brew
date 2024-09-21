// pages/api/deleteThread.ts
import { createClient } from '@/utils/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing thread ID' });
        }

        const supabase = createClient();
        const { error } = await supabase
            .from('threads')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: 'Thread deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
