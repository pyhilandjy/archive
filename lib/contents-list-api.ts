import { fetcher } from "./fetcher";

export interface ContentsList {
  id: string;
  title: string;
  thumbnail_path: string;
}

export const getUsersContentsList = async (): Promise<ContentsList[]> => {
  return fetcher<ContentsList[]>("/contents-list", {
    method: "GET",
  });
};

export const getUsersCategoryContentsList = async (
  categoryId: string
): Promise<ContentsList[]> => {
  return fetcher<ContentsList[]>(`/contents-list/category/${categoryId}`, {
    method: "GET",
  });
};
