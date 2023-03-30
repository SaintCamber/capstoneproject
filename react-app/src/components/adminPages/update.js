import React, { useState } from 'react';

function UpdateRecord({ recordType, id, onUpdate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedRecord = {
            id: id,
            name: name,
            description: description,
        };
        onUpdate(recordType, updatedRecord);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" value={name} onChange={handleNameChange} />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={handleDescriptionChange} />
            </div>
            <button type="submit">Update {recordType}</button>
        </form>
    );
}

export default UpdateRecord;