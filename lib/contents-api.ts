import { fetcher } from "./fetcher";

export const postContents = async (data: {
  title?: string;
  url: string;
  category_id: string;
  is_list: boolean;
}) => {
  const response = await fetcher<{ contents_id: string }>("/contents", {
    method: "POST",
    body: data,
  });
  return response.contents_id;
};

export interface Contents {
  id: string;
  title: string;
  thumbnail_path: string;
  video_path: string;
  description: string;
}
export const getContentsById = async (
  contentsId: string
): Promise<Contents> => {
  const response = await fetcher<Contents[]>(`/contents/${contentsId}`, {
    method: "GET",
  });
  return response[0];
};

export const updateContentsDescription = async (
  contentsId: string,
  description: string
) => {
  await fetcher(`/contents/${contentsId}/description`, {
    method: "PUT",
    body: { description },
  });
};

export interface CategoryIdByContents {
  category_id: string;
}

export const getCategoryIdByContentsId = async (contentsId: string) => {
  return await fetcher<CategoryIdByContents>(
    `/contents/${contentsId}/category_id`,
    { method: "GET" }
  );
};
