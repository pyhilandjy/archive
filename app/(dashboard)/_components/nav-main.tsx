"use client";

import { MoreHorizontal, Pencil, Trash2, Plus, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MainCategory,
  getCategories,
  postMainCategory,
  updateMainCategory,
  deleteMainCategory,
  postSubCategory,
} from "@/lib/category-api";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NavMain() {
  const { isMobile } = useSidebar();
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleAddCategory = async () => {
    const fallbackTitle = "새 카테고리";
    const raw = await postMainCategory(fallbackTitle);
    const newCat = Array.isArray(raw) ? raw[0] : raw;

    const completeCat: MainCategory = {
      ...newCat,
      title: newCat.title ?? fallbackTitle,
      sub_categories: newCat.sub_categories ?? [],
    };

    setCategories((prev) => [...prev, completeCat]);
    setEditingId(completeCat.id);
    setEditValue(completeCat.title);
  };

  const handleAddSubCategory = async (mainCategoryId: string) => {
    const fallbackTitle = "새 서브카테고리";
    const response = await postSubCategory(mainCategoryId, fallbackTitle);
    if (response.success) {
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } else {
      alert("Failed to create sub-category.");
    }
  };

  const handleRename = async (id: string) => {
    if (editValue.trim()) {
      await updateMainCategory(id, editValue.trim());
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, title: editValue.trim() } : cat
        )
      );
    }
    setEditingId(null);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteMainCategory(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex h-8 items-center justify-between px-2">
        <span className="text-sm font-semibold text-muted-foreground">
          카테고리
        </span>
        <div className="flex items-center">
          <SidebarMenuAction
            onClick={handleAddCategory}
            className="relative top-0"
          >
            <Plus className="h-4 w-4" />
          </SidebarMenuAction>
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {categories.map((cat) => (
          <Collapsible key={cat.id} asChild className="group/collapsible">
            <SidebarMenuItem className="flex flex-col gap-1">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between">
                  <SidebarMenuButton>
                    <span>{cat.title}</span>
                  </SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <SidebarMenuAction
                      onClick={() => handleAddSubCategory(cat.id)}
                      showOnHover
                      className=""
                    >
                      <Plus className="h-4 w-4" />
                    </SidebarMenuAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover className="mr-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditValue(cat.title);
                          }}
                        >
                          <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
                          이름 바꾸기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CollapsibleTrigger>

              {editingId === cat.id && (
                <div className="mt-1 ml-2 flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(cat.id);
                    }}
                    onBlur={() => handleRename(cat.id)}
                    className="h-7 text-sm"
                  />
                  <button
                    onClick={() => handleRename(cat.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              )}

              <CollapsibleContent>
                <SidebarMenuSub>
                  {(cat.sub_categories ?? []).map((sub) => (
                    <SidebarMenuSubItem key={sub.id}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/categories/${sub.id}`}>
                          <span>{sub.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
