import { Event } from "../types/event";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate a random date within the next 3 months
const generateFutureDate = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset + Math.floor(Math.random() * 90));
  return date.toISOString().split('T')[0];
};

// Generate a random time
const generateTime = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 4) * 15}`.padStart(5, '0');
};

export const mockEvents: Event[] = [
  {
    id: generateId(),
    title: "Annual Tech Conference 2024",
    slug: "annual-tech-conference-2024",
    description: "Join us for the biggest tech conference of the year featuring keynote speakers from leading tech companies, workshops, networking opportunities, and the latest in technology innovations.",
    shortDescription: "The biggest tech conference of the year with industry leaders and innovative workshops.",
    startDate: generateFutureDate(10),
    endDate: generateFutureDate(12),
    startTime: generateTime(9),
    endTime: generateTime(17),
    location: {
      address: "123 Convention Center Way",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "USA",
      venueDetails: "Main Exhibition Hall, 2nd Floor"
    },
    images: [
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/ai?w=800&h=400&u=tech-conference",
        alt: "Tech Conference Banner"
      },
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/ai?w=800&h=400&u=tech-conference-2",
        alt: "Conference Workshop"
      }
    ],
    featuredImage: {
      id: generateId(),
      url: "https://img.heroui.chat/image/ai?w=800&h=400&u=tech-conference-featured",
      alt: "Tech Conference Featured Image"
    },
    category: "Technology",
    tags: ["tech", "conference", "innovation", "networking"],
    status: "published",
    isPublic: true,
    isFeatured: true,
    capacity: 1500,
    contact: {
      name: "Event Organizer",
      email: "organizer@techconference.com",
      phone: "+1 (555) 123-4567"
    },
    tickets: [
      {
        id: generateId(),
        name: "Early Bird",
        price: 299.99,
        availableQuantity: 200,
        maxPerOrder: 2
      },
      {
        id: generateId(),
        name: "Regular",
        price: 399.99,
        availableQuantity: 800,
        maxPerOrder: 5
      },
      {
        id: generateId(),
        name: "VIP",
        price: 699.99,
        availableQuantity: 100,
        maxPerOrder: 2
      }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Summer Music Festival",
    slug: "summer-music-festival",
    description: "A three-day music festival featuring top artists from around the world, multiple stages, food vendors, and camping options for attendees.",
    shortDescription: "Three days of music, food, and fun with top artists from around the world.",
    startDate: generateFutureDate(30),
    endDate: generateFutureDate(33),
    startTime: generateTime(12),
    endTime: generateTime(23),
    location: {
      address: "456 Festival Grounds",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
      venueDetails: "Outdoor venue with multiple stages"
    },
    images: [
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/ai?w=800&h=400&u=music-festival",
        alt: "Music Festival Stage"
      }
    ],
    featuredImage: {
      id: generateId(),
      url: "https://img.heroui.chat/image/ai?w=800&h=400&u=music-festival-featured",
      alt: "Music Festival Featured Image"
    },
    category: "Music",
    tags: ["music", "festival", "summer", "outdoor", "camping"],
    status: "published",
    isPublic: true,
    isFeatured: true,
    capacity: 10000,
    contact: {
      name: "Festival Coordinator",
      email: "info@summermusicfest.com",
      phone: "+1 (555) 987-6543"
    },
    tickets: [
      {
        id: generateId(),
        name: "General Admission",
        price: 199.99,
        availableQuantity: 8000,
        maxPerOrder: 6
      },
      {
        id: generateId(),
        name: "VIP Pass",
        price: 499.99,
        availableQuantity: 1000,
        maxPerOrder: 4
      }
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: generateId(),
    title: "Business Leadership Workshop",
    slug: "business-leadership-workshop",
    description: "A one-day intensive workshop focused on developing leadership skills for business executives and managers. Learn from industry experts and network with peers.",
    shortDescription: "Intensive leadership training for business executives and managers.",
    startDate: generateFutureDate(15),
    endDate: generateFutureDate(15),
    startTime: generateTime(8),
    endTime: generateTime(17),
    location: {
      address: "789 Corporate Plaza",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      venueDetails: "Executive Conference Room, 15th Floor"
    },
    images: [
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/ai?w=800&h=400&u=business-workshop",
        alt: "Business Workshop"
      }
    ],
    category: "Business",
    tags: ["business", "leadership", "workshop", "professional development"],
    status: "published",
    isPublic: true,
    isFeatured: false,
    capacity: 50,
    contact: {
      name: "Workshop Coordinator",
      email: "workshops@businessleadership.com"
    },
    tickets: [
      {
        id: generateId(),
        name: "Standard Registration",
        price: 799.99,
        availableQuantity: 45,
        maxPerOrder: 3
      },
      {
        id: generateId(),
        name: "Group Registration (3+ people)",
        price: 699.99,
        availableQuantity: 15,
        maxPerOrder: 10
      }
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: generateId(),
    title: "Community Charity Run",
    slug: "community-charity-run",
    description: "Join our annual 5K charity run to raise funds for local community programs. All ages and abilities welcome. Refreshments and entertainment provided after the race.",
    shortDescription: "Annual 5K run raising funds for local community programs.",
    startDate: generateFutureDate(20),
    endDate: generateFutureDate(20),
    startTime: generateTime(7),
    endTime: generateTime(12),
    location: {
      address: "123 City Park",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA",
      venueDetails: "Start line at the main entrance"
    },
    images: [
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/sports?w=800&h=400&u=charity-run",
        alt: "Charity Run"
      }
    ],
    category: "Sports",
    tags: ["charity", "run", "community", "5K", "fundraiser"],
    status: "published",
    isPublic: true,
    isFeatured: false,
    capacity: 500,
    contact: {
      name: "Event Coordinator",
      email: "run@communitycharities.org",
      phone: "+1 (555) 234-5678"
    },
    tickets: [
      {
        id: generateId(),
        name: "Adult Registration",
        price: 35,
        availableQuantity: 400,
        maxPerOrder: 5
      },
      {
        id: generateId(),
        name: "Child Registration (under 12)",
        price: 15,
        availableQuantity: 100,
        maxPerOrder: 5
      }
    ],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: generateId(),
    title: "Art Exhibition Opening",
    slug: "art-exhibition-opening",
    description: "Exclusive opening night for our new contemporary art exhibition featuring works from local and international artists. Wine and hors d'oeuvres will be served.",
    shortDescription: "Opening night for contemporary art exhibition with wine reception.",
    startDate: generateFutureDate(5),
    endDate: generateFutureDate(5),
    startTime: generateTime(18),
    endTime: generateTime(21),
    location: {
      address: "456 Gallery Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      venueDetails: "Main Gallery, First Floor"
    },
    images: [
      {
        id: generateId(),
        url: "https://img.heroui.chat/image/ai?w=800&h=400&u=art-exhibition",
        alt: "Art Exhibition"
      }
    ],
    category: "Arts & Culture",
    tags: ["art", "exhibition", "gallery", "opening", "contemporary"],
    status: "published",
    isPublic: true,
    isFeatured: true,
    capacity: 150,
    contact: {
      name: "Gallery Director",
      email: "director@artgallery.com",
      phone: "+1 (555) 876-5432"
    },
    tickets: [
      {
        id: generateId(),
        name: "General Admission",
        price: 25,
        availableQuantity: 120,
        maxPerOrder: 4
      },
      {
        id: generateId(),
        name: "VIP (Early Access + Catalog)",
        price: 75,
        availableQuantity: 30,
        maxPerOrder: 2
      }
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Draft event
export const draftEvent: Event = {
  id: generateId(),
  title: "Product Launch Webinar",
  slug: "product-launch-webinar",
  description: "Join us for the virtual launch of our newest product line. Learn about features, pricing, and special launch offers.",
  shortDescription: "Virtual launch event for our newest product line.",
  startDate: generateFutureDate(25),
  endDate: generateFutureDate(25),
  startTime: generateTime(14),
  endTime: generateTime(16),
  location: {
    address: "Online",
    city: "Virtual",
    state: "N/A",
    zipCode: "N/A",
    country: "Global",
    venueDetails: "Zoom Webinar"
  },
  images: [
    {
      id: generateId(),
      url: "https://img.heroui.chat/image/ai?w=800&h=400&u=product-launch",
      alt: "Product Launch"
    }
  ],
  category: "Business",
  tags: ["webinar", "product launch", "virtual event"],
  status: "draft",
  isPublic: false,
  isFeatured: false,
  contact: {
    name: "Marketing Team",
    email: "marketing@company.com"
  },
  tickets: [
    {
      id: generateId(),
      name: "Standard Access",
      price: 0,
      availableQuantity: 1000
    },
    {
      id: generateId(),
      name: "Premium Access (Q&A Session)",
      price: 49.99,
      availableQuantity: 200
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Add the draft event to the mock events
export const allEvents = [...mockEvents, draftEvent];

// Event categories
export const eventCategories = [
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Arts & Culture",
  "Education",
  "Food & Drink",
  "Health & Wellness",
  "Community",
  "Other"
];
