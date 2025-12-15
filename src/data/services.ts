import { Package, Home, Car, Scissors, AlertTriangle, UserCheck, Truck, Wrench, Sparkles, Heart, Bike, Plane, Utensils, Dog, Camera } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  count: number;
}

export interface Service {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  provider: string;
  providerAvatar?: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit: string;
  duration?: string;
  distance?: string;
  image?: string;
  featured?: boolean;
}

export const categories: ServiceCategory[] = [
  { id: 'delivery', title: 'Delivery Services', icon: Truck, color: '#F97316', count: 24 },
  { id: 'home', title: 'Home Services', icon: Home, color: '#3B82F6', count: 42 },
  { id: 'transport', title: 'Transportation', icon: Car, color: '#8B5CF6', count: 18 },
  { id: 'lifestyle', title: 'Lifestyle & Personal', icon: Scissors, color: '#EC4899', count: 36 },
  { id: 'emergency', title: 'Emergency Services', icon: AlertTriangle, color: '#EF4444', count: 12 },
  { id: 'assistant', title: 'Personal Assistant', icon: UserCheck, color: '#10B981', count: 15 },
];

export const services: Service[] = [
  // Delivery Services
  {
    id: '1',
    categoryId: 'delivery',
    title: 'Express Package Delivery',
    description: 'Same-day delivery for packages up to 20kg. Real-time tracking included.',
    provider: 'FastTrack Delivery',
    rating: 4.8,
    reviewCount: 234,
    price: 15,
    priceUnit: 'package',
    duration: '2-4 hrs',
    distance: '2.3 km',
    featured: true,
  },
  {
    id: '2',
    categoryId: 'delivery',
    title: 'Grocery Delivery',
    description: 'Fresh groceries delivered from your favorite stores.',
    provider: 'FreshMart Express',
    rating: 4.6,
    reviewCount: 189,
    price: 8,
    priceUnit: 'trip',
    duration: '1-2 hrs',
    distance: '1.5 km',
  },
  {
    id: '3',
    categoryId: 'delivery',
    title: 'Food Delivery',
    description: 'Hot meals from top restaurants delivered to your door.',
    provider: 'QuickBite',
    rating: 4.7,
    reviewCount: 456,
    price: 5,
    priceUnit: 'order',
    duration: '30-45 min',
  },
  
  // Home Services
  {
    id: '4',
    categoryId: 'home',
    title: 'Deep House Cleaning',
    description: 'Professional deep cleaning service for your entire home.',
    provider: 'CleanPro Services',
    rating: 4.9,
    reviewCount: 312,
    price: 80,
    priceUnit: 'session',
    duration: '4-6 hrs',
    featured: true,
  },
  {
    id: '5',
    categoryId: 'home',
    title: 'Plumbing Repair',
    description: 'Expert plumbers for all your repair and installation needs.',
    provider: 'PipeMasters',
    rating: 4.7,
    reviewCount: 178,
    price: 45,
    priceUnit: 'hr',
    duration: 'Varies',
  },
  {
    id: '6',
    categoryId: 'home',
    title: 'Electrical Work',
    description: 'Licensed electricians for repairs and installations.',
    provider: 'SparkElectric',
    rating: 4.8,
    reviewCount: 203,
    price: 55,
    priceUnit: 'hr',
    duration: 'Varies',
  },
  {
    id: '7',
    categoryId: 'home',
    title: 'AC Repair & Service',
    description: 'Air conditioning repair, maintenance, and installation.',
    provider: 'CoolTech',
    rating: 4.6,
    reviewCount: 145,
    price: 60,
    priceUnit: 'visit',
    duration: '1-3 hrs',
  },

  // Transportation
  {
    id: '8',
    categoryId: 'transport',
    title: 'Airport Transfer',
    description: 'Reliable airport pickup and drop-off service.',
    provider: 'SkyRide',
    rating: 4.9,
    reviewCount: 567,
    price: 35,
    priceUnit: 'trip',
    duration: 'As needed',
    featured: true,
  },
  {
    id: '9',
    categoryId: 'transport',
    title: 'City Ride',
    description: 'Comfortable rides within the city.',
    provider: 'CityMover',
    rating: 4.5,
    reviewCount: 890,
    price: 12,
    priceUnit: 'trip',
    duration: 'Varies',
  },
  {
    id: '10',
    categoryId: 'transport',
    title: 'Moving Service',
    description: 'Full-service moving with trucks and helpers.',
    provider: 'QuickMove',
    rating: 4.7,
    reviewCount: 234,
    price: 150,
    priceUnit: 'hr',
    duration: '4-8 hrs',
  },

  // Lifestyle & Personal
  {
    id: '11',
    categoryId: 'lifestyle',
    title: 'Home Haircut',
    description: 'Professional haircut service at your home.',
    provider: 'StyleCut',
    rating: 4.8,
    reviewCount: 423,
    price: 40,
    priceUnit: 'session',
    duration: '45 min',
    featured: true,
  },
  {
    id: '12',
    categoryId: 'lifestyle',
    title: 'Massage Therapy',
    description: 'Relaxing massage in the comfort of your home.',
    provider: 'ZenTouch',
    rating: 4.9,
    reviewCount: 312,
    price: 75,
    priceUnit: 'hr',
    duration: '1-2 hrs',
  },
  {
    id: '13',
    categoryId: 'lifestyle',
    title: 'Personal Training',
    description: 'One-on-one fitness training sessions.',
    provider: 'FitPro',
    rating: 4.7,
    reviewCount: 178,
    price: 50,
    priceUnit: 'session',
    duration: '1 hr',
  },

  // Emergency Services
  {
    id: '14',
    categoryId: 'emergency',
    title: 'Locksmith Service',
    description: '24/7 emergency locksmith for lockouts and repairs.',
    provider: 'KeyMaster',
    rating: 4.8,
    reviewCount: 289,
    price: 60,
    priceUnit: 'call',
    duration: '30-60 min',
    featured: true,
  },
  {
    id: '15',
    categoryId: 'emergency',
    title: 'Roadside Assistance',
    description: 'Emergency roadside help including towing.',
    provider: 'RoadHelp',
    rating: 4.6,
    reviewCount: 456,
    price: 45,
    priceUnit: 'call',
    duration: '20-45 min',
  },

  // Personal Assistant
  {
    id: '16',
    categoryId: 'assistant',
    title: 'Errand Running',
    description: 'Get your errands done by a reliable assistant.',
    provider: 'TaskRunner',
    rating: 4.7,
    reviewCount: 234,
    price: 25,
    priceUnit: 'hr',
    duration: 'Varies',
    featured: true,
  },
  {
    id: '17',
    categoryId: 'assistant',
    title: 'Pet Sitting',
    description: 'Loving care for your pets while you\'re away.',
    provider: 'PetPals',
    rating: 4.9,
    reviewCount: 178,
    price: 30,
    priceUnit: 'day',
    duration: 'As needed',
  },
  {
    id: '18',
    categoryId: 'assistant',
    title: 'Event Planning',
    description: 'Professional assistance for your special events.',
    provider: 'EventPro',
    rating: 4.8,
    reviewCount: 89,
    price: 100,
    priceUnit: 'hr',
    duration: 'Varies',
  },
];

export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter(service => service.categoryId === categoryId);
};

export const getFeaturedServices = (): Service[] => {
  return services.filter(service => service.featured);
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return categories.find(category => category.id === id);
};
