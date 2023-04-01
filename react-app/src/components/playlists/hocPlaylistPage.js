const withPlaylist = (WrappedComponent) => {
    const WithPlaylist = (props) => {
      const dispatch = useDispatch();
      const [currentSong, setCurrentSong] = useState(null);
      const [prevSong, setPrevSong] = useState(null);
      const [nextSong, setNextSong] = useState(null);
  
      useEffect(() => {
        if (props.songs) {
          const songs = Object.values(props.songs);
          const currentIndex = songs.findIndex(song => song.id === props.currentSongId);
          setCurrentSong(songs[currentIndex]);
          setPrevSong(currentIndex > 0 ? songs[currentIndex - 1] : null);
          setNextSong(currentIndex < songs.length - 1 ? songs[currentIndex + 1] : null);
        }
      }, [props.songs, props.currentSongId]);
  
      const handleSkip = (direction) => {
        const newSong = direction === 'next' ? nextSong : prevSong;
        if (newSong) {
          setCurrentSong(newSong);
          dispatch({ type: "PLAY_TRACK", payload: newSong });
        }
      };
  
      return (
        <WrappedComponent
          {...props}
          currentSong={currentSong}
          prevSong={prevSong}
          nextSong={nextSong}
          handleSkip={handleSkip}
        />
      );
    };
  
    return WithPlaylist;
  };
  