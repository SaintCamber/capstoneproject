import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [release_date, setReleaseDate] = useState('');
  const [album_art, setAlbumArt] = useState('');
  const [artistName, setArtistName] = useState('');
  const [trackNumber, setTrackNumber] = useState('');
  const [error, setError] = useState('');
  const [songLoading, setSongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSongLoading(true)
    const formData = new FormData();
    formData.append('song_name', name);
    formData.append('track_number', '')
    formData.append('album_name', albumName);
    formData.append('release_date', release_date);
    formData.append('album_art', album_art);
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
      setReleaseDate("");
      setAlbumArt("");
      setTrackNumber("");
      console.log('File uploaded successfully');
    } catch (err) {
     setError(err["error"]);
    
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };



  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      <div>
        <label htmlFor="song_name">song Name</label>
        <input
          type="text"
          name="song_name"
          id="song_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="song_name">Track Number</label>
        <input
          type="Number"
          name="track_number"
          id="Track_number"
          value={trackNumber}
          onChange={(e) => setTrackNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="album_name">Album Name</label>
        <input
          type="text"
          name="album_name"
          id="album_name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="release_date">release_date</label>
        <input
          type="Date"
          name="release_date"
          id="release_date"
          value={release_date}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="albumart">album art</label>
        <input
          type="text"
          name="album_art"
          id="album_art"
          value={album_art}
          onChange={(e) => setAlbumArt(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="artist_name">Artist Name</label>
        <input
          type="text"
          name="artist_name"
          id="artist_name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
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
