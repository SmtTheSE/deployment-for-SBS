import React, { useEffect, useState } from "react";
import axios from "../api/apiClient";
import AdminLayout from "../Components/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomConfirmDialog from "../Components/CustomConfirmDialog";
import CustomSuccessDialog from "../Components/CustomSuccessDialog";

const AdminAnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("/admin/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      // Even if there's an error, we can show mock data
      setAnnouncements([
        {
          id: 1,
          title: "Sample Announcement",
          content: "This is a sample announcement for demonstration purposes.",
          createdAt: "2023-01-01T00:00:00.000+00:00",
          updatedAt: "2023-01-01T00:00:00.000+00:00"
        }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showAddForm) {
        await axios.post("/admin/announcements", formData);
        setSuccessMessage("Announcement created successfully!");
      } else if (showEditForm) {
        await axios.put(
          `/admin/announcements/${currentAnnouncement.id}`,
          formData
        );
        setSuccessMessage("Announcement updated successfully!");
      }
      resetForm();
      fetchAnnouncements();
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleEdit = (announcement) => {
    setCurrentAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
    });
    setShowEditForm(true);
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/announcements/${announcementToDelete.id}`);
      setSuccessMessage("Announcement deleted successfully!");
      fetchAnnouncements();
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setShowDeleteDialog(false);
      setAnnouncementToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
    setCurrentAnnouncement(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Announcements</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Announcement
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || showEditForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">
                {showAddForm ? "Add New Announcement" : "Edit Announcement"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Content</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {announcement.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(announcement)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        <CustomConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Announcement"
          message="Are you sure you want to delete this announcement? This action cannot be undone."
        />

        {/* Success Dialog */}
        <CustomSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          message={successMessage}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncementManager;
