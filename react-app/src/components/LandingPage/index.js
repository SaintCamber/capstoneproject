import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Playbar from '../playbar';
export default function LandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  return (
    <div className="LandingPage">
      <h1>Welcome to the landing page</h1>
    </div>
  );
}




