import { SaveIcon, ExpandIcon, ShrinkIcon } from "lucide-react";

interface HeaderProps {
  title: string;
  id: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  isDescriptionOnRight: boolean;
  setIsDescriptionOnRight: (value: boolean) => void;
}

export function Header({
  title,
  isSaving,
  lastSaved,
  isDescriptionOnRight,
  setIsDescriptionOnRight,
}: HeaderProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금 저장됨";
    if (minutes < 60) return `${minutes}분 전 저장됨`;
    return (
      date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) +
      " 저장됨"
    );
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-bold text-slate-800 truncate max-w-md">
              {title || "제목 없음"} {/* 빈 경우 기본값 */}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600">저장 중...</span>
              </>
            ) : lastSaved ? (
              <>
                <SaveIcon className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  {formatLastSaved(lastSaved)}
                </span>
              </>
            ) : null}
          </div>
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
        </div>
      </div>
    </div>
  );
}
