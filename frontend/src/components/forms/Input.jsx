const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  endIcon,
  onKeyDown
}) => {

  let inputClasses = ` h-11 w-full bg-white rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3   ${className}`;

  if (error && disabled) {
    inputClasses += ` text-gray-500 border-red-500 opacity-40 bg-gray-100 cursor-not-allowed  opacity-40`;
  } else if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed  opacity-40`;
  } else if (error) {
    inputClasses += `border-red-500 border-red-500 focus:border-red-300 focus:ring-red-500/20`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 `;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-sky-300 focus:ring-sky-500/20 `;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`${inputClasses} ${endIcon ? "pr-10" : ""}`}
      />
      {endIcon && (<span className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-300">{endIcon}</span>)}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
