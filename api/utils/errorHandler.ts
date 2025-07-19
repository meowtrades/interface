import { AxiosError } from "axios";

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Extract error message from axios error
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error || "An unknown error occurred");
};

export const getErrorStatus = (error: unknown): number => {
  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }

  return 500;
};

export const parseApiError = (error: unknown): ApiError => {
  return {
    status: getErrorStatus(error),
    message: getErrorMessage(error),
    errors:
      error instanceof AxiosError ? error.response?.data?.errors : undefined,
  };
};
