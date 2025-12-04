import { AddPageDialog } from '../AddPageDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddPageDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Add Page Dialog</Button>
      <AddPageDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(name) => console.log('Page created:', name)}
      />
    </>
  );
}
