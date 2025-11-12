import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/products/search?q=${encodeURIComponent(value)}`
        );
        setSuggestions(data.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [value]);

  const handleSelect = (item) => {
    setValue(item.title);
    setSuggestions([]);
    navigate(`/products/search?query=${encodeURIComponent(item.title)}`);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            navigate(`/products/search?query=${encodeURIComponent(value)}`);
            setSuggestions([]);
          }
        }}
      />

      {loading && (
        <div className="absolute right-3 top-2.5 animate-spin border-2 border-gray-400 border-t-transparent rounded-full w-5 h-5"></div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
