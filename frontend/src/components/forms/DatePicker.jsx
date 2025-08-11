import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  error = false,
  dateFormat,
  disabled,
  className,
  hint,
  success = false,
  isClearable = false,
  onClear
}) {
  const inputRef = useRef(null);
  const flatpickrInstance = useRef(null);
  useEffect(() => {
    if (!inputRef.current) return;

    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      time_24hr: true,
      dateFormat: dateFormat || "Y-m-d",
      defaultDate,
      onChange,

      autoFillDefaultTime: false,
      // minDate: 'today',
      disableMobile: true,
      position: 'above right',
    });

    flatpickrInstance.current = flatPickr

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, dateFormat]);

  const errorClass = " text-red-800 border-red-500 focus:ring-3 focus:ring-red-500/10"

  const handleClear = () => {
    if(flatpickrInstance.current && !Array.isArray(flatpickrInstance.current)){
      flatpickrInstance.current.clear()
    }
    if(onClear){
      onClear()
    }
  }

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          ref={inputRef}
          disabled={disabled}
          className={`${error ? errorClass : "text-gray-800 pr-10 bg-white border-gray-300 focus:border-sky-300 focus:ring-sky-300/30"} ${className} disabled:cursor-not-allowed! disabled:bg-gray-100 h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  bg-transparent `}
        /> 

        {
          isClearable && (
            Array.isArray(defaultDate)
              ? defaultDate[0] !== "" || defaultDate[1] !== ""
              : defaultDate !== "" && defaultDate !== null && defaultDate !== undefined
          ) && (
            <button onClick={handleClear} className="absolute text-gray-500 -translate-y-1/2 top-1/2 right-10 cursor-pointer">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )
        }

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 ">
          <FontAwesomeIcon icon={faCalendar} className="size-6" />
        </span>
      </div>
       {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500"
              : success
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
