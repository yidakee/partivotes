import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, Slider, Tooltip, Menu, MenuItem, Fade } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// Very simple music player with hardcoded tracks
const MusicPlayer = () => {
  // State for tracking the current track, volume, play status, etc.
  const [tracks] = useState([
    { id: 1, title: 'Bohemian Rap', file: '/music/bohemian_rap.mp3' },
    { id: 2, title: 'What Is Love', file: '/music/what_is_love.mp3' },
    { id: 3, title: 'Africa - Toto', file: '/music/africa_toto.mp3' },
    { id: 4, title: 'Take On Me', file: '/music/take_on_me.mp3' },
    { id: 5, title: 'Billie Jean', file: '/music/billie.mp3' }
  ]);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  // Refs for audio element and progress interval
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  // Play/pause handler
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Effect for play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Set up audio element when component mounts
  useEffect(() => {
    if (tracks.length > 0 && audioRef.current) {
      audioRef.current.src = tracks[currentTrack].file;
      audioRef.current.load();
      audioRef.current.volume = volume;
    }
    
    // Clean up on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [tracks, currentTrack, volume]);
  
  // Update progress periodically
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setProgress(audioRef.current.currentTime);
      }
    };
    
    progressIntervalRef.current = setInterval(updateProgress, 1000);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Handle next track
  const handleNext = () => {
    if (tracks.length === 0) return;
    
    let nextTrack;
    if (isShuffle) {
      nextTrack = Math.floor(Math.random() * tracks.length);
    } else {
      nextTrack = (currentTrack + 1) % tracks.length;
    }
    
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  };
  
  // Handle previous track
  const handlePrevious = () => {
    if (tracks.length === 0) return;
    
    let prevTrack;
    if (isShuffle) {
      prevTrack = Math.floor(Math.random() * tracks.length);
    } else {
      prevTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    }
    
    setCurrentTrack(prevTrack);
    setIsPlaying(true);
  };
  
  // Handle volume change
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue;
    }
    
    if (newValue === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  
  // Handle shuffle toggle
  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle);
  };
  
  // Menu handlers
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleTrackSelect = (index) => {
    setCurrentTrack(index);
    handleMenuClose();
  };
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Box
      sx={{
        position: 'relative',
        padding: '10px',
        width: '100%',
        backgroundColor: 'rgba(10, 10, 30, 0.85)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        boxShadow: '0 0 15px rgba(0, 200, 255, 0.4)',
        border: '1px solid rgba(0, 255, 240, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '300px',
        overflow: 'hidden'
      }}
    >
      <Typography variant="body2" noWrap sx={{ color: '#00fff0', fontWeight: 'bold' }}>
        {tracks[currentTrack]?.title || 'Select a track'}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Typography variant="caption" sx={{ minWidth: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>
          {formatTime(progress)}
        </Typography>
        
        <Slider
          size="small"
          value={progress}
          max={duration || 100}
          onChange={(e, value) => {
            if (audioRef.current) {
              audioRef.current.currentTime = value;
              setProgress(value);
            }
          }}
          sx={{
            color: '#00fff0',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(0, 255, 240, 0.16)'
              }
            },
            '& .MuiSlider-rail': {
              opacity: 0.3,
            }
          }}
        />
        
        <Typography variant="caption" sx={{ minWidth: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>
          {formatTime(duration)}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Shuffle">
            <IconButton
              onClick={handleShuffleToggle}
              size="small"
              sx={{ color: isShuffle ? '#00fff0' : 'white' }}
            >
              <ShuffleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Previous Track">
            <IconButton onClick={handlePrevious} size="small" sx={{ color: 'white' }}>
              <SkipPreviousIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <IconButton onClick={handlePlayPause} sx={{ color: '#00fff0' }}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Next Track">
            <IconButton onClick={handleNext} size="small" sx={{ color: 'white' }}>
              <SkipNextIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mr: 1 }}>
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton onClick={handleMuteToggle} size="small" sx={{ color: 'white' }}>
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Slider
            size="small"
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            sx={{
              width: 80,
              color: '#00fff0',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              }
            }}
          />
          
          <Tooltip title="Playlist">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ color: 'white' }}>
              <QueueMusicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(10, 10, 30, 0.9)',
            border: '1px solid rgba(0, 255, 240, 0.3)',
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 255, 240, 0.7)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 240, 0.9)',
              },
            },
          }
        }}
      >
        {tracks.map((track, index) => (
          <MenuItem
            key={track.id}
            selected={index === currentTrack}
            onClick={() => handleTrackSelect(index)}
            sx={{
              color: index === currentTrack ? '#00fff0' : 'white',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 255, 240, 0.2)',
              }
            }}
          >
            <MusicNoteIcon fontSize="small" sx={{ mr: 1 }} />
            {track.title}
          </MenuItem>
        ))}
      </Menu>
      
      <audio 
        ref={audioRef} 
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onError={() => {
          console.error('Audio error occurred');
          setIsPlaying(false);
        }}
      />
    </Box>
  );
};

export default MusicPlayer;
