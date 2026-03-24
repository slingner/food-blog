"use client";

import { useState, useCallback } from "react";
import { Plus, GripVertical, Trash2, ImageIcon, X } from "lucide-react";
import type { StepFormData } from "@/lib/types";
import dynamic from "next/dynamic";
import { ImagePicker } from "./ImagePicker";

const RichTextEditor = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="h-[200px] rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] animate-pulse" /> }
);

type Props = {
  steps: StepFormData[];
  onChange: (steps: StepFormData[]) => void;
};

function blankStep(stepNumber: number): StepFormData {
  return {
    stepNumber,
    instruction: "",
    imageUrl: null,
    tip: null,
  };
}

export function StepEditor({ steps, onChange }: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState<number | null>(null);

  const updateStep = useCallback(
    (index: number, field: keyof StepFormData, value: unknown) => {
      const updated = [...steps];
      updated[index] = { ...updated[index], [field]: value };
      onChange(updated);
    },
    [steps, onChange]
  );

  const addStep = () => {
    onChange([...steps, blankStep(steps.length + 1)]);
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    // Renumber
    updated.forEach((s, i) => (s.stepNumber = i + 1));
    onChange(updated);
  };

  // Drag reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...steps];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    updated.forEach((s, i) => (s.stepNumber = i + 1));
    onChange(updated);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          className={`rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] overflow-hidden transition-opacity ${
            dragIdx === idx ? "opacity-50" : ""
          }`}
        >
          {/* Step header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <div className="cursor-grab text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]">
              <GripVertical className="w-4 h-4" />
            </div>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] text-xs font-bold">
              {step.stepNumber}
            </span>
            <span className="text-sm font-medium text-[var(--admin-text)]">
              Step {step.stepNumber}
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setImagePickerOpen(idx)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {step.imageUrl ? "Change" : "Add"} Image
            </button>
            <button
              type="button"
              onClick={() => removeStep(idx)}
              className="text-[var(--admin-text-muted)] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Step image */}
          {step.imageUrl && (
            <div className="relative mx-4 mt-3">
              <img
                src={step.imageUrl}
                alt={`Step ${step.stepNumber}`}
                className="w-full max-h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => updateStep(idx, "imageUrl", null)}
                className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Instruction editor */}
          <div className="p-4">
            <RichTextEditor
              content={step.instruction}
              onChange={(html) => updateStep(idx, "instruction", html)}
              onInsertImage={() => setImagePickerOpen(idx)}
            />
          </div>

          {/* Tip */}
          <div className="px-4 pb-4">
            <input
              type="text"
              value={step.tip ?? ""}
              onChange={(e) =>
                updateStep(idx, "tip", e.target.value || null)
              }
              placeholder="Pro tip (optional)"
              className="w-full h-8 px-3 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Step
      </button>

      {/* Image picker modal */}
      {imagePickerOpen !== null && (
        <ImagePicker
          open
          onClose={() => setImagePickerOpen(null)}
          onSelect={(url) => {
            updateStep(imagePickerOpen, "imageUrl", url);
            setImagePickerOpen(null);
          }}
        />
      )}
    </div>
  );
}
