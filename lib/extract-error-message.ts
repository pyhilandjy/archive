import { FetchError } from "./fetcher";

export function extractErrorMessage(
  error: unknown,
  fallback = "알 수 없는 오류가 발생했습니다. 다시 시도해주세요."
): string {
  if (
    error instanceof FetchError &&
    typeof error.body === "object" &&
    error.body !== null
  ) {
    interface ErrorBody {
      detail: string | Array<{ msg: string }>;
    }

    const rawDetail = (error.body as ErrorBody).detail;

    if (
      Array.isArray(rawDetail) &&
      rawDetail.length > 0 &&
      typeof rawDetail[0] === "object" &&
      rawDetail[0] !== null &&
      typeof rawDetail[0].msg === "string"
    ) {
      return rawDetail[0].msg;
    }

    if (typeof rawDetail === "string") {
      return rawDetail;
    }
  }

  return fallback;
}
