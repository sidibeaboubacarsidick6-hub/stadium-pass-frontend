export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  availability: 'available' | 'limited' | 'soldout';
  color: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamShort: string;
  awayTeamShort: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  image: string;
  categories: TicketCategory[];
  featured: boolean;
}

export const matches: Match[] = [
  {
    id: 'match-1',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Olympique de Marseille',
    homeTeamShort: 'PSG',
    awayTeamShort: 'OM',
    competition: 'Ligue 1 — Classique',
    date: '2026-10-18',
    time: '20:45',
    stadium: 'Parc des Princes',
    city: 'Paris',
    image: 'https://images.pexels.com/photos/32190714/pexels-photo-32190714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    categories: [
      { id: 'cat-1a', name: 'Virage Boulogne', price: 45, description: 'Ambiance bouillante derrière le but', availability: 'available', color: '#ff7a2b' },
      { id: 'cat-1b', name: 'Tribune Auteuil', price: 65, description: 'Vue latérale, ambiance populaire', availability: 'limited', color: '#fbbf24' },
      { id: 'cat-1c', name: 'Tribune Paris Sorbonne', price: 120, description: 'Vue centrale, confort premium', availability: 'available', color: '#0a5c3a' },
      { id: 'cat-1d', name: 'Loge VIP', price: 280, description: 'Hospitalité, restauration incluse', availability: 'limited', color: '#0d0d0d' },
    ],
  },
  {
    id: 'match-2',
    homeTeam: 'AS Monaco',
    awayTeam: 'Olympique Lyonnais',
    homeTeamShort: 'ASM',
    awayTeamShort: 'OL',
    competition: 'Ligue 1',
    date: '2026-10-21',
    time: '19:00',
    stadium: 'Stade Louis II',
    city: 'Monaco',
    image: 'https://images.pexels.com/photos/32285250/pexels-photo-32285250.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    categories: [
      { id: 'cat-2a', name: 'Virage Sud', price: 35, description: 'Ambiance et chants derrière le but', availability: 'available', color: '#ff7a2b' },
      { id: 'cat-2b', name: 'Tribune Latérale', price: 55, description: 'Vue latérale, bonne visibilité', availability: 'available', color: '#fbbf24' },
      { id: 'cat-2c', name: 'Tribune Principale', price: 95, description: 'Vue centrale, siège confortable', availability: 'available', color: '#0a5c3a' },
      { id: 'cat-2d', name: 'Prestige VIP', price: 220, description: 'Accès salon, restauration incluse', availability: 'soldout', color: '#0d0d0d' },
    ],
  },
  {
    id: 'match-3',
    homeTeam: 'FC Nantes',
    awayTeam: 'Stade Rennais',
    homeTeamShort: 'FCN',
    awayTeamShort: 'SRFC',
    competition: 'Ligue 1 — Derby Breton',
    date: '2026-10-25',
    time: '21:00',
    stadium: 'Stade de la Beaujoire',
    city: 'Nantes',
    image: 'https://images.pexels.com/photos/38454829/pexels-photo-38454829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    categories: [
      { id: 'cat-3a', name: 'Loire Tribune', price: 28, description: 'Ambiance populaire derrière le but', availability: 'available', color: '#ff7a2b' },
      { id: 'cat-3b', name: 'Tribune Océane', price: 48, description: 'Vue latérale, bonne ambiance', availability: 'limited', color: '#fbbf24' },
      { id: 'cat-3c', name: 'Tribune Présidentielle', price: 85, description: 'Vue centrale, confort optimal', availability: 'available', color: '#0a5c3a' },
      { id: 'cat-3d', name: 'Espace VIP', price: 180, description: 'Salon privé, buffet inclus', availability: 'available', color: '#0d0d0d' },
    ],
  },
  {
    id: 'match-4',
    homeTeam: 'Lille OSC',
    awayTeam: 'RC Lens',
    homeTeamShort: 'LOSC',
    awayTeamShort: 'RCL',
    competition: 'Ligue 1 — Derby du Nord',
    date: '2026-10-28',
    time: '20:45',
    stadium: 'Stade Pierre-Mauroy',
    city: 'Lille',
    image: 'https://images.pexels.com/photos/32108866/pexels-photo-32108866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    categories: [
      { id: 'cat-4a', name: 'Virage Marek', price: 32, description: 'Ambiance de feu derrière le but', availability: 'limited', color: '#ff7a2b' },
      { id: 'cat-4b', name: 'Tribune Latérale', price: 52, description: 'Vue latérale excellente', availability: 'available', color: '#fbbf24' },
      { id: 'cat-4c', name: 'Tribune Principale', price: 90, description: 'Vue centrale premium', availability: 'available', color: '#0a5c3a' },
      { id: 'cat-4d', name: 'Loge Business', price: 250, description: 'Hospitalité haut de gamme', availability: 'limited', color: '#0d0d0d' },
    ],
  },
  {
    id: 'match-5',
    homeTeam: 'Girondins de Bordeaux',
    awayTeam: 'Toulouse FC',
    homeTeamShort: 'FCGB',
    awayTeamShort: 'TFC',
    competition: 'Ligue 2',
    date: '2026-11-01',
    time: '19:30',
    stadium: 'Matmut Atlantique',
    city: 'Bordeaux',
    image: 'https://images.pexels.com/photos/32266316/pexels-photo-32266316.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    categories: [
      { id: 'cat-5a', name: 'Virage Sud', price: 20, description: 'Ambiance populaire, bons chants', availability: 'available', color: '#ff7a2b' },
      { id: 'cat-5b', name: 'Tribune Jean-Louis Triaud', price: 35, description: 'Vue latérale, ambiance familiale', availability: 'available', color: '#fbbf24' },
      { id: 'cat-5c', name: 'Tribune Présidentielle', price: 60, description: 'Vue centrale, siège confortable', availability: 'available', color: '#0a5c3a' },
      { id: 'cat-5d', name: 'VIP Bordeaux', price: 140, description: 'Salon privé, boissons incluses', availability: 'soldout', color: '#0d0d0d' },
    ],
  },
  {
    id: 'match-6',
    homeTeam: 'OGC Nice',
    awayTeam: 'AS Saint-Étienne',
    homeTeamShort: 'OGC',
    awayTeamShort: 'ASSE',
    competition: 'Ligue 1',
    date: '2026-11-04',
    time: '20:45',
    stadium: 'Allianz Riviera',
    city: 'Nice',
    image: 'https://images.pexels.com/photos/33827014/pexels-photo-33827014.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: false,
    categories: [
      { id: 'cat-6a', name: 'Virage Populaire', price: 30, description: 'Ambiance et chants derrière le but', availability: 'available', color: '#ff7a2b' },
      { id: 'cat-6b', name: 'Tribune Latérale', price: 50, description: 'Vue latérale, bonne visibilité', availability: 'available', color: '#fbbf24' },
      { id: 'cat-6c', name: 'Tribune Principale', price: 88, description: 'Vue centrale, confort premium', availability: 'limited', color: '#0a5c3a' },
      { id: 'cat-6d', name: 'Lodge VIP', price: 210, description: 'Hospitalité, restauration incluse', availability: 'available', color: '#0d0d0d' },
    ],
  },
];

