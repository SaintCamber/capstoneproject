import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [songLoading, setSongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSongLoading(true)
    const formData = new FormData();
    formData.append('filename', name);
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
      console.log('File uploaded successfully');
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      >
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleNameChange}
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
