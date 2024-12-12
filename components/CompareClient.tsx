"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CompareClient() {
  const [entries, setEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]); // Array of selected entry IDs
  const [entryData, setEntryData] = useState({}); // Store entry data in an object
  const [user, setCurrentUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false); // Track if user is fetched

  const supabase = createClient();

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setCurrentUser(data?.user);
        console.log("Fetched user:", data?.user);
      }
      setIsUserFetched(true); // Indicate that user fetching is complete
    };

    fetchUser();
  }, [supabase]);

  // Fetch entries for the current user
  useEffect(() => {
    let isMounted = true;

    const fetchEntries = async () => {
      if (!user || !isUserFetched) return;

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("userid", user?.id) // Filter by user ID
        .order("created_at", { ascending: false }); // Order by date descending

      if (error) {
        console.error("Error fetching entries:", error);
      } else if (isMounted) {
        setEntries(data);
      }
    };

    fetchEntries();

    return () => {
      isMounted = false;
    };
  }, [supabase, user, isUserFetched]);

  // Fetch data for selected entries
  useEffect(() => {
    const fetchEntryData = async () => {
      const newEntryData = {};

      for (const entryId of selectedEntries) {
        if (!entryData[entryId]) {
          const { data, error } = await supabase
            .from("entries")
            .select("*")
            .eq("id", entryId)
            .single();

          if (error) {
            console.error(error);
            continue;
          }

          if (data.recipeid) {
            // Fetch recipe data
            const { data: recipeData, error: recipeError } = await supabase
              .from("recipes")
              .select("*")
              .eq("id", data.recipeid)
              .single();

            if (recipeError) {
              console.error(recipeError);
            } else {
              data.recipe = recipeData;
            }
          }

          newEntryData[entryId] = data;
        }
      }

      setEntryData((prevData) => ({ ...prevData, ...newEntryData }));
    };

    if (selectedEntries.length > 0) {
      fetchEntryData();
    }
  }, [selectedEntries, entryData, supabase]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const fieldsToCompare = useMemo(
    () => [
      {
        key: "temperature",
        label: "Temperature (°C)",
        description: "The brewing temperature.",
        isNumeric: true,
      },
      {
        key: "coffee_weight",
        label: "Coffee Weight (g)",
        description: "The amount of coffee used.",
        isNumeric: true,
      },
      {
        key: "water_weight",
        label: "Water Weight (g)",
        description: "The amount of water used.",
        isNumeric: true,
      },
      {
        key: "grind_setting",
        label: "Grind Setting",
        description: "The grind setting used.",
        isNumeric: false,
      },
      {
        key: "overall_time",
        label: "Overall Time",
        description: "The total brewing time in mm:ss format.",
        isNumeric: true, // Stored in seconds
      },
      {
        key: "taste_notes",
        label: "Taste Notes",
        description: "User-described taste notes.",
        isNumeric: false,
      },
      {
        key: "rating",
        label: "Rating",
        description: "User rating out of 5.",
        isNumeric: true,
      },
    ],
    []
  );

  const handleCheckboxChange = useCallback(
    (entryId) => {
      setSelectedEntries((prevSelectedEntries) => {
        if (prevSelectedEntries.includes(entryId)) {
          return prevSelectedEntries.filter((id) => id !== entryId);
        } else if (prevSelectedEntries.length < 2) {
          return [...prevSelectedEntries, entryId];
        } else {
          return prevSelectedEntries;
        }
      });
    },
    []
  );

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  const calculateDifference = useCallback(
    (field, value1, value2) => {
      if (field.isNumeric) {
        let diff = value2 - value1;
        if (diff > 0) {
          return <span style={{ color: "green" }}>+{diff}</span>;
        } else if (diff < 0) {
          return <span style={{ color: "red" }}>{diff}</span>;
        } else {
          return <span style={{ color: "gray" }}>0</span>;
        }
      } else {
        return value1 !== value2 ? (
          <span style={{ color: "red" }}>Different</span>
        ) : (
          <span style={{ color: "green" }}>Same</span>
        );
      }
    },
    []
  );

  const generateExplanation = useCallback(
    (data1, data2) => {
      let explanations = [];

      fieldsToCompare.forEach((field) => {
        const value1 = data1[field.key];
        const value2 = data2[field.key];

        if (field.isNumeric && value1 !== value2) {
          let difference = value2 - value1;
          let explanation = "";

          switch (field.key) {
            case "temperature":
              explanation = `The temperature differs by ${
                difference > 0 ? "+" : ""
              }${difference}°C, which can affect the extraction rate of the coffee.`;
              break;
            case "coffee_weight":
              explanation = `The coffee weight differs by ${
                difference > 0 ? "+" : ""
              }${difference}g, affecting the strength of the brew.`;
              break;
            case "water_weight":
              explanation = `The water weight differs by ${
                difference > 0 ? "+" : ""
              }${difference}g, impacting the coffee's dilution and extraction.`;
              break;
            case "overall_time":
              explanation = `The overall brewing time differs by ${
                difference > 0 ? "+" : ""
              }${difference} seconds, influencing the extraction level.`;
              break;
            case "rating":
              explanation = `The rating differs by ${
                difference > 0 ? "+" : ""
              }${difference}, indicating a different user satisfaction level.`;
              break;
            default:
              break;
          }

          if (explanation) {
            explanations.push(explanation);
          }
        } else if (!field.isNumeric && value1 !== value2) {
          let explanation = "";

          switch (field.key) {
            case "grind_setting":
              explanation = `Different grind settings (${value1} vs ${value2}) can lead to variations in extraction and flavor profiles.`;
              break;
            case "taste_notes":
              explanation = `Taste notes are different, indicating a different flavor experience.`;
              break;
            default:
              break;
          }

          if (explanation) {
            explanations.push(explanation);
          }
        }
      });

      return explanations;
    },
    [fieldsToCompare]
  );

  const explanations =
    selectedEntries.length === 2 &&
    entryData[selectedEntries[0]] &&
    entryData[selectedEntries[1]]
      ? generateExplanation(
          entryData[selectedEntries[0]],
          entryData[selectedEntries[1]]
        )
      : [];

  return (
    <div style={{ padding: "40px", backgroundColor: "#f5f5f5", minHeight: "100vh", textAlign: "center" }}>
      <h1 style={{ marginBottom: "40px" }}>Compare Entries</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        {/* Selection Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "300px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Select Entries (Up to 2)</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {entries.map((entry) => (
              <div key={entry.id} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedEntries.includes(entry.id)}
                  onChange={() => handleCheckboxChange(entry.id)}
                  disabled={!selectedEntries.includes(entry.id) && selectedEntries.length >= 2}
                  style={{ width: "16px", height: "16px" }}
                />
                <label style={{ marginLeft: "8px", cursor: "pointer" }}>
                  {formatDateTime(entry.created_at)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Card */}
        {selectedEntries.length === 2 &&
          entryData[selectedEntries[0]] &&
          entryData[selectedEntries[1]] && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                width: "600px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Comparison</h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "2px solid #ccc",
                        textAlign: "left",
                        padding: "10px",
                        width: "30%",
                      }}
                    >
                      Field
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid #ccc",
                        textAlign: "left",
                        padding: "10px",
                        width: "25%",
                      }}
                    >
                      Entry 1
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid #ccc",
                        textAlign: "center",
                        padding: "10px",
                        width: "10%",
                      }}
                    >
                      Difference
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid #ccc",
                        textAlign: "left",
                        padding: "10px",
                        width: "25%",
                      }}
                    >
                      Entry 2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsToCompare.map((field) => {
                    const value1 = entryData[selectedEntries[0]][field.key];
                    const value2 = entryData[selectedEntries[1]][field.key];

                    return (
                      <tr key={field.key}>
                        <td>{field.label}</td>
                        <td>{value1 ?? "N/A"}</td>
                        <td>{calculateDifference(field, value1, value2)}</td>
                        <td>{value2 ?? "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Analysis Section */}
      {explanations.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            margin: "40px auto 0",
            textAlign: "left",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Analysis
          </h2>
          <ul>
            {explanations.map((explanation, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {explanation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
