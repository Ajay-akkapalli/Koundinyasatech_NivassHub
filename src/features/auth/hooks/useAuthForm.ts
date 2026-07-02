import { useState, useCallback } from 'react';
import { isFormValid } from '../validation';

type Validator<T> = (data: T) => Partial<Record<keyof T, string>>;

interface UseAuthFormOptions<T> {
  initialValues: T;
  validate: Validator<T>;
  onSubmit: (values: T) => Promise<boolean>;
}

interface UseAuthFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  submitting: boolean;
  handleChange: (field: keyof T, value: string) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: () => Promise<void>;
  setFieldError: (field: keyof T, message: string) => void;
  clearErrors: () => void;
}

/**
 * Generic form hook for all auth screens.
 * Owns field state, per-field blur validation, and submission lifecycle.
 * Each screen passes its own initial values, validator, and submit handler.
 */
export function useAuthForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormOptions<T>): UseAuthFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field error as user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleBlur = useCallback(
    (field: keyof T) => {
      const fieldErrors = validate(values);
      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      }
    },
    [values, validate],
  );

  const handleSubmit = useCallback(async () => {
    const fieldErrors = validate(values);
    if (!isFormValid(fieldErrors as Record<string, string | undefined>)) {
      setErrors(fieldErrors as Partial<Record<keyof T, string>>);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    clearErrors,
  };
}
