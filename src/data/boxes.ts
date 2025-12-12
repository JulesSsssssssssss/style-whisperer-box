export interface ClothingBox {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  originalValue: number;
  items: number;
  images: string[];
  tags: string[];
  rating: number;
  reviews: number;
  sustainability: {
    co2Saved: string;
    waterSaved: string;
    wasteReduced: string;
  };
}

export const clothingBoxes: ClothingBox[] = [
  {
    id: "casual-basics",
    name: "Casual Essentials",
    category: "Casual",
    description: "Everyday comfort meets timeless style",
    longDescription:
      "Curated basics that form the foundation of any wardrobe. Soft tees, perfect-fit jeans, and versatile layering pieces selected for comfort and durability.",
    price: 79.99,
    originalValue: 280,
    items: 5,
    images: ["/casual-essentials.png"],
    tags: ["everyday", "comfortable", "basics", "neutral"],
    rating: 4.8,
    reviews: 234,
    sustainability: {
      co2Saved: "12kg",
      waterSaved: "8,000L",
      wasteReduced: "3kg",
    },
  },
  {
    id: "vintage-treasures",
    name: "Vintage Revival",
    category: "Vintage",
    description: "Unique finds from the 70s, 80s & 90s",
    longDescription:
      "Hand-picked vintage pieces with authentic character. From retro band tees to classic denim jackets, each item tells a story and adds personality to your look.",
    price: 119.99,
    originalValue: 400,
    items: 4,
    images: [
      "/vintage-revival.png",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600",
    ],
    tags: ["retro", "unique", "statement", "authentic"],
    rating: 4.9,
    reviews: 189,
    sustainability: {
      co2Saved: "18kg",
      waterSaved: "12,000L",
      wasteReduced: "4kg",
    },
  },
  {
    id: "urban-street",
    name: "Urban Street",
    category: "Urban",
    description: "Street-smart style for city life",
    longDescription:
      "Contemporary streetwear meets sustainability. Graphic hoodies, cargo pants, and sneaker-ready pieces that keep you looking fresh from day to night.",
    price: 99.99,
    originalValue: 320,
    items: 5,
    images: [
      "/box-urban-street.png",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
    ],
    tags: ["streetwear", "trendy", "bold", "city"],
    rating: 4.7,
    reviews: 312,
    sustainability: {
      co2Saved: "14kg",
      waterSaved: "9,500L",
      wasteReduced: "3.5kg",
    },
  },
  {
    id: "classic-professional",
    name: "Classic Pro",
    category: "Classic",
    description: "Elevated essentials for the modern professional",
    longDescription:
      "Sophisticated pre-loved pieces for the workplace. Blazers, tailored trousers, and quality blouses that command respect while respecting the planet.",
    price: 109.99,
    originalValue: 520,
    items: 4,
    images: [
      "/classic-pro.png",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600",
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600",
    ],
    tags: ["professional", "elegant", "timeless", "quality"],
    rating: 4.9,
    reviews: 167,
    sustainability: {
      co2Saved: "22kg",
      waterSaved: "15,000L",
      wasteReduced: "5kg",
    },
  },
  {
    id: "boho-free",
    name: "Bohemian Spirit",
    category: "Boho",
    description: "Free-spirited pieces for the creative soul",
    longDescription:
      "Flowing fabrics, earthy tones, and artisanal details. Perfect for those who express themselves through layered, textured, and uniquely styled outfits.",
    price: 89.99,
    originalValue: 360,
    items: 5,
    images: [
      "/bohemian-spirit.png",
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
    ],
    tags: ["bohemian", "artistic", "flowing", "natural"],
    rating: 4.8,
    reviews: 203,
    sustainability: {
      co2Saved: "16kg",
      waterSaved: "11,000L",
      wasteReduced: "4kg",
    },
  },
  {
    id: "minimalist-capsule",
    name: "Minimal Capsule",
    category: "Minimal",
    description: "Less is more with quality essentials",
    longDescription:
      "A thoughtfully curated capsule collection. Neutral tones, clean lines, and versatile pieces that mix and match effortlessly for countless outfit combinations.",
    price: 104.99,
    originalValue: 450,
    items: 6,
    images: [
      "/minimal-box.png",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
    ],
    tags: ["minimalist", "versatile", "neutral", "capsule"],
    rating: 4.9,
    reviews: 278,
    sustainability: {
      co2Saved: "20kg",
      waterSaved: "14,000L",
      wasteReduced: "4.5kg",
    },
  },
  {
    id: "sporty-active",
    name: "Active Lifestyle",
    category: "Sporty",
    description: "Performance meets sustainable fashion",
    longDescription:
      "Pre-loved activewear that performs. Quality leggings, breathable tops, and comfortable sneakers for workouts, yoga, or athleisure days.",
    price: 84.99,
    originalValue: 250,
    items: 5,
    images: [
      "/active-lifestyle.png",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?w=600",
    ],
    tags: ["active", "comfortable", "sporty", "athleisure"],
    rating: 4.6,
    reviews: 156,
    sustainability: {
      co2Saved: "10kg",
      waterSaved: "7,000L",
      wasteReduced: "2.5kg",
    },
  },
  {
    id: "evening-glam",
    name: "Evening Edit",
    category: "Evening",
    description: "Statement pieces for special moments",
    longDescription:
      "Occasion wear without the guilt. Stunning dresses, elegant accessories, and special pieces perfect for events, dates, and celebrations.",
    price: 114.99,
    originalValue: 600,
    items: 3,
    images: [
      "/evening-edit.png",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    ],
    tags: ["evening", "elegant", "special", "glamorous"],
    rating: 4.8,
    reviews: 98,
    sustainability: {
      co2Saved: "25kg",
      waterSaved: "18,000L",
      wasteReduced: "6kg",
    },
  },
];

export const categories = [
  "All",
  "Casual",
  "Vintage",
  "Urban",
  "Classic",
  "Boho",
  "Minimal",
  "Sporty",
  "Evening",
];

export const testimonials = [
  {
    id: 1,
    name: "Marie L.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    text: "J'adore le concept ! Chaque box est une vraie surprise et les vêtements sont toujours de super qualité. L'assistant IA a vraiment compris mon style.",
    rating: 5,
    boxPurchased: "Vintage Revival",
  },
  {
    id: 2,
    name: "Sophie M.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    text: "Sustainable fashion made easy! The quality exceeds my expectations every time. Plus, knowing I'm helping the environment makes it even better.",
    rating: 5,
    boxPurchased: "Minimal Capsule",
  },
  {
    id: 3,
    name: "Lucas D.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    text: "Finally, a subscription that gets my style. The AI stylist recommended the Urban Street box and it was perfect. Already on my third month!",
    rating: 5,
    boxPurchased: "Urban Street",
  },
  {
    id: 4,
    name: "Emma R.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    text: "The gamification aspect keeps me engaged and the rewards are actually useful. Love earning style points while building a sustainable wardrobe!",
    rating: 4,
    boxPurchased: "Bohemian Spirit",
  },
];
