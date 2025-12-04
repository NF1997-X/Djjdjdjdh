import { EditRowDialog } from '../EditRowDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EditRowDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Edit Row Dialog</Button>
      <EditRowDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(title) => console.log('Row updated:', title)}
        initialTitle="My Collection"
      />
    </>
  );
}
