import { useCallback, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { URLList } from './URLList';
import { useConverterStore } from '../hooks/useConverterStore';
import { URLEditDialog } from './URLEditDialog';

interface DraggableItem {
  id: string;
  index: number;
}

interface URLItem {
  id: string;
  url: string;
  title?: string;
}

export function DraggableURLList() {
  const { urls, setUrls } = useConverterStore();
  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = urls[dragIndex];
    const newUrls = [...urls];
    newUrls.splice(dragIndex, 1);
    newUrls.splice(hoverIndex, 0, dragItem);
    setUrls(newUrls);
  }, [urls, setUrls]);

  const handleOpenEditDialog = (index: number) => {
    setEditingUrlIndex(index);
  };

  return (
    <>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <DraggableURLItem
            key={url.id}
            id={url.id}
            index={index}
            moveItem={moveItem}
            url={url}
            onEdit={() => handleOpenEditDialog(index)}
          />
        ))}
      </div>
      <URLEditDialog 
        open={editingUrlIndex !== null}
        onOpenChange={(open) => !open && setEditingUrlIndex(null)}
        urlIndex={editingUrlIndex}
      />
    </>
  );
}

interface DraggableURLItemProps {
  id: string;
  index: number;
  url: URLItem;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
}

function DraggableURLItem({ id, index, url, moveItem, onEdit }: DraggableURLItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'URL_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, index]);

  const [, drop] = useDrop(() => ({
    accept: 'URL_ITEM',
    hover(item: any) {
      if (!item) return;
      const dragIndex = item.index;
      if (dragIndex === index) return;
      moveItem(dragIndex, index);
      item.index = index;
    },
  }), [index, moveItem]);

  // Using a reference object for combined refs
  const dragDropRef = (node: HTMLDivElement | null) => {
    if (node) {
      drag(node);
      drop(node);
    }
  };

  return (
    <div
      ref={dragDropRef}
      className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={(e) => {
        // Prevent triggering edit when trying to drag
        if (!isDragging) {
          onEdit();
        }
      }}
    >
      <div className="flex items-center gap-2 p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium">{url.title || url.url}</div>
          {url.url && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {url.url}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 