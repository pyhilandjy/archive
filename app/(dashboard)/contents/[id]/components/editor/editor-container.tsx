import { MarkdownEditor } from "./markdown-editor";
import { EditorHeader } from "./editor-header";

interface EditorContainerProps {
  description: string;
  setDescription: (value: string) => void;
  isDescriptionOnRight: boolean;
  setIsDescriptionOnRight: (value: boolean) => void;
}

export function EditorContainer({
  description,
  setDescription,
  isDescriptionOnRight,
  setIsDescriptionOnRight,
}: EditorContainerProps) {
  return (
    <div
      className={`
        ${
          isDescriptionOnRight
            ? "w-[40%] min-w-[300px] border-l border-slate-200"
            : "w-full border-t border-slate-200"
        }
        bg-white flex flex-col shadow-lg
      `}
      style={{
        height: isDescriptionOnRight ? "60vh" : "auto", // 하단 모드에서 auto로 설정
        overflowY: isDescriptionOnRight ? "auto" : "visible",
      }}
    >
      <EditorHeader
        isDescriptionOnRight={isDescriptionOnRight}
        setIsDescriptionOnRight={setIsDescriptionOnRight}
      />
      <div className="flex-1">
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="여기에 노트를 작성하세요."
          className="h-full border-0 rounded-none"
          minHeight="100%"
          maxHeight={isDescriptionOnRight ? "100%" : "none"} // 하단 모드에서 높이 제한 해제
        />
      </div>
    </div>
  );
}
