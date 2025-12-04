import { PageTabs } from '../PageTabs';
import { useState } from 'react';

export default function PageTabsExample() {
  const [activePage, setActivePage] = useState('1');
  
  const mockPages = [
    { id: '1', name: 'Page 1' },
    { id: '2', name: 'Page 2' },
    { id: '3', name: 'Page 3' },
  ];

  return (
    <PageTabs
      pages={mockPages}
      activePage={activePage}
      onPageChange={(id) => setActivePage(id)}
      onAddPage={() => console.log('Add page')}
      onDeletePage={(id) => console.log('Delete page:', id)}
    />
  );
}
