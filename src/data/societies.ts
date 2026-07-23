import { Society, SocietyEvent } from '@/types/society';

export const societies: Society[] = [
  {
    id: 'csesoc',
    name: 'CSESoc — Computer Science & Engineering Society',
    shortName: 'CSESoc',
    category: 'Academic',
    description:
      'The student society for computing at UNSW, with technical workshops, social events, and industry programs.',
    memberCount: 3420,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'film',
    name: 'UNSW Film Society',
    shortName: 'Film Society',
    category: 'Arts',
    description:
      'A welcoming community for cinema lovers, filmmakers, and anyone who enjoys a good screening.',
    memberCount: 850,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'motorsport',
    name: 'UNSW Motorsport Society',
    shortName: 'Motorsport',
    category: 'Sports',
    description:
      'Social drives, watch parties, technical talks, and a community for motorsport enthusiasts.',
    memberCount: 400,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'wandering',
    name: 'UNSW Wandering Society',
    shortName: 'Wandering Society',
    category: 'Social',
    description:
      'Weekend walks, day trips, and low-pressure adventures around Sydney and New South Wales.',
    memberCount: 620,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80',
  },
];

export const societyEvents: SocietyEvent[] = [
  {
    id: 'react-native-workshop',
    societyId: 'csesoc',
    title: 'Intro to React Native & Expo',
    summary: 'Build a small universal application with mentors from CSESoc projects.',
    date: 'Thursday, 30 July',
    time: '6:00 pm–8:00 pm',
    location: 'Ainsworth G02',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'winter-hackathon',
    societyId: 'csesoc',
    title: 'Annual Winter Hackathon',
    summary: 'A weekend of building, workshops, mentoring, and project demonstrations.',
    date: '7–9 August',
    time: 'Starts Friday at 5:00 pm',
    location: 'UNSW Roundhouse',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'campus-screening',
    societyId: 'film',
    title: 'Thursday Campus Screening',
    summary: 'A free screening selected by members, followed by an informal discussion.',
    date: 'Thursday, 28 July',
    time: '6:00 pm–9:00 pm',
    location: 'Webster Theatre A',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'race-night',
    societyId: 'motorsport',
    title: 'Race Night Watch Party',
    summary: 'Watch the race with other students, with food and a pre-race quiz.',
    date: 'Sunday, 2 August',
    time: '7:00 pm–10:00 pm',
    location: 'Roundhouse Club Bar',
    image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80',
  },
];
