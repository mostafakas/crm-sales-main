"use client";

import { useState, useCallback } from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  status: AsyncStatus;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseAsyncStateReturn<T> extends AsyncState<T> {
  run: (promise: Promise<T>) => Promise<T | null>;
  reset: () => void;
  setData: (data: T) => void;
}

const IDLE_STATE = {
  data: null,
  error: null,
  status: "idle" as AsyncStatus,
  isIdle: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export function useAsyncState<T>(): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>(IDLE_STATE as AsyncState<T>);

  const run = useCallback(async (promise: Promise<T>): Promise<T | null> => {
    setState({
      data: null,
      error: null,
      status: "loading",
      isIdle: false,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const data = await promise;
      setState({
        data,
        error: null,
        status: "success",
        isIdle: false,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
      return data;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "An unexpected error occurred";
      setState({
        data: null,
        error: message,
        status: "error",
        isIdle: false,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState(IDLE_STATE as AsyncState<T>);
  }, []);

  const setData = useCallback((data: T) => {
    setState({
      data,
      error: null,
      status: "success",
      isIdle: false,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });
  }, []);

  return { ...state, run, reset, setData };
}
