import { HorizontalScrollRow } from '../HorizontalScrollRow';

export default function HorizontalScrollRowExample() {
  const mockImages = [
    { id: '1', url: 'https://picsum.photos/id/112/300/300', title: 'Amazing title 1', subtitle: 'some subtitle' },
    { id: '2', url: 'https://picsum.photos/id/122/300/300', title: 'Amazing title 2', subtitle: 'some subtitle' },
    { id: '3', url: 'https://picsum.photos/id/132/300/300', title: 'Amazing title 3', subtitle: 'some subtitle' },
    { id: '4', url: 'https://picsum.photos/id/142/300/300', title: 'Amazing title 4', subtitle: 'some subtitle' },
    { id: '5', url: 'https://picsum.photos/id/152/300/300', title: 'Amazing title 5', subtitle: 'some subtitle' },
  ];

  return (
    <HorizontalScrollRow
      title="Example Row"
      images={mockImages}
      onImageClick={(image) => console.log('Image clicked:', image)}
      onEditRow={() => console.log('Edit row')}
      onDeleteRow={() => console.log('Delete row')}
      onAddImage={() => console.log('Add image')}
      onEditImage={(id) => console.log('Edit image:', id)}
      onDeleteImage={(id) => console.log('Delete image:', id)}
    />
  );
}
