import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

// Simplified music player with hardcoded tracks
const MusicPlayer = () => {
  const [tracks] = useState([
    { id: 1, title: 'Bohemian Rap', file: '/music/bohemian_rap.mp3' },
    { id: 2, title: 'What Is Love', file: '/music/what_is_love.mp3' },
    { id: 3, title: 'Africa - Toto', file: '/music/africa_toto.mp3' },
    { id: 4, title: 'Take On Me', file: '/music/take_on_me.mp3' },
    { id: 5, title: 'Billie Jean', file: '/music/billie.mp3' }
  ]);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(new Audio());
  const progressTimerRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    
    // Set initial properties
    audio.volume = volume;
    audio.src = tracks[currentTrack].file;
    
    // Add event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      // Play next random track when current track ends
      handleNext();
    });
    
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
    });
    
    return () => {
      // Clean up
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('timeupdate', () => {});
    };
  }, []);
  
  // Handle track change
  useEffect(() => {
    const audio = audioRef.current;
    
    // Change track source
    audio.src = tracks[currentTrack].file;
    audio.load();
    
    // If already playing, continue playing new track
    if (isPlaying) {
      // Small timeout to ensure the audio has loaded
      setTimeout(() => {
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(e => console.error("Playback error:", e));
        }
      }, 50);
    }
  }, [currentTrack, tracks]);
  
  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(e => {
          console.error("Playback error:", e);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  // Handle volume change
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  // Play/pause button handler
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Next track handler - always random
  const handleNext = () => {
    if (tracks.length <= 1) return;
    
    // Get a random track different from current
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } while (nextIndex === currentTrack && tracks.length > 1);
    
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
  };
  
  // Previous track handler - always random
  const handlePrevious = () => {
    if (tracks.length <= 1) return;
    
    // Get a random track different from current
    let prevIndex;
    do {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } while (prevIndex === currentTrack && tracks.length > 1);
    
    setCurrentTrack(prevIndex);
    setIsPlaying(true);
  };
  
  // Mute toggle handler
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  // Progress bar time formatter
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Box
      sx={{
        position: 'relative',
        padding: '12px',
        width: '100%',
        backgroundColor: 'rgba(10, 10, 30, 0.85)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        boxShadow: '0 0 15px rgba(0, 200, 255, 0.4)',
        border: '1px solid rgba(0, 255, 240, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* Track title */}
      <Typography variant="body2" noWrap sx={{ 
        color: '#00fff0', 
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 240, 0.5)'
      }}>
        {tracks[currentTrack]?.title || 'No track selected'}
      </Typography>
      
      {/* Progress bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: '40px' }}>
          {formatTime(progress)}
        </Typography>
        <Slider
          value={progress}
          max={duration || 100}
          onChange={(_, value) => {
            audioRef.current.currentTime = value;
            setProgress(value);
          }}
          sx={{ 
            color: '#00fff0',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(0, 255, 240, 0.16)'
              }
            },
            '& .MuiSlider-rail': {
              opacity: 0.5,
              backgroundColor: '#003333'
            }
          }}
        />
        <Typography variant="caption" sx={{ minWidth: '40px', textAlign: 'right' }}>
          {formatTime(duration)}
        </Typography>
      </Box>
      
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Previous button */}
          <IconButton onClick={handlePrevious} size="small" sx={{ color: '#fff' }}>
            <SkipPreviousIcon />
          </IconButton>
          
          {/* Play/Pause button */}
          <IconButton onClick={handlePlayPause} sx={{ color: '#00fff0' }}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          
          {/* Next button */}
          <IconButton onClick={handleNext} size="small" sx={{ color: '#fff' }}>
            <SkipNextIcon />
          </IconButton>
        </Box>
        
        {/* Volume control */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100px' }}>
          <IconButton onClick={handleMuteToggle} size="small" sx={{ color: '#fff' }}>
            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
          <Slider
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, value) => setVolume(value)}
            sx={{ 
              color: '#00fff0',
              '& .MuiSlider-thumb': {
                width: 10,
                height: 10
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MusicPlayer;
