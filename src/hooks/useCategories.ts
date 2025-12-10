import { useState, useEffect } from 'react';
import { getCategoriesAPI, getSubCategoriesByCategoryAPI } from '@/service/operations/category';
import { Category, SubCategory } from '@/constants/categories';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesAPI(false);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

export const useSubCategories = (categoryId?: string) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubCategories = async (catId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubCategoriesByCategoryAPI(catId);
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subcategories');
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  }, [categoryId]);

  return {
    subCategories,
    loading,
    error,
    refetch: categoryId ? () => fetchSubCategories(categoryId) : () => {}
  };
};