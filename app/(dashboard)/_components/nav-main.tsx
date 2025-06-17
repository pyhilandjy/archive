"use client";

import { MoreHorizontal, Pencil, Trash2, Plus, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAccordionPersistedState } from "@/hooks/use-accordion-persisted-state";
import { useRouter } from "next/navigation";

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
  updateCategory,
  deleteCategory,
  postSubCategory,
} from "@/lib/category-api";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getCategoryIdByContentsId } from "@/lib/contents-api";

export function NavMain() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const mainInputRef = useRef<HTMLInputElement | null>(null);
  const subInputRef = useRef<HTMLInputElement | null>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  const [openIds, setOpenIds] = useAccordionPersistedState();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!editingId || !shouldFocus) return;

    const timer = setTimeout(() => {
      const isMain = categories.some((cat) => cat.id === editingId);
      if (isMain && mainInputRef.current) {
        mainInputRef.current.focus();
        mainInputRef.current.select();
      } else if (!isMain && subInputRef.current) {
        subInputRef.current.focus();
        subInputRef.current.select();
      }
      setShouldFocus(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [editingId, shouldFocus, categories]);

  function handleAccordionToggle(mainCategoryId: string) {
    setOpenIds((prev) =>
      prev.includes(mainCategoryId)
        ? prev.filter((id) => id !== mainCategoryId)
        : [...prev, mainCategoryId]
    );
  }

  const handleAddCategory = async () => {
    const fallbackTitle = "새 카테고리";
    await postMainCategory(fallbackTitle);
    const updatedCategories = await getCategories();
    setCategories(updatedCategories);
    const newCategory = updatedCategories.find(
      (cat) => cat.title === fallbackTitle
    );
    if (newCategory) {
      setEditingId(newCategory.id);
      setEditValue(newCategory.title);
    }
  };

  const handleAddSubCategory = async (mainCategoryId: string) => {
    const fallbackTitle = "새 서브카테고리";
    await postSubCategory(mainCategoryId, fallbackTitle);
    const updatedCategories = await getCategories();
    setCategories(updatedCategories);

    setOpenIds((prev) =>
      prev.includes(mainCategoryId) ? prev : [...prev, mainCategoryId]
    );

    const parentCategory = updatedCategories.find(
      (cat) => cat.id === mainCategoryId
    );
    const newSubCategory = parentCategory?.sub_categories?.find(
      (sub) => sub.title === fallbackTitle
    );
    if (newSubCategory) {
      setEditingId(newSubCategory.id);
      setEditValue(newSubCategory.title);
    }
  };

  const handleRename = async (id: string) => {
    if (editValue.trim()) {
      await updateCategory(id, editValue.trim());

      const updatedCategories = await getCategories();
      setCategories(updatedCategories);

      const parentCategory = updatedCategories.find((cat) =>
        cat.sub_categories?.some((sub) => sub.id === id)
      );
      if (parentCategory) {
        setOpenIds((prev) =>
          prev.includes(parentCategory.id) ? prev : [...prev, parentCategory.id]
        );
      }
    }
    setEditingId(null);
  };

  const handleDeleteCategory = async (id: string) => {
    console.log("handleDeleteCategory called");

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }

    const currentPath = window.location.pathname;
    if (currentPath.includes(id)) {
      router.push("/main");
    }
  };

  const handleDeleteSubCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 차단

    try {
      const currentPath = window.location.pathname;
      if (currentPath.includes("contents")) {
        const contentId = currentPath.split("/contents/")[1];

        // BE에 GET 요청으로 category_id와 연결 여부 확인
        const response = await getCategoryIdByContentsId(contentId);
        if (response.category_id === id) {
          await deleteCategory(id);
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);

          router.push("/main");
        } else {
          await deleteCategory(id);
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);
        }
      } else if (currentPath.includes("category")) {
        const categoryId = currentPath.split("/category/")[1];
        if (categoryId === id) {
          await deleteCategory(id);
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);
          router.push("/main");
        } else {
          await deleteCategory(id);
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ESC로 rename 취소
  const handleKeyDown = (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleRename(id);
    }
    if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className="flex h-8 items-center justify-between px-2"
        onClick={() => router.push("/main")}
      >
        <span className="text-sm font-semibold text-muted-foreground">
          전체페이지
        </span>
        <div className="flex items-center">
          <SidebarMenuAction
            onClick={(e) => {
              e.stopPropagation();
              handleAddCategory();
            }}
            className="relative top-0"
          >
            <Plus className="h-4 w-4" />
          </SidebarMenuAction>
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {categories.map((cat) => (
          <Collapsible
            key={cat.id}
            asChild
            className="group/collapsible"
            open={openIds.includes(cat.id)}
            onOpenChange={() => handleAccordionToggle(cat.id)}
          >
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
                        onCloseAutoFocus={(e) => e.preventDefault()}
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
                    ref={mainInputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(cat.id, e)}
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
                    <SidebarMenuSubItem
                      key={sub.id}
                      onClick={() => router.push(`/category/${sub.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <SidebarMenuSubButton>
                          <span>{sub.title}</span>
                        </SidebarMenuSubButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal className="h-4 w-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingId(sub.id);
                                setEditValue(sub.title);
                              }}
                            >
                              <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
                              이름 바꾸기
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) =>
                                handleDeleteSubCategory(sub.id, e)
                              }
                            >
                              <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {editingId === sub.id && (
                        <div className="mt-1 ml-2 flex items-center gap-2">
                          <Input
                            ref={subInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(sub.id, e)}
                            className="h-7 text-sm"
                          />
                          <button
                            onClick={() => handleRename(sub.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      )}
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
