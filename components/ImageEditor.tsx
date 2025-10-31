import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { applyImageEdits } from '../utils/imageUtils';

interface Props {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<Props> = ({ imageUrl, onSave, onClose }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('none');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await applyImageEdits(
          imageUrl,
          croppedAreaPixels,
          rotation,
          filter
        );
        onSave(croppedImage);
      } catch (e) {
        console.error(e);
        alert('Could not process the image. Please try again.');
      }
    }
  };

  const filters = [
    { value: 'none', label: 'None' },
    { value: 'grayscale(100%)', label: 'Grayscale' },
    { value: 'sepia(100%)', label: 'Sepia' },
    { value: 'invert(100%)', label: 'Invert' },
    { value: 'brightness(150%)', label: 'Brighter' },
    { value: 'contrast(200%)', label: 'High Contrast' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col">
        <h2 className="text-2xl font-semibold p-6 border-b text-gray-800">Edit Photo</h2>
        
        <div className="relative h-96 w-full bg-gray-200">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { filter: filter }
            }}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="block">
              <span className="text-gray-700">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Rotation</span>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-gray-700">Filter</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-xl space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;