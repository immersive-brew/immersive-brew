// app/blind-test/page.tsx

import { createClient } from "@/utils/supabase/server";
import BlindTestClient from "@/components/BlindTestClient";
import { CoffeeBean } from "@/types"; // Define this type in a separate file for better type management

export default async function BlindTestPage() {
    const supabase = createClient();

    const { data: beans, error } = await supabase
        .from("coffeebeans")
        .select("id, name, roaster, roast_level");

    if (error || !beans) {
        // Handle error appropriately, you might want to render an error component
        return <div>Error fetching coffee beans.</div>;
    }

    return <BlindTestClient beans={beans as CoffeeBean[]} />;
}
