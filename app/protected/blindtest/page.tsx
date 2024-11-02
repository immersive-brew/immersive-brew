import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BlindTestInstructions from "@/components/BlindTestInstructions";
import BeanRecommendation from "@/components/BeanRecommendation";

export default async function BlindTestPage({ searchParams }) {
    const { beanIds } = searchParams;

    if (!beanIds) {
        return notFound();
    }

    const selectedBeanIds = Array.isArray(beanIds) ? beanIds : [beanIds];
    const supabase = createClient();

    const { data: beans, error } = await supabase
        .from("coffeebeans")
        .select("id, name, roaster, roast_level")
        .in("id", selectedBeanIds.map(Number));

    if (error || !beans || beans.length === 0) {
        return notFound();
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Blind Test Selection</h2>
            <p className="text-center mb-4">You have selected the following coffee beans:</p>

            <div className="space-y-4">
                {beans.map((bean) => (
                    <div key={bean.id} className="p-4 border rounded-md shadow-sm">
                        <h3 className="text-xl font-bold">{bean.name}</h3>
                        <p>Roaster: {bean.roaster}</p>
                        <p>Roast Level: {bean.roast_level}</p>
                    </div>
                ))}
            </div>

            {/* Add the BlindTestInstructions component */}
            <BlindTestInstructions beanCount={beans.length} />

            {/* Add BeanRecommendation for each bean */}
            <h2 className="text-2xl font-semibold text-center mt-10">Recommendation Engine</h2>
            <div className="space-y-4">
                {beans.map((bean) => (
                    <BeanRecommendation key={bean.id} bean={bean} />
                ))}
            </div>
        </div>
    );
}
