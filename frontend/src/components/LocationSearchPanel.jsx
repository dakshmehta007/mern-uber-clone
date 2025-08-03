import React from "react";

const LocationSearchPanel = ({ suggestions, handleSuggestionClick }) => {
  return (
    <div>
      {suggestions.map((suggestion, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(suggestion)}
          className="flex gap-4 border-2 p-3 border-gray-100 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className="bg-whiteshade h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{suggestion.description}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
