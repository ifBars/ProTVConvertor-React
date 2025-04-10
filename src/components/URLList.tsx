import { DraggableURLList } from './DraggableURLList';
import { useConverterStore } from '../hooks/useConverterStore';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

export function URLList() {
  const { urls, clearUrls } = useConverterStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">URL List</h2>
        {urls.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearUrls}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No URLs added yet. Add some URLs using the forms above.
        </div>
      ) : (
        <DraggableURLList />
      )}
    </div>
  );
} 