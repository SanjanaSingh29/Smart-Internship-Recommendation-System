export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-white">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-lg border border-slate-300 bg-white px-4 py-3
        text-black
        placeholder:text-gray-500
        caret-black
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        ${className}`}
      />
    </div>
  );
}