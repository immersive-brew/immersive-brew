// pages/api/entries.js

import { createClient } from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();

  if (req.method === 'POST') {
    const { temperature, coffee_weight, water_weight, grind_setting, overall_time, recipe_id } = req.body;

    // Validate required fields
    if (
      temperature === undefined ||
      coffee_weight === undefined ||
      water_weight === undefined ||
      grind_setting === undefined ||
      overall_time === undefined ||
      recipe_id === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Insert new entry
    const { data, error } = await supabase
      .from('entries')
      .insert([{ temperature, coffee_weight, water_weight, grind_setting, overall_time, recipe_id }]);

    if (error) {
      console.error('Error inserting entry:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { temperature, coffee_weight, water_weight, grind_setting, overall_time, recipe_id } = req.body;

    // Validate required fields
    if (
      temperature === undefined ||
      coffee_weight === undefined ||
      water_weight === undefined ||
      grind_setting === undefined ||
      overall_time === undefined ||
      recipe_id === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Update existing entry
    const { data, error } = await supabase
      .from('entries')
      .update({ temperature, coffee_weight, water_weight, grind_setting, overall_time, recipe_id })
      .eq('id', id);

    if (error) {
      console.error('Error updating entry:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
