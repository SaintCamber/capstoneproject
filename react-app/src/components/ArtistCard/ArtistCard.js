import {useState,useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { useHistory,useDispatch } from 'react-router-dom';
import "ArtistCard.css"

const ArtistCard = (Artist)=>{
    handleClick=(e)=>{
        e.preventDefault();
        history.push(`/artists/${Artist.id}`)
    }

    return (

        <div className="artist-card" onClick={handleClick}>
            <div className="artist-card__image">
                <img src={Artist.image} alt="artist image"/>
            </div>
            <div className="artist-card__details">
                <h3>{Artist.name}</h3>
                <h6>Artist</h6>
            </div>
        </div>

    )
}

export default ArtistCard;