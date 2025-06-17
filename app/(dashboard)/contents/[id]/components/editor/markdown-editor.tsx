"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

export interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isEditable?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "여기에 노트를 작성하세요...",
  isEditable = true,
  className = "",
  minHeight = "200px",
  maxHeight = "500px",
  onFocus,
  onBlur,
  disabled = false,
}: TiptapEditorProps) {
  const isInitialMount = useRef(true);
  const previousValue = useRef(value);

  const handleChange = useCallback(
    (newValue: string) => {
      if (newValue !== previousValue.current) {
        previousValue.current = newValue;
        onChange(newValue);
      }
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: { class: "tiptap-heading" },
      }),
      BulletList.configure({
        HTMLAttributes: { class: "tiptap-bullet-list" },
        keepMarks: true,
        keepAttributes: true,
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "tiptap-ordered-list" },
      }),
      ListItem.configure({
        HTMLAttributes: { class: "tiptap-list-item" },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        considerAnyAsEmpty: true,
      }),
    ],
    editable: isEditable && !disabled,
    content: value,
    immediatelyRender: false, // SSR 문제 해결
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        tabIndex: "0",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousValue.current = value;
      return;
    }
    const currentContent = editor.getHTML();
    if (value !== currentContent && value !== previousValue.current) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(value || "", false);
      try {
        if (
          from <= editor.state.doc.content.size &&
          to <= editor.state.doc.content.size
        ) {
          editor.commands.setTextSelection({ from, to });
        }
      } catch (error) {
        console.warn("Failed to restore cursor position:", error);
      }
      previousValue.current = value;
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable && !disabled);
    }
  }, [isEditable, disabled, editor]);

  useEffect(() => {
    if (editor) {
      editor.extensionManager.extensions.forEach((extension) => {
        if (extension.name === "placeholder") {
          extension.options.placeholder = placeholder;
        }
      });
    }
  }, [placeholder, editor]);

  useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  const handleContainerClick = useCallback(() => {
    if (editor && !editor.isFocused) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={`rounded-md border bg-gray-50 flex items-center justify-center text-gray-500 ${className}`}
        style={{ minHeight, maxHeight }}
      >
        에디터를 로딩 중...
      </div>
    );
  }

  return (
    <div
      onClick={handleContainerClick}
      className={`
        rounded-md border bg-white overflow-hidden
        ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
        ${
          editor.isFocused
            ? "ring-2 ring-blue-400 border-blue-400"
            : "border-gray-300"
        }
        transition-all duration-200 ease-in-out
        ${className}
      `}
      style={{ minHeight, maxHeight }}
    >
      <div className="h-full overflow-y-auto">
        <EditorContent
          editor={editor}
          className={`outline-none px-4 py-3 h-full ${
            disabled ? "pointer-events-none text-gray-500" : "text-gray-900"
          }`}
          style={{ minHeight: "calc(100% - 24px)" }}
        />
      </div>
    </div>
  );
}
