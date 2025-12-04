import { AddImageDialog } from '../AddImageDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddImageDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Add Image Dialog</Button>
      <AddImageDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => console.log('Image submitted:', data)}
      />
    </>
  );
}
