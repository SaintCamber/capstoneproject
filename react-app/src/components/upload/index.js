import React, { useState } from 'react';

const UploadForm = ({ albumProp, release_dateProp, album_artProp, artistProp, nameProp, recordType }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState(nameProp);
  const [albumName, setAlbumName] = useState(albumProp);
  const [release_date, setReleaseDate] = useState(release_dateProp);
  const [album_art, setAlbumArt] = useState(album_artProp);
  const [artistName, setArtistName] = useState(artistProp);
  const [error, setError] = useState('');
  const [songLoading, setSongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSongLoading(true)
    const formData = new FormData();
    formData.append('song_name', name);
    formData.append('album_name', albumName);
    formData.append('release_date', release_date);
    formData.append('album_art', album_art);
    formData.append('artist_name', artistName);
    formData.append('file', file);



    if (recordType == 'Song') {
      try {
        await fetch("api/admin/upload", {
          method: "POST",
          body: formData,
          headers: {
            enctype: "multipart/form-data",
          },
        });
        setSongLoading(false);
        setName("");
        setAlbumName("");
        setArtistName("");
        setReleaseDate("");
        setAlbumArt("");
        console.log('File uploaded successfully');
      } catch (err) {
        setError(err["error"]);

      }
    }
    else if (recordType == 'Album') {
      try {
        await fetch("api/admin/albums", {
          method: "POST",
          body: formData,
          headers: {
            enctype: "multipart/form-data",
          }
        });

      }
      catch (err) {
        setError(err["error"]);
      }

    }

    else if (recordType == 'Artist') {
      try {
        await fetch("api/admin/artists", {
          method: "POST",
          body: formData,
          headers: {
            enctype: "multipart/form-data",
          }
        }
        )
      } catch (err) {
        setError(err["error"]);
      }
    }
  }



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
