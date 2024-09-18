"use client";

import { useState } from "react";
import { SaveButton } from "@/components/save-button";

export default function ProfileForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [showForm, setShowForm] = useState(false); // Toggle to show/hide form
  const id = profile?.id;

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <button onClick={handleShowForm}>
        {showForm ? "Cancel" : "Change Name"}
      </button>

      {showForm && (
        <div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <SaveButton id={id} fullName={fullName} className="btn-primary">
            Save
          </SaveButton>
        </div>
      )}
    </div>
  );
}
