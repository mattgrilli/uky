interface QuizOptionProps {
  label: string;
  selected: boolean;
  correct: boolean | null;
  onClick: () => void;
  disabled: boolean;
}

export default function QuizOption({
  label,
  selected,
  correct,
  onClick,
  disabled,
}: QuizOptionProps) {
  let classes =
    "w-full px-4 py-4 rounded-xl border-2 text-lg font-medium transition-all active:scale-95 select-none ";

  if (correct === null) {
    classes += selected
      ? "border-ua-blue bg-ua-blue-light text-ua-blue-dark"
      : "border-gray-200 bg-white text-gray-700 hover:border-ua-blue hover:bg-ua-blue-light";
  } else if (correct) {
    classes += "border-green-500 bg-green-50 text-green-700 animate-pop";
  } else if (selected) {
    classes += "border-red-500 bg-red-50 text-red-700 animate-shake";
  } else {
    classes += "border-gray-200 bg-white text-gray-400";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes + (disabled ? " cursor-default" : " cursor-pointer")}
    >
      {label}
    </button>
  );
}
