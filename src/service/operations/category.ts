import { apiConnector } from "../apiConnector";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Category APIs
export const getCategoriesAPI = async (includeSubCategories = false) => {
    try {
        const response = await apiConnector(
            "GET", 
            `${BASE_URL}/categories?includeSubCategories=${includeSubCategories}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const getCategoryByIdAPI = async (categoryId: string) => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/categories/${categoryId}`);
        return response;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

export const createCategoryAPI = async (categoryData: FormData | {
    name: string;
    description?: string;
    sortOrder?: number;
}) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/categories`, categoryData);
        return response;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategoryAPI = async (categoryId: string, categoryData: FormData | {
    name?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
}) => {
    try {
        const response = await apiConnector("PUT", `${BASE_URL}/categories/${categoryId}`, categoryData);
        return response;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategoryAPI = async (categoryId: string) => {
    try {
        const response = await apiConnector("DELETE", `${BASE_URL}/categories/${categoryId}`);
        return response;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

// SubCategory APIs
export const getSubCategoriesAPI = async (categoryId?: string) => {
    try {
        const url = categoryId 
            ? `${BASE_URL}/subcategories?categoryId=${categoryId}`
            : `${BASE_URL}/subcategories`;
        const response = await apiConnector("GET", url);
        return response;
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
    }
};

export const getSubCategoriesByCategoryAPI = async (categoryId: string) => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/categories/${categoryId}/subcategories`);
        return response;
    } catch (error) {
        console.error("Error fetching subcategories by category:", error);
        throw error;
    }
};

export const getSubCategoryByIdAPI = async (subCategoryId: string) => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/subcategories/${subCategoryId}`);
        return response;
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        throw error;
    }
};

export const createSubCategoryAPI = async (subCategoryData: FormData | {
    name: string;
    description?: string;
    categoryId: string;
    sortOrder?: number;
}) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/subcategories`, subCategoryData);
        return response;
    } catch (error) {
        console.error("Error creating subcategory:", error);
        throw error;
    }
};

export const updateSubCategoryAPI = async (subCategoryId: string, subCategoryData: FormData | {
    name?: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
    sortOrder?: number;
}) => {
    try {
        const response = await apiConnector("PUT", `${BASE_URL}/subcategories/${subCategoryId}`, subCategoryData);
        return response;
    } catch (error) {
        console.error("Error updating subcategory:", error);
        throw error;
    }
};

export const deleteSubCategoryAPI = async (subCategoryId: string) => {
    try {
        const response = await apiConnector("DELETE", `${BASE_URL}/subcategories/${subCategoryId}`);
        return response;
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        throw error;
    }
};