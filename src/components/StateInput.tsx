import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// All Indian States List
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const StateInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.length > 0) {
      const filtered = INDIAN_STATES.filter((s) =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowList(true);
    } else {
      setShowList(false);
    }
  };

  const handleSelect = (state: string) => {
    onChange(state);
    setShowList(false);
  };

  return (
    <div className="relative">
      <Input
        id="state"
        value={value}
        onChange={handleChange}
        placeholder="Enter or select state"
        className="bg-muted/40"
        required
        autoComplete="off"
      />
      {showList && suggestions.length > 0 && (
        <ul className="absolute z-20 bg-white border border-gray-200 rounded-md mt-1 max-h-40 overflow-auto w-full shadow-md">
          {suggestions.map((state) => (
            <li
              key={state}
              onClick={() => handleSelect(state)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StateInput;
