import React from 'react';

function DeleteRecordById({ recordType, recordId, onDelete }) {
    const handleDelete = () => {
        // Perform deletion logic here using the provided `recordType` and `recordId`
        onDelete(recordType, recordId);
    };

    let recordTypeName = "";
    switch (recordType) {
        case "song":
            recordTypeName = "Song";
            break;
        case "artist":
            recordTypeName = "Artist";
            break;
        case "album":
            recordTypeName = "Album";
            break;
        default:
            recordTypeName = "Record";
    }

    return (
        <button onClick={handleDelete}>
            Delete {recordTypeName} {recordId}
        </button>
    );
}

export default DeleteRecordById;