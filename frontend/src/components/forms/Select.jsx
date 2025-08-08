import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
// import Spinner from "../ui/spinner";

const Select = ({
  options,
  placeholder = "Select an option",
  onChange,
  name = "",
  className = "",
  defaultValue = "",
  showPlaceholder = true,
  error,
  isLoading,
  isDisable,
  isClearable,
  showSearch,
  placeholderInput,
  onSearchChange,
  hint
}) => {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase()?.includes(search.toLowerCase())
  ) || options;

  // Set default selected label
  useEffect(() => {
    if (defaultValue) {
      const defaultOption = options.find((opt) => opt.value === defaultValue);
      if (defaultOption) {
        setSelectedLabel(defaultOption.label);
      }
    }
  }, [defaultValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch(""); // Reset search when closing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    if(onSearchChange){
      onSearchChange(e.target.value)
    }
  }

  const handleSelect = (name, option) => {
    setSelectedLabel(option.label);
    onChange(name, option.value);
    setIsOpen(false);
    setSearch(""); // Reset search after selection
  };

  const handleClear = () => {
    setSelectedLabel("")
    onChange(name, "")
  }

  const errorClass = "  border-red-500 focus:ring-3 focus:ring-red-500/10  ";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isDisable}
        className={`${error && errorClass} ${isClearable && "pr-14"}  overflow-y-hidden disabled:cursor-not-allowed disabled:bg-gray-100 h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm shadow-theme-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-300/30 ${selectedLabel ? "text-gray-800 " : "text-gray-400 "}`}
      >
        <span className="line-clamp-1">
          {selectedLabel || (showPlaceholder ? placeholder : "")}
        </span>
        { (isClearable && defaultValue !== "")  && (
          <button onClick={handleClear} className="absolute right-10 top-1/2 -translate-y-1/2">
            <FontAwesomeIcon icon={faTimes}/>
          </button>
        )}
        <span className={`absolute right-3 ${error ? "top-6" : "top-1/2"} -translate-y-1/2 transition-all duration-200 ${isOpen && "rotate-180"}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </button>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-999 mt-1 w-full rounded-lg border border-gray-100 bg-white text-sm shadow-lg ">
          {/* Search Input */}
          { showSearch && (
            <div className="px-4 py-2">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                autoFocus
                placeholder={placeholderInput}
                className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700 ring-sky-600 focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30! "
              />
            </div>
          )}

          {/* Options */}
          <ul id={name} className="max-h-60 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(name, option)}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedLabel === option.label ? "bg-sky-50" : "hover:bg-gray-100 text-gray-700 "
                  }  `}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 ">
                Pilihan tidak ditemukan
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
