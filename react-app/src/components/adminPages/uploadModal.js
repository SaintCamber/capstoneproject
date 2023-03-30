import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import UploadForm from "../upload";

function UploadSongModal({ songId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();



    return (
        <div className="upload-song-modal">
            <UploadForm closeModal={closeModal} />
        </div>
    );
}

export default UploadSongModal;