import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useConverterStore } from '../hooks/useConverterStore';

interface URLEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  urlIndex: number | null;
}

export function URLEditDialog({ open, onOpenChange, urlIndex }: URLEditDialogProps) {
  const { urls, updateCustomName } = useConverterStore();
  const [customName, setCustomName] = useState('');
  
  const urlItem = urlIndex !== null ? urls[urlIndex] : null;

  useEffect(() => {
    if (open && urlItem) {
      setCustomName(urlItem.customName || urlItem.title || '');
    }
  }, [open, urlItem]);

  const handleSave = () => {
    if (urlIndex !== null) {
      updateCustomName(urlIndex, customName);
      onOpenChange(false);
    }
  };

  if (!urlItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit URL</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={urlItem.url}
              readOnly
              className="bg-gray-100 dark:bg-gray-800"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customName">Custom Name</Label>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter a custom name for this URL"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 