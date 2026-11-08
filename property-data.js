// Shared listing data for landing and workspace.
const STORAGE_KEY = 'myagent_properties_v1';
const THEME_STORAGE_KEY = 'myagent_theme';

const SAMPLE_PROPERTIES = [
  {
    id: 'prop_lekki_duplex_01',
    title: 'Luxurious 4-Bedroom Contemporary Duplex',
    type: 'Duplex',
    listingType: 'For Sale',
    bedrooms: '4',
    bathrooms: 4,
    location: 'Lekki Phase 1, Lagos',
    price: 185000000,
    description: 'Exquisite architectural masterpiece featuring a stamped concrete compound, fully fitted Italian kitchen with marble countertops, private cinema room, automated gate system, smart home lighting, and 24/7 armed estate security in a serene Lekki neighborhood.',
    image: 'assets/images/duplex.jpg',
    availability: 'Available',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'prop_vi_apartment_02',
    title: 'Waterfront 3-Bedroom Penthouse Apartment',
    type: 'Apartment',
    listingType: 'For Rent',
    bedrooms: '3',
    bathrooms: 3,
    location: 'Victoria Island, Lagos',
    price: 28000000,
    description: 'Spectacular panoramic waterfront vistas overlooking Lagos Lagoon. Features floor-to-ceiling soundproof glass, open-concept German chef kitchen, infinity swimming pool access, full-time gym, central air-conditioning, and 100% round-the-clock uninterrupted power supply.',
    image: 'assets/images/apartment.jpg',
    availability: 'Available',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'prop_abuja_detached_03',
    title: 'Palatial 5-Bedroom Detached Mansion with Pool',
    type: 'Detached House',
    listingType: 'For Sale',
    bedrooms: '5',
    bathrooms: 6,
    location: 'Maitama, Abuja',
    price: 650000000,
    description: 'Ultra-luxury ambassadorial mansion nestled in prime Maitama diplomatic zone. Boasts Olympic-length private swimming pool, Spanish marble finishing throughout, 2-room BQ, bulletproof external doors, manicured gardens, private elevator lift, and massive solar power backup system.',
    image: 'assets/images/detached.jpg',
    availability: 'Available',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prop_ikeja_bungalow_04',
    title: 'Serene 3-Bedroom Executive Garden Bungalow',
    type: 'Bungalow',
    listingType: 'For Rent',
    bedrooms: '3',
    bathrooms: 3,
    location: 'Ikeja GRA, Lagos',
    price: 14000000,
    description: 'Charming contemporary bungalow situated on a quiet tree-lined avenue in secure Ikeja GRA. Features landscaped front yard, covered 3-car port, industrial borehole water treatment system, ensuite rooms, walk-in closets, and peaceful residential ambience close to the airport.',
    image: 'assets/images/bungalow.jpg',
    availability: 'Available',
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'prop_ikoyi_terrace_05',
    title: 'Modern 4-Bedroom Smart Terrace Townhouse',
    type: 'Other',
    listingType: 'For Sale',
    bedrooms: '4',
    bathrooms: 4,
    location: 'Ikoyi, Lagos',
    price: 320000000,
    description: 'Contemporary triplex terrace in an exclusive gated close in Old Ikoyi. Fitted with private rooftop lounge, smart home integration, integrated audio ceiling speakers, CCTV surveillance, 3-car parking, and dedicated domestic service quarters.',
    image: 'assets/images/terrace.jpg',
    availability: 'Unavailable',
    createdAt: Date.now() - 86400000 * 10
  }
];

// ==========================================================================
