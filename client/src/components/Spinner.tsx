import { FaSpinner } from "react-icons/fa";

interface SpinnerProps {
  size?: string;
  label?: string;
  color?: string;
  className?: string;
}

export default function Spinner({
  size = "text-4xl",
  label = "Loading...",
  color = "text-indigo-500",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-4 py-10 ${className}`}
    >
      <FaSpinner className={`animate-spin ${size} ${color}`} />
      {label && <p className="text-sm font-medium text-gray-500">{label}</p>}
    </div>
  );
}
