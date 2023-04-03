import React, { useState } from 'react';

const UploadForm = ({ closeModal }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [release_date, setReleaseDate] = useState("");
  // const [album_art, setAlbumArt] = useState("");
  const [artistName, setArtistName] = useState("");
  const [error, setError] = useState([]);
  const [songLoading, setSongLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    const errors = [];
    const selectedFile = file
    const maxSize = 10000000; // 10MB
    setSongLoading(true)
    const allowedTypes = ['.mp3'];


    if (!name || !albumName || !release_date || !artistName || !file) {
      errors.push("All fields are required");
      setSongLoading(false);

    }
    if (selectedFile.size > maxSize) {
      errors.push("File size can't exceed 10MB");
      setSongLoading(false);

    }

    if (!allowedTypes.includes(selectedFile.type)) {
      errors.push("Only mp3 files are allowed");
      setSongLoading(false);


    }

    const releaseDateTimestamp = new Date(release_date).getTime();
    if (releaseDateTimestamp > Date.now()) {
      errors.push("Release date can't be in the future");
      setSongLoading(false);


    }
    // if (!isValidUrl(album_art)) {
    //   errors.push('Please provide a valid album art URL');
    //   setSongLoading(false);

    // }
    const formData = new FormData();
    formData.append('song_name', name);
    formData.append('album_name', albumName);
    formData.append('release_date', release_date);
    // formData.append('album_art', album_art);
    formData.append('artist_name', artistName);
    formData.append('file', file);



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
      // setAlbumArt("");
      setFile(null);
      if (!errors.length) {
        setSuccess(true);
      }
    } catch (err) {
      return error

    }
  };

  const handleFileChange = (e) => {

    setFile(e.target.files[0]);
  };


  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      <h7>add a song to create an artist and album entry in the database</h7>
      <div><p></p></div>
      <div>
        <label htmlFor="song_name">song Name</label>
        <input
          type="text"
          name="song_name"
          id="song_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={"song name"}
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
          placeholder={"album name"}
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
          placeholder={"release date"}
        />
      </div>
      {/* <div>
        <label htmlFor="albumart">album art</label>
        <input
          type="text"
          name="album_art"
          id="album_art"
          value={album_art}
          onChange={(e) => setAlbumArt(e.target.value)}
          required
          placeholder={"album art"}
        />
      </div> */}

      <div>
        <label htmlFor="artist_name">Artist Name</label>
        <input
          type="text"
          name="artist_name"
          id="artist_name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          required
          placeholder={"artist name"}
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
          placeholder={"please choose a file, mp3 are supported"}
        />
      </div>
      <div>
        <button type="submit">Upload</button>
      </div>
      {error.map(err => <p>{err}</p>)}
      {songLoading && <p>Loading...</p>}
      {success && <p>song uploaded successfully</p>}
    </form>
  );
};

export default UploadForm;
