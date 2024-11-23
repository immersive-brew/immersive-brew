"use client";

import { useState } from "react";
import { type ComponentProps } from "react";
import { createClient } from "@/utils/supabase/client";

type Props = ComponentProps<"button"> & {
  id: string | null;
  fullName: string | null;
};

export function SaveButton({ id, fullName, ...props }: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (id && fullName) {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date(),  })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Error updating profile");
      } else {
        alert("Profile has been updated");
      }
      setLoading(false);
    }
  };

  return (
    <button {...props} onClick={handleSave} disabled={loading}>
      {loading ? "Saving..." : props.children}
    </button>
  );
}