export const faqItems = [
  {
    question: 'Comment recevoir mes billets après achat ?',
    answer: 'Vos billets électroniques sont envoyés par e-mail immédiatement après votre achat. Vous pouvez également les retrouver dans votre espace personnel sur Stadium Pass. Chaque billet possède un QR code unique scanné à l\'entrée du stade.',
  },
  {
    question: 'Puis-je obtenir un remboursement si je ne peux pas venir ?',
    answer: 'Les billets sont non remboursables, sauf en cas d\'annulation officielle du match. Toutefois, vous pouvez revendre votre billet sur la plateforme officielle de revente de Stadium Pass, au prix d\'origine, à partir de votre espace personnel.',
  },
  {
    question: 'Les sièges sont-ils attribués ou en placement libre ?',
    answer: 'Les billets en tribunes latérales et principales sont numérotés. Les virages populaires sont en placement libre, sauf indication contraire sur la page du match. Les loges VIP disposent de sièges attribués avec service à table.',
  },
  {
    question: 'Le stade est-il accessible aux personnes à mobilité réduite ?',
    answer: 'Oui, tous les stades partenaires disposent d\'emplacements PMR avec accompagnateur. Sélectionnez l\'option « Accessibilité PMR » lors du choix de votre catégorie, ou contactez notre service client pour une assistance dédiée.',
  },
  {
    question: 'À quelle heure ouvrir les portes du stade ?',
    answer: 'Les portes ouvrent généralement 90 minutes avant le coup d\'envoi. Nous recommandons d\'arriver tôt pour éviter les files d\'attente, surtout lors des grands matchs. Les loges VIP bénéficient d\'un accès prioritaire.',
  },
  {
    question: 'Puis-je acheter des billets pour un groupe ?',
    answer: 'Oui, pour les groupes de 10 personnes ou plus, des tarifs préférentiels sont disponibles. Contactez notre service groupes via le formulaire de contact pour recevoir un devis personnalisé sous 48h.',
  },
];
