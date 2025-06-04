import { fetcher } from "./fetcher";

export const postCategory = async (title: string) => {
  return fetcher<{ success: boolean }>("/category", {
    method: "POST",
    body: { title },
  });
};

export interface SubCategory {
  id: string; // URL에 사용될 ID
  title: string; // 기존 필드 유지
}

export interface MainCategory {
  id: string; // 기존 필드 유지
  title: string; // 기존 필드 유지
  sub_categories: SubCategory[]; // 필드 이름 수정: subCategories -> sub_categories
}

export const getCategories = async (): Promise<MainCategory[]> => {
  return fetcher<MainCategory[]>("/categories", {
    method: "GET",
  });
};

export async function postMainCategory(title: string): Promise<MainCategory> {
  const result = await fetcher<MainCategory[]>("/main-category", {
    method: "POST",
    body: { title },
  });
  return result[0];
}

export const postSubCategory = async (parents_id: string, title: string) => {
  return fetcher<{ success: boolean }>("/sub-category", {
    method: "POST",
    body: { parents_id, title },
  });
};

export const deleteCategory = async (id: string) => {
  return fetcher<{ success: boolean }>(`/category/${id}`, {
    method: "DELETE",
  });
};

export const updateCategory = async (id: string, title: string) => {
  return fetcher<{ success: boolean }>(`/category/${id}`, {
    method: "PUT",
    body: { title },
  });
};
