import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Layout from "../components/Layout";

const initialFormData = {
  title: "",
  categoryKey: "",
  description: "",
  sortOrder: 0,
  isActive: true,
  image: null,
};

const sortByOrder = (items) =>
  [...items].sort((a, b) => {
    if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }
    return a.title.localeCompare(b.title);
  });

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [createFormData, setCreateFormData] = useState(initialFormData);
  const [updateFormData, setUpdateFormData] = useState(initialFormData);
  const [createImagePreview, setCreateImagePreview] = useState("");
  const [updateImagePreview, setUpdateImagePreview] = useState("");

  const token = Cookies.get("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${baseURL}/notebook-categories?includeInactive=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(sortByOrder(data.data || []));
      } catch (err) {
        setError(err.message || "Failed to load notebook categories");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [baseURL, token]);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;

    return categories.filter(
      (category) =>
        category.title?.toLowerCase().includes(keyword) ||
        category.categoryKey?.toLowerCase().includes(keyword) ||
        category.description?.toLowerCase().includes(keyword)
    );
  }, [categories, searchTerm]);

  const handleCreateChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCreateFormData((prev) => ({ ...prev, image: file }));
    setCreateImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleUpdateImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setUpdateFormData((prev) => ({ ...prev, image: file }));

    if (file) {
      setUpdateImagePreview(URL.createObjectURL(file));
    } else {
      setUpdateImagePreview(currentCategory?.imageUrl || "");
    }
  };

  const openCreateModal = () => {
    setCreateFormData(initialFormData);
    setCreateImagePreview("");
    setShowCreateModal(true);
  };

  const openUpdateModal = (category) => {
    setCurrentCategory(category);
    setUpdateFormData({
      title: category.title || "",
      categoryKey: category.categoryKey || "",
      description: category.description || "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive !== false,
      image: null,
    });
    setUpdateImagePreview(category.imageUrl || "");
    setShowUpdateModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setCurrentCategory(null);
    setCreateImagePreview("");
    setUpdateImagePreview("");
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!createFormData.image) {
        throw new Error("Please select an image.");
      }

      const body = new FormData();
      body.append("title", createFormData.title);
      body.append("categoryKey", createFormData.categoryKey);
      body.append("description", createFormData.description);
      body.append("sortOrder", String(Number(createFormData.sortOrder || 0)));
      body.append("isActive", String(createFormData.isActive));
      body.append("image", createFormData.image);

      const response = await fetch(`${baseURL}/notebook-categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setCategories((prev) => sortByOrder([data, ...prev]));
      closeModals();

      Swal.fire({
        title: "Created",
        text: "Notebook category created successfully.",
        icon: "success",
        confirmButtonColor: "#222222",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to create notebook category.",
        icon: "error",
        confirmButtonColor: "#222222",
      });
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!currentCategory?._id) return;

    try {
      const body = new FormData();
      body.append("title", updateFormData.title);
      body.append("categoryKey", updateFormData.categoryKey);
      body.append("description", updateFormData.description);
      body.append("sortOrder", String(Number(updateFormData.sortOrder || 0)));
      body.append("isActive", String(updateFormData.isActive));

      if (updateFormData.image) {
        body.append("image", updateFormData.image);
      }

      const response = await fetch(
        `${baseURL}/notebook-categories/${currentCategory._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      setCategories((prev) =>
        sortByOrder(
          prev.map((category) =>
            category._id === currentCategory._id ? data : category
          )
        )
      );
      closeModals();

      Swal.fire({
        title: "Updated",
        text: "Notebook category updated successfully.",
        icon: "success",
        confirmButtonColor: "#222222",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to update notebook category.",
        icon: "error",
        confirmButtonColor: "#222222",
      });
    }
  };

  const handleDeleteCategory = async (category) => {
    const result = await Swal.fire({
      title: "Delete this category?",
      text: `This will remove "${category.title}" from Shop by Notebook Type.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `${baseURL}/notebook-categories/${category._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((item) => item._id !== category._id)
      );

      Swal.fire({
        title: "Deleted",
        text: "Notebook category deleted successfully.",
        icon: "success",
        confirmButtonColor: "#222222",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to delete notebook category.",
        icon: "error",
        confirmButtonColor: "#222222",
      });
    }
  };

  const renderCategoryForm = ({
    formData,
    onChange,
    onImageChange,
    submitLabel,
    imagePreview,
    isEdit,
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Daily Notes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Key
        </label>
        <input
          type="text"
          name="categoryKey"
          value={formData.categoryKey}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="daily"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used in filter links like <code>/shop?category=daily</code>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Image
        </label>
        <div className="space-y-3">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Category preview"
              className="h-36 w-full object-cover rounded-md border border-gray-300"
            />
          ) : (
            <div className="h-36 w-full rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
              No image selected
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onImageChange}
            required={!isEdit}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-xs text-gray-500">
            {isEdit
              ? "Choose a new image only if you want to replace the current one."
              : "Upload an image for this category card."}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Simple notebooks for everyday planning and journaling."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id={`${submitLabel}-active`}
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label
            htmlFor={`${submitLabel}-active`}
            className="ml-2 text-sm text-gray-700"
          >
            Show in Home page section
          </label>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">
            Shop by Notebook Type Categories
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all cards shown in the Home page category section.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title, key, or description..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Key
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={category.imageUrl}
                        alt={category.title}
                        className="h-14 w-14 object-cover rounded-lg border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {category.title}
                        </p>
                        <p className="text-xs text-gray-500 max-w-sm">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {category.categoryKey}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {category.sortOrder || 0}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openUpdateModal(category)}
                        className="text-primary hover:text-black font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-heading text-gray-900 mb-5">
              Create Notebook Category
            </h2>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              {renderCategoryForm({
                formData: createFormData,
                onChange: handleCreateChange,
                onImageChange: handleCreateImageChange,
                submitLabel: "create-category",
                imagePreview: createImagePreview,
                isEdit: false,
              })}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-black"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-heading text-gray-900 mb-5">
              Update Notebook Category
            </h2>
            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
              {renderCategoryForm({
                formData: updateFormData,
                onChange: handleUpdateChange,
                onImageChange: handleUpdateImageChange,
                submitLabel: "update-category",
                imagePreview: updateImagePreview,
                isEdit: true,
              })}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Categories;
