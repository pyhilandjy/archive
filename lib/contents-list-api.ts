import { fetcher } from "./fetcher";

export interface ContentsList {
  id: string;
  title: string;
  thumbnail_path: string;
}

export const getUsersContentsList = async (): Promise<ContentsList[]> => {
  return await fetcher<ContentsList[]>("/contents-list", {
    method: "GET",
  });
};

export const getUsersCategoryContentsList = async (
  categoryId: string
): Promise<ContentsList[]> => {
  return await fetcher<ContentsList[]>(
    `/contents-list/category/${categoryId}`,
    {
      method: "GET",
    }
  );
};

export const deleteContent = async (contentId: string): Promise<void> => {
  await await fetcher(`/contents/${contentId}`, {
    method: "DELETE",
  });
};
