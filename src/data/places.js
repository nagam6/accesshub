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
    image: libraryImage,
    accessibility: [
      'Wheelchair Access',
      'Elevator',
      'Accessible Restroom',
    ],
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
    image: museumImage,
    accessibility: [
      'Wheelchair Access',
      'Visual Support',
      'Quiet Environment',
    ],
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
    image: communityImage,
    accessibility: [
      'Accessible Parking',
      'Elevator',
      'Hearing Support',
    ],
  },
]

export default places