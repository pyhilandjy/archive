import { ExpandIcon, ShrinkIcon } from "lucide-react";

interface FloatingActionButtonProps {
  isDescriptionOnRight: boolean;
  setIsDescriptionOnRight: (value: boolean) => void;
}

export function FloatingActionButton({
  isDescriptionOnRight,
  setIsDescriptionOnRight,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40">
      <button
        onClick={() => setIsDescriptionOnRight(!isDescriptionOnRight)}
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        title="레이아웃 변경"
      >
        {isDescriptionOnRight ? (
          <ShrinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        ) : (
          <ExpandIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
