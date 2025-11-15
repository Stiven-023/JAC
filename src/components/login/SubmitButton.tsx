import React from 'react'
import { useFormStatus } from 'react-dom';

export function SubmitButton({ label, loadingLabel, bgColor }: { label: string, loadingLabel: string, bgColor: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full text-white rounded-sm px-2 py-2 mt-4 transition-all disabled:opacity-50 ${bgColor} **cursor-pointer**`}
    >
      {pending ? loadingLabel : label}
    </button>
  );
}


