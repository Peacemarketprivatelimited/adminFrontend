import React from "react";

interface Props {
  setImages: (files: FileList | null) => void;
}

const ImagesSection: React.FC<Props> = ({ setImages }) => (
  <div className="bg-gray-800 p-4 rounded-md dark:bg-gray-800">
    <h3 className="text-lg font-medium mb-4 text-gray-200 dark:text-gray-200">Product Images</h3>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Upload Images</label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={(e) => setImages(e.target.files)}
        className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
      />
      <p className="text-xs text-gray-400 dark:text-gray-400">You can select multiple images</p>
    </div>
  </div>
);

export default ImagesSection;