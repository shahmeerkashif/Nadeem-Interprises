import React, { useEffect, useState } from 'react';
import { addHeroImage, getHeroImages, deleteHeroImage } from '../../services/firebase';

const HeroManagement = () => {
  const [url, setUrl] = useState('');
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const data = await getHeroImages();
    setImages(data);
  };

  const handleAdd = async () => {
    if (!url.trim()) return alert('Please enter a valid URL');
    await addHeroImage(url);
    setUrl('');
    fetchImages();
  };

  const handleDelete = async (id) => {
    await deleteHeroImage(id);
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="hero-management">
      <h2>Hero Image Management</h2>
      <div className="input-area">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Hero Image URL"
          className="border p-2 w-80"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white p-2 ml-2 rounded">
          Add Image
        </button>
      </div>

      <div className="images-list mt-4">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="flex items-center justify-between mb-2 border p-2 rounded">
              <img src={img.url} alt="Hero" className="h-20 w-32 object-cover rounded" />
              <button
                onClick={() => handleDelete(img.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No images added yet.</p>
        )}
      </div>
    </div>
  );
};

export default HeroManagement;
