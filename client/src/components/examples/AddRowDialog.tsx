import { AddRowDialog } from '../AddRowDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddRowDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Add Row Dialog</Button>
      <AddRowDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(title) => console.log('Row created:', title)}
      />
    </>
  );
}
