// 内部で使用する型定義
export interface DatabaseError {
  code?: string;
  message: string;
}

export interface DatabaseResult<T> {
  data: T | null;
  error: DatabaseError | null;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public isRetryable = false
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isTokenError(error: any): boolean {
  return (
    error?.message?.includes("JWT expired") ||
    error?.message?.includes("invalid_token") ||
    error?.code === "invalid_token" ||
    error?.status === 401
  );
}

export function createDatabaseError(error: any): DatabaseError {
  return {
    code: error?.code,
    message: error?.message || "データベースエラーが発生しました",
  };
}

export function handleDatabaseError<T>(error: any): DatabaseResult<T> {
  const dbError = createDatabaseError(error);

  // 開発環境でのみエラーログを出力
  if (process.env.NODE_ENV === "development") {
    console.error("Database Error:", dbError);
  }

  return {
    data: null,
    error: dbError,
  };
}

export async function executeWithRetry<T>(
  queryFn: () => Promise<DatabaseResult<T>>,
  description: string,
  maxRetries = 1
): Promise<DatabaseResult<T>> {
  let lastError: DatabaseError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();

      if (!result.error || !isTokenError(result.error)) {
        return result;
      }

      lastError = result.error;

      if (attempt < maxRetries && isTokenError(result.error)) {
        // トークンリフレッシュを試行
        const { refreshToken } = await import("../supabase/browser-client");
        const refreshSuccess = await refreshToken();

        if (!refreshSuccess) {
          break;
        }
      }
    } catch (error) {
      lastError = createDatabaseError(error);
      break;
    }
  }

  return {
    data: null,
    error: lastError || createDatabaseError(new Error("不明なエラー")),
  };
}
