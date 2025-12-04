import { DeleteConfirmDialog } from '../DeleteConfirmDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DeleteConfirmDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="destructive">
        Open Delete Dialog
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          console.log('Deleted');
          setOpen(false);
        }}
        title="Delete Image?"
        description="This action cannot be undone. This will permanently delete the image from the gallery."
      />
    </>
  );
}
