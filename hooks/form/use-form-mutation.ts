"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import type { ApiResponse } from "@/lib/api/api-client";
import { setFormErrors, getDirtyValues, withRetry } from "@/lib/form/form-builder";

interface UseFormMutationOptions<TFieldValues extends FieldValues, TResponse> {
  form: UseFormReturn<TFieldValues>;
  mutationFn: (data: any) => Promise<ApiResponse<TResponse>>;
  onSuccess?: (data: TResponse | null) => void;
  onError?: (error: string, fieldErrors?: Record<string, string | string[]>) => void;
  persistKey?: string;
  useDiff?: boolean;
  retries?: number;
}

export function useFormMutation<TFieldValues extends FieldValues, TResponse>({
  form,
  mutationFn,
  onSuccess,
  onError,
  persistKey,
  useDiff = false,
  retries = 0,
}: UseFormMutationOptions<TFieldValues, TResponse>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Persistence ────────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!persistKey) return;

    const saved = localStorage.getItem(persistKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to restore form state", e);
      }
    }

    const subscription = form.watch((value) => {
      localStorage.setItem(persistKey, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form, persistKey]);

  const clearPersisted = useCallback(() => {
    if (persistKey) {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  // ─── Mutation ───────────────────────────────────────────────────────────────

  const mutate = useCallback(
    async (data: TFieldValues) => {
      setIsLoading(true);
      setError(null);

      const payload = useDiff 
        ? getDirtyValues(data, form.control._defaultValues as any) 
        : data;

      try {
        const result = await withRetry(
          () => mutationFn(payload),
          retries
        );

        if (result.error) {
          setError(result.error);
          
          if (result.fieldErrors) {
            setFormErrors(form, result.fieldErrors);
          }
          
          onError?.(result.error, result.fieldErrors);
          return { success: false, error: result.error };
        }

        if (persistKey) clearPersisted();
        onSuccess?.(result.data);
        return { success: true, data: result.data };
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "An unexpected error occurred";
        setError(message);
        onError?.(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, form, useDiff, retries, persistKey, clearPersisted]
  );

  const handleSubmit = form.handleSubmit(mutate);

  return {
    mutate,
    handleSubmit,
    isLoading,
    error,
    resetError: () => setError(null),
    clearPersisted,
  };
}
