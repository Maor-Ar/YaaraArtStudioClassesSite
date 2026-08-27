export interface Artwork {
  title: string;
  description: string;
  imageUrl: string;
}

const FEATURED_ARTWORKS: Artwork[] = [
  {
    title: 'פסטל שמן על בריסטול',
    description: '42X30 ס״מ',
    imageUrl: 'https://i.imgur.com/tEtzdsd.jpeg'
  },
  {
    title: 'גיר לבן על בריסטול שחור',
    description: '30X40 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/dd4df961-c2ba-4b6f-adca-6af5f78812f0'
  },
  {
    title: 'עפרונות צבעוניים על בריסטול',
    description: '30X42 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/e2f56a0a-016d-4224-8ffb-60e29bb48371'
  },
  {
    title: 'שמן על בד',
    description: '30X40 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/c6d6ebb2-75c9-4654-909b-d6132ceebb9d'
  },
  {
    title: 'פסטל שמן על בריסטול',
    description: '20X30 ס״מ',
    imageUrl: 'https://i.imgur.com/sw7DEHh.jpeg'
  },
  {
    title: 'שמן על בד',
    description: '30X40 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/6d64e201-45eb-40a2-a4ab-5ff37d395d31'
  },
  {
    title: 'אקריליק על קנבס',
    description: '13X18 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/26cbda52-de95-4a3d-8e26-23b4c3e0cdba'
  },
  {
    title: 'רישום דיגיטלי',
    description: '',
    imageUrl: 'https://i.imgur.com/pGJQA3e.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'אקריליק על קנבס',
    description: '25 ס״מ קוטר',
    imageUrl: 'https://github.com/user-attachments/assets/57f9dda9-64bf-4bd8-a6cc-40f8c563a1e8'
  },
  {
    title: 'אקריליק על בד',
    description: '50X40 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/3dee6ac2-8d32-4ecc-8f14-734b994ceabf'
  },
  {
    title: 'ציור דיגיטלי',
    description: '',
    imageUrl: 'https://i.imgur.com/MtoacMq.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'אקריליק על קנבס',
    description: '80X60 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/4f961b14-6c8b-4060-bfae-d44da6451851'
  },
  {
    title: 'אקריליק על קנבס',
    description: '80X50 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/16cbc997-8727-40b6-8015-c1c111b2f76c'
  },
  {
    title: 'אקריליק על קנבס',
    description: '25X25 ס״מ',
    imageUrl: 'https://github.com/user-attachments/assets/8b571af9-0491-4d66-a0c1-26902fa3f691'
  }
];

const NEW_IMAGE_FILES = [
  'WhatsApp Image 2026-06-23 at 15.11.04.jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.05 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.05 (2).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.05.jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.06 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.06 (2).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.06.jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.07 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.07 (2).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.07 (3).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.07.jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.08 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.08 (2).jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.08.jpeg',
  'WhatsApp Image 2026-06-23 at 15.11.09.jpeg'
];

export function getArtworks(): Artwork[] {
  const extras: Artwork[] = NEW_IMAGE_FILES.map((filename) => ({
    title: '',
    description: '',
    imageUrl: encodeURI(`assets/new_images/compressed/${filename}`)
  }));
  return [...FEATURED_ARTWORKS, ...extras];
}
