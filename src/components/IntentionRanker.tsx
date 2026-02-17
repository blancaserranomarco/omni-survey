'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { IntentionType } from '@/lib/personas';

const INTENTIONS: { id: IntentionType; label: string; desc: string }[] = [
  { id: 'optimize', label: 'Optimizar', desc: '"Quiero optimizar"' },
  { id: 'validate', label: 'Validar', desc: '"¿Lo estoy haciendo bien?"' },
  { id: 'urgency', label: 'Urgencia', desc: '"Ayúdame ya"' },
];

function SortableChip({ id, label, desc, rank }: { id: string; label: string; desc: string; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? 'shadow-[0_0_24px_rgba(200,89,62,0.2)] border-accent/50 bg-accent-soft'
          : 'border-border bg-surface hover:border-accent/30'
      }`}
    >
      <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-[12px] font-mono font-medium flex-shrink-0">
        {rank}
      </span>
      <div>
        <span className="font-semibold text-sm text-text-primary">{label}</span>
        <span className="text-xs text-text-muted ml-2">{desc}</span>
      </div>
      <span className="ml-auto text-text-muted/40 text-sm">&#x2630;</span>
    </div>
  );
}

interface Props {
  value: IntentionType[];
  onChange: (val: IntentionType[]) => void;
  error?: string;
}

export default function IntentionRanker({ value, onChange, error }: Props) {
  const [selected, setSelected] = useState<IntentionType[]>(value.length > 0 ? value : []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleSelection = useCallback(
    (id: IntentionType) => {
      let next: IntentionType[];
      if (selected.includes(id)) {
        next = selected.filter((s) => s !== id);
      } else {
        next = [...selected, id];
      }
      setSelected(next);
      onChange(next);
    },
    [selected, onChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = selected.indexOf(active.id as IntentionType);
        const newIndex = selected.indexOf(over.id as IntentionType);
        const next = arrayMove(selected, oldIndex, newIndex);
        setSelected(next);
        onChange(next);
      }
    },
    [selected, onChange]
  );

  const unselected = INTENTIONS.filter((i) => !selected.includes(i.id));

  return (
    <div>
      <p className="text-xs text-text-muted mb-3">
        Selecciona 1 a 3 opciones. Si seleccionas varias, arrastra para ordenar por prioridad (1 = mas importante).
      </p>

      {/* Unselected options */}
      {unselected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {unselected.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => toggleSelection(i.id)}
              className="px-3 py-2.5 rounded-lg text-[13px] border border-dashed border-border-light text-text-muted hover:border-accent/40 hover:text-accent-text hover:bg-accent-soft/50 transition-all duration-200"
            >
              + {i.label} <span className="text-text-muted/60 text-xs">{i.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected + sortable */}
      {selected.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selected} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {selected.map((id, idx) => {
                const item = INTENTIONS.find((i) => i.id === id)!;
                return <SortableChip key={id} id={id} label={item.label} desc={item.desc} rank={idx + 1} />;
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Remove buttons */}
      {selected.length > 0 && (
        <div className="flex gap-3 mt-2">
          {selected.map((id) => {
            const item = INTENTIONS.find((i) => i.id === id)!;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSelection(id)}
                className="text-[11px] text-text-muted hover:text-red-400 transition-colors"
              >
                Quitar {item.label}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
