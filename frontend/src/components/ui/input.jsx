function Input({
  label,
  type,
  placeholder,
  value,
  onChange,
  showPassword,
  togglePassword,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-white">{label}</label>

      <div className="relative">
        <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-blue-600 bg-blue-700 px-4 py-3 pr-12 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />

        {togglePassword && (
          <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;