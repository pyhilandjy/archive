import { ExpandIcon, ShrinkIcon } from "lucide-react";

interface LayoutToggleProps {
  isDescriptionOnRight: boolean;
  setIsDescriptionOnRight: (value: boolean) => void;
}

export function LayoutToggle({
  isDescriptionOnRight,
  setIsDescriptionOnRight,
}: LayoutToggleProps) {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setIsDescriptionOnRight(false)}
        className={`p-2 rounded-md transition-all duration-200 ${
          !isDescriptionOnRight
            ? "bg-white shadow-sm text-blue-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
        title="하단 레이아웃"
      >
        <ShrinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setIsDescriptionOnRight(true)}
        className={`p-2 rounded-md transition-all duration-200 ${
          isDescriptionOnRight
            ? "bg-white shadow-sm text-blue-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
        title="사이드 레이아웃"
      >
        <ExpandIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
