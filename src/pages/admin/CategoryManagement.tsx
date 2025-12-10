import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from "lucide-react";
import {
  getCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
  getSubCategoriesAPI,
  createSubCategoryAPI,
  updateSubCategoryAPI,
  deleteSubCategoryAPI,
  getSubCategoriesByCategoryAPI
} from "@/service/operations/category";
import { Category, SubCategory } from "@/constants/categories";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: null as File | null,
    sortOrder: 0,
    isActive: true
  });

  // SubCategory form state
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    image: null as File | null,
    sortOrder: 0,
    isActive: true
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubCategoryDialog, setShowSubCategoryDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesAPI(true);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await getSubCategoriesAPI();
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', categoryForm.name);
      formData.append('description', categoryForm.description);
      formData.append('sortOrder', categoryForm.sortOrder.toString());
      formData.append('isActive', categoryForm.isActive.toString());
      
      if (categoryForm.image) {
        formData.append('image', categoryForm.image);
      }

      let response;
      if (editingCategory) {
        response = await updateCategoryAPI(editingCategory._id, formData);
      } else {
        response = await createCategoryAPI(formData);
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
        });
        
        fetchCategories();
        resetCategoryForm();
        setShowCategoryDialog(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', subCategoryForm.name);
      formData.append('description', subCategoryForm.description);
      formData.append('categoryId', subCategoryForm.categoryId);
      formData.append('sortOrder', subCategoryForm.sortOrder.toString());
      formData.append('isActive', subCategoryForm.isActive.toString());
      
      if (subCategoryForm.image) {
        formData.append('image', subCategoryForm.image);
      }

      let response;
      if (editingSubCategory) {
        response = await updateSubCategoryAPI(editingSubCategory._id, formData);
      } else {
        response = await createSubCategoryAPI(formData);
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: `SubCategory ${editingSubCategory ? 'updated' : 'created'} successfully`,
        });
        
        fetchSubCategories();
        resetSubCategoryForm();
        setShowSubCategoryDialog(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${editingSubCategory ? 'update' : 'create'} subcategory`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await deleteCategoryAPI(categoryId);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        fetchCategories();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      const response = await deleteSubCategoryAPI(subCategoryId);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "SubCategory deleted successfully",
        });
        fetchSubCategories();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete subcategory",
        variant: "destructive",
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: null,
      sortOrder: 0,
      isActive: true
    });
    setEditingCategory(null);
  };

  const resetSubCategoryForm = () => {
    setSubCategoryForm({
      name: '',
      description: '',
      categoryId: '',
      image: null,
      sortOrder: 0,
      isActive: true
    });
    setEditingSubCategory(null);
  };

  const editCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: null,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const editSubCategory = (subCategory: SubCategory) => {
    setSubCategoryForm({
      name: subCategory.name,
      description: subCategory.description || '',
      categoryId: typeof subCategory.category === 'string' ? subCategory.category : subCategory.category._id,
      image: null,
      sortOrder: subCategory.sortOrder,
      isActive: subCategory.isActive
    });
    setEditingSubCategory(subCategory);
    setShowSubCategoryDialog(true);
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && category.isActive) ||
      (filterStatus === 'inactive' && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && subCategory.isActive) ||
      (filterStatus === 'inactive' && !subCategory.isActive);
    const matchesCategory = selectedCategory === 'all' || 
      (typeof subCategory.category === 'string' ? subCategory.category === selectedCategory : subCategory.category._id === selectedCategory);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === 'subcategories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('subcategories')}
          >
            SubCategories
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {activeTab === 'subcategories' && (
          <Combobox
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((category) => ({
                value: category._id,
                label: category.name
              }))
            ]}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            placeholder="Filter by category"
            searchPlaceholder="Search categories..."
            emptyText="No category found."
            className="w-48"
          />
        )}

        <Dialog 
          open={activeTab === 'categories' ? showCategoryDialog : showSubCategoryDialog} 
          onOpenChange={activeTab === 'categories' ? setShowCategoryDialog : setShowSubCategoryDialog}
        >
          <DialogTrigger asChild>
            <Button onClick={() => {
              if (activeTab === 'categories') {
                resetCategoryForm();
                setShowCategoryDialog(true);
              } else {
                resetSubCategoryForm();
                setShowSubCategoryDialog(true);
              }
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'categories' ? 'Category' : 'SubCategory'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'categories' 
                  ? (editingCategory ? 'Edit Category' : 'Add Category')
                  : (editingSubCategory ? 'Edit SubCategory' : 'Add SubCategory')
                }
              </DialogTitle>
            </DialogHeader>
            
            {activeTab === 'categories' ? (
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Category Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryForm({...categoryForm, image: e.target.files?.[0] || null})}
                    required={!editingCategory}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an image to represent this category (JPG, PNG, GIF)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({...categoryForm, sortOrder: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Combobox
                    options={categories.map((category) => ({
                      value: category._id,
                      label: category.name
                    }))}
                    value={subCategoryForm.categoryId}
                    onValueChange={(value) => setSubCategoryForm({...subCategoryForm, categoryId: value})}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                    emptyText="No category found."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={subCategoryForm.name}
                    onChange={(e) => setSubCategoryForm({...subCategoryForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={subCategoryForm.description}
                    onChange={(e) => setSubCategoryForm({...subCategoryForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">SubCategory Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSubCategoryForm({...subCategoryForm, image: e.target.files?.[0] || null})}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an image to represent this subcategory (JPG, PNG, GIF)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={subCategoryForm.sortOrder}
                    onChange={(e) => setSubCategoryForm({...subCategoryForm, sortOrder: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Saving...' : (editingSubCategory ? 'Update' : 'Create')}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              {activeTab === 'subcategories' && <TableHead>Category</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeTab === 'categories' ? (
              filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {category.image && (
                        <img src={category.image} alt={category.name} className="w-8 h-8 rounded object-cover" />
                      )}
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              filteredSubCategories.map((subCategory) => (
                <TableRow key={subCategory._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {subCategory.image && (
                        <img src={subCategory.image} alt={subCategory.name} className="w-8 h-8 rounded object-cover" />
                      )}
                      {subCategory.name}
                    </div>
                  </TableCell>
                  <TableCell>{subCategory.description}</TableCell>
                  <TableCell>
                    {typeof subCategory.category === 'string' 
                      ? subCategory.category 
                      : subCategory.category.name
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                      {subCategory.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subCategory.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editSubCategory(subCategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubCategory(subCategory._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;