import { useState } from "react";

function Create({ recordType, onCreate }) {
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate({ ...formData, type: recordType });
        setFormData({});
    };

    return (
        <form onSubmit={handleSubmit}>
            {recordType === "song" && (
                <>
                    <label>
                        Song Name:
                        <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
                    </label>
                    <label>
                        Album Name:
                        <input type="text" name="albumName" value={formData.albumName || ""} onChange={handleChange} required />
                    </label>
                    <label>
                        Artist:
                        <input type="text" name="artist" value={formData.artist || ""} onChange={handleChange} required />
                    </label>
                    <label>
                        Release Date:
                        <input type="date" name="releaseDate" value={formData.releaseDate || ""} onChange={handleChange} required />
                    </label>
                    <input type="file" name="songFile" onChange={(event) => setFormData({ ...formData, songFile: event.target.files[0] })} required />
                </>
            )}

            {recordType === "album" && (
                <>
                    <label>
                        Album Name:
                        <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
                    </label>
                    <label>
                        Artist:
                        <input type="text" name="artist" value={formData.artist || ""} onChange={handleChange} required />
                    </label>
                    <label>
                        Release Date:
                        <input type="date" name="releaseDate" value={formData.releaseDate || ""} onChange={handleChange} required />
                    </label>
                    <input type="file" name="albumArt" onChange={(event) => setFormData({ ...formData, albumArt: event.target.files[0] })} required />
                </>
            )}

            {recordType === "artist" && (
                <>
                    <label>
                        Artist Name:
                        <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
                    </label>
                    <input type="file" name="artistImage" onChange={(event) => setFormData({ ...formData, artistImage: event.target.files[0] })} required />
                </>
            )}

            <button type="submit">Create {recordType}</button>
        </form>
    );
}

export default Create;