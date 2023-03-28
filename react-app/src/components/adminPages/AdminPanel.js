import React, { useState } from "react";

const AdminPanel = () => {
  const [entity, setEntity] = useState("song");

  const handleEntityChange = (e) => {
    setEntity(e.target.value);
  };

  return (
    <div>
      <div>
        <h2>Create {entity}</h2>
        {/* code for creating the selected entity */}
        
      </div>
      <div>
        <h2>Read {entity}</h2>
        {/* code for reading the selected entity */}
      </div>
      <div>
        <h2>Update {entity}</h2>
        {/* code for updating the selected entity */}
      </div>
      <div>
        <h2>Delete {entity}</h2>
        {/* code for deleting the selected entity */}
      </div>
      <div>
        <select value={entity} onChange={handleEntityChange}>
          <option value="song">Song</option>
          <option value="album">Album</option>
          <option value="artist">Artist</option>
        </select>
      </div>
    </div>
  );
};

export default AdminPanel;
