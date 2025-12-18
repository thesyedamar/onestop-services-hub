import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbService {
  id: string;
  category_id: string;
  title: string;
  description: string;
  provider: string;
  provider_avatar: string | null;
  rating: number;
  review_count: number;
  price: number;
  price_unit: string;
  duration: string | null;
  distance: string | null;
  image: string | null;
  featured: boolean;
  is_active: boolean;
}

export const useServices = () => {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('featured', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};

export const useFeaturedServices = () => {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('featured', true)
        .limit(6);

      setServices(data || []);
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return { services, loading };
};

export const useServicesByCategory = (categoryId: string) => {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchByCategory = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', categoryId)
        .order('rating', { ascending: false });

      setServices(data || []);
      setLoading(false);
    };

    fetchByCategory();
  }, [categoryId]);

  return { services, loading };
};

export const useServiceById = (serviceId: string) => {
  const [service, setService] = useState<DbService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      setLoading(true);
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle();

      setService(data);
      setLoading(false);
    };

    fetchService();
  }, [serviceId]);

  return { service, loading };
};

export const useCategoryServiceCount = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('services')
        .select('category_id');

      if (data) {
        const countMap: Record<string, number> = {};
        data.forEach((s) => {
          countMap[s.category_id] = (countMap[s.category_id] || 0) + 1;
        });
        setCounts(countMap);
      }
      setLoading(false);
    };

    fetchCounts();
  }, []);

  return { counts, loading };
};