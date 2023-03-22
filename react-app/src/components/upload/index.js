import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";


const UploadSong = () => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [title, setTitle] = useState("");
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [song_file, setSong_File] = useState(null)
  const [songLoading, setSongLoading] = useState(false);
  
    

  
  useEffect(() => {
    // Fetch the list of artists from the server
    fetch('api/admin/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.log(error));
  }, []);
  



  useEffect(() => {
    // Fetch the list of albums from the server
    fetch('api/admin/albums')
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.log(error));
  }, []);
  
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("song_file", song_file);

    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setSongLoading(true);

    const res = fetch("api/admin/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
  

    if (res.ok) {
      await res.json();
      setSongLoading(false);
      history.push("/");
    }
    else {
      setSongLoading(false);
      // a real app would probably use more advanced
      // error handling
      console.log("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      
    >
      <input
        type="file"
        accept={[".mp3", ".wav", ".flac"]}
        onChange={(e) => setSong_File(e.target.files[0])}
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song Title"
      >

      </input>
      <select
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      >
        <option value="">Select an artist</option>
        {artists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {(artist.id,artist.name)}
          </option>
        ))}
      </select>

      <select
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
      >
        <option value="">Select an album</option>
        {albums.map((album) => (
          <option key={album.id} value={album.id}>
            {(album.id,album.title)}
          </option>
        ))}
      </select>      
      <button type="submit">Submit</button>
      {(songLoading) && <p>Loading...</p>}
    </form>
  )
}

export default UploadSong;