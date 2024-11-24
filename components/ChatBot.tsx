import React, { useEffect } from "react";

interface BotpressWidgetProps {
  configUrl: string; // The Botpress configuration URL
}

const ChatBot: React.FC<BotpressWidgetProps> = ({ configUrl }) => {
  useEffect(() => {
    const widgetId = "bp-widget";

    // Check if the widget script is already added
    if (!document.getElementById(widgetId)) {
      // Create the Botpress webchat script
      const script = document.createElement("script");
      script.id = widgetId;
      script.src = configUrl;
      script.async = true;

      // Append the script to the body
      document.body.appendChild(script);

      console.log("Botpress widget initialized.");
    } else {
      console.log("Botpress widget already exists.");
    }

    // Optional: Cleanup script when component unmounts
    return () => {
      const widget = document.getElementById(widgetId);
      if (widget) {
        widget.remove();
        console.log("Botpress widget removed.");
      }
    };
  }, [configUrl]); // Re-run if the configUrl changes

  return null; // This component doesn’t render anything visible
};

export default ChatBot;
