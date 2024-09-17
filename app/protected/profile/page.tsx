"use client";

import { SaveButton } from "@/components/save-button";
import { createClient } from "@/utils/supabase/client"; // Updated import for client-side
import { useEffect, useState } from 'react';
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

export default function Page() {
    const supabase = createClient();
    const [data, setData] = useState<any | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [full_name, setFull_name] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select()
                    .eq('id', user.id);

                if (data) {
                    setData(data[0]);
                    setId(data[0].id);
                    setFull_name(data[0].full_name);
                }
            }
        };
        getData();
    }, [supabase]);

    return (
        <div>
            
            {/* Render your input field for fullName here */}
            <input
                type="text"
                value={full_name || ''}
                onChange={(e) => setFull_name(e.target.value)}
            />
            <SaveButton  
                fullName={full_name}
                id = {id} 
                className="btn-primary"
            >
                Save
            </SaveButton>
        </div>
        
    );
}
