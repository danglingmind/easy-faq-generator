"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FAQContent, FAQItem } from "@/lib/types";
import { IconPlus, IconTrash, IconChevronDown, IconGripVertical } from "@tabler/icons-react";

interface ContentPanelProps {
  content: FAQContent;
  onChange: (content: FAQContent) => void;
  isPaid: boolean;
}

const MAX_FREE_ITEMS = 4;

interface SortableItemProps {
  item: FAQItem;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onItemChange: (updates: Partial<FAQItem>) => void;
  onRemove: () => void;
}

function SortableItem({
  item,
  index,
  isCollapsed,
  onToggleCollapse,
  onItemChange,
  onRemove,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 ${isDragging ? "ring-2 ring-primary" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
            aria-label="Drag to reorder"
          >
            <IconGripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-muted-foreground">
            Item {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            <IconChevronDown
              className={`h-3 w-3 transition-transform ${
                isCollapsed ? "-rotate-90" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
            aria-label="Remove item"
          >
            <IconTrash className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="space-y-2">
          <Input
            placeholder="Question"
            value={item.question}
            onChange={(e) =>
              onItemChange({ question: e.target.value })
            }
            className="text-sm"
          />
          <Textarea
            placeholder="Answer"
            value={item.answer}
            onChange={(e) =>
              onItemChange({ answer: e.target.value })
            }
            className="text-sm"
            rows={2}
          />
        </div>
      )}
    </Card>
  );
}

export function ContentPanel({ content, onChange, isPaid }: ContentPanelProps) {
  const maxItems = isPaid ? 100 : MAX_FREE_ITEMS;
  const canAddMore = content.items.length < maxItems;
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHeadingChange = (heading: string) => {
    onChange({ ...content, heading });
  };

  const handleDescriptionChange = (description: string) => {
    onChange({ ...content, description });
  };

  const handleItemChange = (id: string, updates: Partial<FAQItem>) => {
    onChange({
      ...content,
      items: content.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const handleAddItem = () => {
    if (!canAddMore) return;
    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    onChange({ ...content, items: [...content.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    onChange({
      ...content,
      items: content.items.filter((item) => item.id !== id),
    });
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.items.findIndex((item) => item.id === active.id);
      const newIndex = content.items.findIndex((item) => item.id === over.id);

      onChange({
        ...content,
        items: arrayMove(content.items, oldIndex, newIndex),
      });
    }
  };

  const toggleCollapse = (id: string) => {
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-[300px] overflow-y-auto border-r bg-muted/30 p-4">
      <div className="space-y-6">
        <div>
          <Label htmlFor="heading">Section Heading</Label>
          <Input
            id="heading"
            value={content.heading}
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Section Description</Label>
          <Textarea
            id="description"
            value={content.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>FAQ Items</Label>
            <span className="text-xs text-muted-foreground">
              {content.items.length}/{maxItems}
            </span>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {content.items.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    isCollapsed={collapsedItems.has(item.id)}
                    onToggleCollapse={() => toggleCollapse(item.id)}
                    onItemChange={(updates) =>
                      handleItemChange(item.id, updates)
                    }
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            disabled={!canAddMore}
            className="mt-3 w-full"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add FAQ Item
            {!canAddMore && !isPaid && " (Upgrade for more)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
