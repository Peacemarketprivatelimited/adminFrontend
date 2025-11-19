// ...existing code...
import React, { useEffect, useState } from "react";
import { Video, Plus, Trash2 } from "lucide-react";
import { api } from "../../data/api";
import { AdminVideo } from "../../types/earnTypes";


const EarnPage: React.FC = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPoints, setNewPoints] = useState("");

  // Fetch videos from backend
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{
        success: boolean;
        count: number;
        videos: AdminVideo[];
      }>("/admin/videos");
      setVideos(res.data.videos || []);
    } catch (err: any) {
      console.error("Failed to fetch videos", err);
      setError(
        err?.response?.data?.message ||
          "Failed to fetch videos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAdd = async () => {
    if (!newTitle || !newUrl || !newPoints) {
      alert("Please fill in all fields");
      return;
    }

    const pointsNum = parseInt(newPoints, 10);
    if (isNaN(pointsNum) || pointsNum < 0) {
      alert("Points must be a non-negative number");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const payload = {
        title: newTitle,
        embedUrl: newUrl,
        points: pointsNum,
        active: true,
      };

      const res = await api.post<{ success: boolean; video: AdminVideo }>(
        "/admin/videos",
        payload
      );

      const created = res.data.video;
      setVideos((prev) => [created, ...prev]);

      setNewTitle("");
      setNewUrl("");
      setNewPoints("");
    } catch (err: any) {
      console.error("Failed to create video", err);
      setError(
        err?.response?.data?.message ||
          "Failed to create video. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/admin/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      console.error("Failed to delete video", err);
      setError(
        err?.response?.data?.message ||
          "Failed to delete video. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className=" rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Admin Panel</h2>
          </div>
          <p className="text-gray-600 ml-16">
            Manage video content and rewards
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Add Video Form */}
        <div className=" rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add New Video
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                placeholder="Enter video title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Embed URL
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Points
              </label>
              <input
                type="number"
                placeholder="50"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={creating}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                creating ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Plus className="w-5 h-5" />
              {creating ? "Adding..." : "Add Video"}
            </button>
          </div>
        </div>

        {/* Current Videos List */}
        <div className=" rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Current Videos ({videos.length})
            </h3>
            {loading && (
              <span className="text-sm text-gray-500">Loading videos...</span>
            )}
          </div>

          <div className="space-y-3">
            {!loading && videos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No videos added yet</p>
              </div>
            ) : (
              videos.map((v) => (
                <div
                  key={v._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Video className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {v.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {v.embedUrl}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Status:{" "}
                        <span
                          className={
                            v.active ? "text-green-600" : "text-red-500"
                          }
                        >
                          {v.active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-green-700 font-semibold text-sm">
                        {v.points} pts
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(v._id)}
                    disabled={deletingId === v._id}
                    className={`ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100 ${
                      deletingId === v._id
                        ? "opacity-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;
// ...existing code...