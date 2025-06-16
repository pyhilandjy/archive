import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface EditorHeaderProps {
  isDescriptionOnRight: boolean;
  setIsDescriptionOnRight: (value: boolean) => void;
}

export function EditorHeader({
  isDescriptionOnRight,
  setIsDescriptionOnRight,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📝</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">노트 편집</h3>
        </div>
      </div>
      <button
        onClick={() => setIsDescriptionOnRight(!isDescriptionOnRight)}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
        title={isDescriptionOnRight ? "하단으로 이동" : "사이드로 이동"}
      >
        {isDescriptionOnRight ? (
          <ChevronLeftIcon className="w-4 h-4" />
        ) : (
          <ChevronRightIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
