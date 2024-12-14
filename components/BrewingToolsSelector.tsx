'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface BrewingToolsSelectorProps {
  formInputName?: string; // Name of the hidden input to pass data in forms
}

interface ToolsData {
  brewer: {
    selected: string[];
    custom: { name: string; image: string | null } | null;
  };
  grinder: {
    models: string[];
    max_clicks: number | null;
    custom: { name: string; image: string | null } | null;
  };
  kettle: {
    selected: string[];
    custom: { name: string; image: string | null } | null;
  };
}

const BrewingToolsSelector: React.FC<BrewingToolsSelectorProps> = ({
  formInputName = "brewTools", // Default hidden input name
}) => {
  const [tools, setTools] = useState<ToolsData | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error fetching user:", userError?.message);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("tools")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching tools:", profileError.message);
        } else if (profile?.tools) {
          const parsedTools = profile.tools as ToolsData;
          setTools(parsedTools);
          console.log("Fetched tools:", parsedTools);
        }
      } catch (error) {
        console.error("Unexpected error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleCheckboxChange = (tool: string) => {
    setSelectedTools((prevSelected) =>
      prevSelected.includes(tool)
        ? prevSelected.filter((item) => item !== tool)
        : [...prevSelected, tool]
    );
  };

  if (loading) {
    return <div>Loading brewing tools...</div>;
  }

  if (!tools) {
    return <div>No brewing tools available.</div>;
  }

  return (
    <div className="flex flex-col w-80">
      <span className="font-semibold mb-2">Select your Brew Tools:</span>

      {/* Brewers */}
      <div className="mb-4">
        <strong>Brewers:</strong>
        {tools.brewer.selected.map((brewer) => (
          <label key={brewer} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(brewer)}
              onChange={() => handleCheckboxChange(brewer)}
            />
            <span>{brewer}</span>
          </label>
        ))}
        {tools.brewer.custom && (
          <label className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(tools.brewer.custom.name)}
              onChange={() => handleCheckboxChange(tools.brewer.custom.name)}
            />
            <span>{tools.brewer.custom.name}</span>
          </label>
        )}
      </div>

      {/* Grinders */}
      <div className="mb-4">
        <strong>Grinders:</strong>
        {tools.grinder.models.map((grinder) => (
          <label key={grinder} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(grinder)}
              onChange={() => handleCheckboxChange(grinder)}
            />
            <span>{grinder}</span>
          </label>
        ))}
        {tools.grinder.custom && (
          <label className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(tools.grinder.custom.name)}
              onChange={() => handleCheckboxChange(tools.grinder.custom.name)}
            />
            <span>{tools.grinder.custom.name}</span>
          </label>
        )}
        {tools.grinder.max_clicks !== null && (
          <div className="mt-2 text-sm text-gray-600">
            <strong>Max Grinder Clicks:</strong> {tools.grinder.max_clicks}
          </div>
        )}
      </div>

      {/* Kettles */}
      <div className="mb-4">
        <strong>Kettles:</strong>
        {tools.kettle.selected.map((kettle) => (
          <label key={kettle} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(kettle)}
              onChange={() => handleCheckboxChange(kettle)}
            />
            <span>{kettle}</span>
          </label>
        ))}
        {tools.kettle.custom && (
          <label className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTools.includes(tools.kettle.custom.name)}
              onChange={() => handleCheckboxChange(tools.kettle.custom.name)}
            />
            <span>{tools.kettle.custom.name}</span>
          </label>
        )}
      </div>

      {/* Hidden input to pass selected tools */}
      <input
        type="hidden"
        name={formInputName}
        value={JSON.stringify(selectedTools)}
      />
    </div>
  );
};

export default BrewingToolsSelector;
