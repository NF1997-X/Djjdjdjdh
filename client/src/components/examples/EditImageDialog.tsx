import { EditImageDialog } from '../EditImageDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EditImageDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Edit Image Dialog</Button>
      <EditImageDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => console.log('Image updated:', data)}
        initialData={{
          url: 'https://picsum.photos/id/112/300/300',
          title: 'Sample Image',
          subtitle: 'Sample subtitle',
        }}
      />
    </>
  );
}
