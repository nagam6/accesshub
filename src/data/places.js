import libraryImage from '../assets/library.jpg'
import museumImage from '../assets/museum.jpg'
import communityImage from '../assets/community-center.jpg'

const places = [
  {
    id: 1,
    name: 'Central Library',
    category: 'Library',
    city: 'Haifa',
    address: 'Downtown Haifa',
    rating: 4.7,
    reviews: 42,
    verified: true,
    updatedAt: '2026-08-10',

    images: [
      libraryImage,
      libraryImage,
      libraryImage,
    ],

    accessibilityMatch: 90,

    accessibility: {
      mobility: [
        { name: 'Step-free entrance', status: 'available' },
        { name: 'Wheelchair ramp', status: 'available' },
        { name: 'Elevator', status: 'available' },
        { name: 'Accessible restroom', status: 'available' },
      ],

      visual: [
        { name: 'Braille signs', status: 'available' },
        { name: 'Clear signage', status: 'available' },
        { name: 'Audio guidance', status: 'unknown' },
      ],

      hearing: [
        { name: 'Visual alerts', status: 'available' },
        { name: 'Sign language support', status: 'unknown' },
      ],

      sensory: [
        { name: 'Quiet environment', status: 'available' },
        { name: 'Reduced sensory area', status: 'unknown' },
      ],
    },

    visitInfo: {
      parking: 'Accessible parking available near the main entrance.',
      entrance: 'Main entrance is step-free.',
      hours: 'Sun–Thu 09:00–20:00',
      phone: '04-555-1234',
      website: 'www.example.com',
      transport: 'Bus stops are available within a short walking distance.',
    },
  },

  {
    id: 2,
    name: 'City Museum',
    category: 'Museum',
    city: 'Nazareth',
    address: 'City Center',
    rating: 4.5,
    reviews: 28,
    verified: true,
    updatedAt: '2026-08-08',

    images: [
      museumImage,
      museumImage,
      museumImage,
    ],

    accessibilityMatch: 82,

    accessibility: {
      mobility: [
        { name: 'Step-free entrance', status: 'available' },
        { name: 'Elevator', status: 'available' },
        { name: 'Accessible restroom', status: 'available' },
      ],

      visual: [
        { name: 'Braille signs', status: 'available' },
        { name: 'Audio guidance', status: 'available' },
      ],

      hearing: [
        { name: 'Visual alerts', status: 'available' },
        { name: 'Sign language support', status: 'unknown' },
      ],

      sensory: [
        { name: 'Quiet environment', status: 'available' },
      ],
    },

    visitInfo: {
      parking: 'Public parking is available nearby.',
      entrance: 'Accessible entrance is located beside the main entrance.',
      hours: 'Mon–Sat 10:00–18:00',
      phone: '04-555-2222',
      website: 'www.example.com',
      transport: 'Several public transport lines stop nearby.',
    },
  },

  {
    id: 3,
    name: 'Community Center',
    category: 'Community Center',
    city: 'Acre',
    address: 'Old City Area',
    rating: 4.6,
    reviews: 31,
    verified: true,
    updatedAt: '2026-08-05',

    images: [
      communityImage,
      communityImage,
      communityImage,
    ],

    accessibilityMatch: 86,

    accessibility: {
      mobility: [
        { name: 'Accessible parking', status: 'available' },
        { name: 'Elevator', status: 'available' },
        { name: 'Accessible restroom', status: 'available' },
      ],

      visual: [
        { name: 'Clear signage', status: 'available' },
      ],

      hearing: [
        { name: 'Hearing support', status: 'available' },
      ],

      sensory: [
        { name: 'Quiet environment', status: 'available' },
      ],
    },

    visitInfo: {
      parking: 'Dedicated accessible parking spaces are available.',
      entrance: 'Step-free entrance available.',
      hours: 'Sun–Thu 08:00–19:00',
      phone: '04-555-3333',
      website: 'www.example.com',
      transport: 'Accessible public transport is available nearby.',
    },
  },
]

export default places