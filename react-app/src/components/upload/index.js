import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [error, setError] = useState('');
  const [songLoading, setSongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSongLoading(true)
    const formData = new FormData();
    formData.append('song_name', name);
    formData.append('album_name', albumName);
    formData.append('artist_name', artistName);
    formData.append('file', file);

    try {
      await fetch("api/admin/upload", {
        method: "POST",
        body: formData,
        headers: {
          encType: "multipart/form-data",
        },
      });
      setSongLoading(false);
      setName("");
      setAlbumName("");
      setArtistName("");
      console.log('File uploaded successfully');
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };



  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      >
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="song_name"
          id="song_name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="album_name"
          id="album_name"
          value={albumName}
          onChange={(e)=>setAlbumName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="artist_name"
          id="artist_name"
          value={artistName}
          onChange={(e)=>setArtistName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="file">File</label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleFileChange}
          accept="audio/*"
          required
        />
      </div>
      <div>
        <button type="submit">Upload</button>
      </div>
      {error && <p>{error}</p>}
      {songLoading && <p>Loading...</p>}
    </form>
  );
};

export default UploadForm;
