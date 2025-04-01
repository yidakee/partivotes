import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { ThemeContext } from '../../contexts/ThemeContext';

// Ultra-simplified music player with only essential controls
const MusicPlayer = () => {
  const { themeMode } = useContext(ThemeContext);
  const [tracks] = useState([
    { title: '1979 - Smashing Pumpkins', file: '/music/1979_smashing_pumkins.mp3' },
    { title: '7 Nation Army - White Stripes', file: '/music/7_nation.mp3' },
    { title: '8-Bit Music', file: '/music/8bit.mp3' },
    { title: '8 Mile - Eminem', file: '/music/8_mile.mp3' },
    { title: 'Africa - Toto', file: '/music/africa_toto.mp3' },
    { title: 'Ain\'t Nobody', file: '/music/aint_nobody.mp3' },
    { title: 'In The Air Tonight - Phil Collins', file: '/music/air_tonight_phil_collins.mp3' },
    { title: 'Amerika - Rammstein', file: '/music/amerika_rammstein.mp3' },
    { title: 'Another One Bites The Dust - Queen', file: '/music/another_bites_dust_queen.mp3' },
    { title: 'Another Brick In The Wall - Pink Floyd', file: '/music/another_brik_pink_floyd.mp3' },
    { title: 'Bad Touch - Bloodhound Gang', file: '/music/bad_touch_bloodhound_gang.mp3' },
    { title: 'Basket Case - Green Day', file: '/music/basket_case_greenday.mp3' },
    { title: 'Bat Out Of Hell - Meatloaf', file: '/music/bat_hell_meatloaf.mp3' },
    { title: 'Beat It - Michael Jackson', file: '/music/beat_it_mike_j.mp3' },
    { title: 'Beer - Reel Big Fish', file: '/music/beer_reel_big_fish.mp3' },
    { title: 'Benny Hill Theme', file: '/music/benny_hill.mp3' },
    { title: 'Billie Jean - Michael Jackson', file: '/music/billie.mp3' },
    { title: 'Black Hole Sun - Soundgarden', file: '/music/black_hole_sun_soundgarden.mp3' },
    { title: 'Blew - Nirvana', file: '/music/blew_nirvana.mp3' },
    { title: 'Blinding Lights - The Weeknd', file: '/music/blinding_lights_weekend.mp3' },
    { title: 'Blue Monday - New Order', file: '/music/blue_monday_new_order.mp3' },
    { title: 'Blue - Eiffel 65', file: '/music/blue.mp3' },
    { title: 'Bohemian Rhapsody - Queen', file: '/music/bohemian_rap.mp3' },
    { title: 'Boot', file: '/music/boot.mp3' },
    { title: 'Break On Through - The Doors', file: '/music/break_through_doors.mp3' },
    { title: 'Buddy Holly - Weezer', file: '/music/buddy_holly_weezer.mp3' },
    { title: 'Burning Love - Elvis', file: '/music/burning_love_elvis.mp3' },
    { title: 'Careless Whisper - 8-Bit', file: '/music/Careless Whisper (2022) [8 Bit Tribute to George Michael] - 8 Bit Universe.mp3' },
    { title: 'Cemetery Gates - Pantera', file: '/music/cemetery_gates_pantera.mp3' },
    { title: 'Clint Eastwood - Gorillaz', file: '/music/clint.mp3' },
    { title: 'Closer - Nine Inch Nails', file: '/music/closer_nine_inch_nail.mp3' },
    { title: 'Come As You Are - Nirvana', file: '/music/come_as_you_are_nirvana.mp3' },
    { title: 'Come Together - Beatles', file: '/music/come_together_beatles.mp3' },
    { title: 'Comfortably Numb - Pink Floyd', file: '/music/confortably_numb_pink_floyd.mp3' },
    { title: 'Cowboys From Hell - Pantera', file: '/music/cowboys_hell_pantera.mp3' },
    { title: 'Creep - Radiohead', file: '/music/creep_radiohead.mp3' },
    { title: 'Dancing In The Dark - Bruce Springsteen', file: '/music/dancing_in_the_dark_bruce.mp3' },
    { title: 'Dare - Gorillaz', file: '/music/dare_gorilaz.mp3' },
    { title: 'Daydream Believer - The Monkees', file: '/music/daydream_monkees.mp3' },
    { title: 'Despacito', file: '/music/despacito.mp3' },
    { title: 'Don\'t Stop Me Now - Queen', file: '/music/dont_stop_me_now_queen.mp3' },
    { title: 'Down Under - Men At Work', file: '/music/down_under_men_at_work.mp3' },
    { title: 'Du Hast - Rammstein', file: '/music/du_hast_rammstein.mp3' },
    { title: 'Dumb - Nirvana', file: '/music/dumb_nirvana.mp3' },
    { title: 'Dust In The Wind - Kansas', file: '/music/dust_wind_kansas.mp3' },
    { title: 'Every Breath You Take - The Police', file: '/music/every_breath_police.mp3' },
    { title: 'Every You Every Me - Placebo', file: '/music/every_you_placebo.mp3' },
    { title: 'Eye Of The Tiger - Survivor', file: '/music/eye_tiger_survivor.mp3' },
    { title: 'Fade To Black - Metallica', file: '/music/fade_black_metallica.mp3' },
    { title: 'Feel Good Inc - Gorillaz', file: '/music/feel_good_gorillaz.mp3' },
    { title: 'Final Countdown - Europe', file: '/music/final_countdown.mp3' },
    { title: 'Fireflies - Owl City', file: '/music/fireflies_owl.mp3' },
    { title: 'Foxy Lady - Jimi Hendrix', file: '/music/foxy_lady_jimi_hendrix.mp3' },
    { title: 'In-A-Gadda-Da-Vida - Slayer', file: '/music/gadda_vida_slayer.mp3' },
    { title: 'Never Get Enough - Depeche Mode', file: '/music/get_enough_depeche_mode.mp3' },
    { title: 'Glory Box - Portishead', file: '/music/glory_box_portishead.mp3' },
    { title: 'Go With The Flow - QOTSA', file: '/music/go_flow_gotsa.mp3' },
    { title: 'Hand That Feeds - Nine Inch Nails', file: '/music/hand_that_feed_nine_inch_nails.mp3' },
    { title: 'Heart-Shaped Box - Nirvana', file: '/music/heartshaped_box_nirvana.mp3' },
    { title: 'Highway To Hell - AC/DC', file: '/music/highway_hell_ac_dc.mp3' },
    { title: 'I Want To Hold Your Hand - Beatles', file: '/music/hold_hands_beatles.mp3' },
    { title: 'House Of Fun - Madness', file: '/music/house_fun_madness.mp3' },
    { title: 'Hungry Like The Wolf - Duran Duran', file: '/music/hungry_wolf_duran.mp3' },
    { title: 'Hysteria - Muse', file: '/music/hysteria_muse.mp3' },
    { title: 'I Like To Move It', file: '/music/i_like_2_move_it.mp3' },
    { title: 'I Love Rock N Roll', file: '/music/I_love_rock_n_roll.mp3' },
    { title: 'Intergalactic - Beastie Boys', file: '/music/intergalactic_beastie_boys.mp3' },
    { title: 'Kashmir - Led Zeppelin', file: '/music/kashmir_led_zep.mp3' },
    { title: 'The Kids Aren\'t Alright - Offspring', file: '/music/kids_arent_alright_offpring.mp3' },
    { title: 'Killing In The Name - Rage Against The Machine', file: '/music/killing_rage.mp3' },
    { title: 'Last Night - The Strokes', file: '/music/last_night_the_strokes.mp3' },
    { title: 'Light My Fire - The Doors', file: '/music/light_fire_doors.mp3' },
    { title: 'Livin\' On A Prayer - Bon Jovi', file: '/music/livin_prayer_bon_jovi.mp3' },
    { title: 'Living Prayer - Bon Jovi', file: '/music/living_prayer_bon_jovi.mp3' },
    { title: 'Love Buzz - Nirvana', file: '/music/love_buzz_nirvana.mp3' },
    { title: 'Lovesong - The Cure', file: '/music/lovesong_the_cure.mp3' },
    { title: 'I Was Made For Loving You - KISS', file: '/music/loving_you_kiss.mp3' },
    { title: 'Dragostea Din Tei (Numa Numa)', file: '/music/mai_ai_hee.mp3' },
    { title: 'Make It Wit Chu - QOTSA', file: '/music/make_it_wit_chu_qotsa.mp3' },
    { title: 'Master Of Puppets - Metallica', file: '/music/master_puppets_metallica.mp3' },
    { title: 'Money - Pink Floyd', file: '/music/money_pink_floyd.mp3' },
    { title: 'More Than A Feeling - Boston', file: '/music/more_than_a_feeling_boston.mp3' },
    { title: 'No One Knows - QOTSA', file: '/music/no_one_knows_qotsa.mp3' },
    { title: 'No Rain - Blind Melon', file: '/music/no_rain_blind_melon.mp3' },
    { title: 'Nothing Else Matters - Metallica', file: '/music/nothing_else_matters_metallica.mp3' },
    { title: 'One - Metallica', file: '/music/one_metallica.mp3' },
    { title: 'Owner Of A Lonely Heart - Yes', file: '/music/owner_lonely_heart_yes.mp3' },
    { title: 'Paper Planes - M.I.A.', file: '/music/paper_planes.mp3' },
    { title: 'Paradise City - Green Day', file: '/music/paradise_greenday.mp3' },
    { title: 'Polly - Nirvana', file: '/music/polly_nirvana.mp3' },
    { title: 'Psycho Killer - Talking Heads', file: '/music/psycho_killer_talking_heads.mp3' },
    { title: 'Pumped Up Kicks - Foster The People', file: '/music/pumped_up_kids.mp3' },
    { title: 'Purple Rain - Prince', file: '/music/purple_rain_prince.mp3' },
    { title: 'Redbone - Childish Gambino', file: '/music/redbone_childish_gamb.mp3' },
    { title: 'Riders On The Storm - The Doors', file: '/music/riders_strom_doors.mp3' },
    { title: 'Rock Lobster - The B-52\'s', file: '/music/rock_lobster_b52s.mp3' },
    { title: 'Royals - Lorde', file: '/music/royals.mp3' },
    { title: 'Running With The Devil - Van Halen', file: '/music/running_van_halen.mp3' },
    { title: 'Stayin\' Alive - Bee Gees', file: '/music/stayin_alive_bee_gees.mp3' },
    { title: 'Staying Alive - Bee Gees', file: '/music/staying_alive_bee_gees.mp3' },
    { title: 'Self Esteem - The Offspring', file: '/music/self_asteem_offspring.mp3' },
    { title: 'Smoke On The Water - Deep Purple', file: '/music/smoke_on_water_deep_purple.mp3' },
    { title: 'Somebody To Love - Queen', file: '/music/somebody_2_love_queen.mp3' },
    { title: 'Somebody That I Used To Know - Gotye', file: '/music/somebody_gotye.mp3' },
    { title: 'Sound Of Silence - Simon & Garfunkel', file: '/music/sounds_silece_simon_garfunkle.mp3' },
    { title: 'Stairway To Heaven - Led Zeppelin', file: '/music/stairway_heaven_led_zep.mp3' },
    { title: 'Start A Fire - The Offspring', file: '/music/start_fire_offspring.mp3' },
    { title: 'Star Wars Theme', file: '/music/star_wars.mp3' },
    { title: 'Sgt. Pepper\'s - The Beatles', file: '/music/stg_pepper_beatles.mp3' },
    { title: 'Stuck In The Middle With You - Stealers Wheel', file: '/music/stuck_middle_you_stealers.mp3' },
    { title: 'Sweet Child O\' Mine - Guns N\' Roses', file: '/music/sweet_child_guns_roses.mp3' },
    { title: 'Take Me Out - Franz Ferdinand', file: '/music/take_me_out_franz_ferd.mp3' },
    { title: 'Take On Me - A-ha', file: '/music/take_on_me.mp3' },
    { title: 'Tangled Up In Plaid - QOTSA', file: '/music/tangled_qotsa.mp3' },
    { title: 'The End - The Doors', file: '/music/the_end_doors.mp3' },
    { title: 'The Sign - Ace of Base', file: '/music/the_sign_ace_of_base.mp3' },
    { title: 'The Wanderer - Dion', file: '/music/the_wondered_dion.mp3' },
    { title: 'Thunderstruck - AC/DC', file: '/music/thunderstruck_ac_dc.mp3' },
    { title: 'Time - Pink Floyd', file: '/music/time_pink_floyd.mp3' },
    { title: 'Virtual Insanity - Jamiroquai', file: '/music/virtual_Insanity.mp3' },
    { title: 'Wake Me Up - Avicii', file: '/music/wake_me_up_avicii.mp3' },
    { title: 'All Along The Watchtower - Jimi Hendrix', file: '/music/watchtower_jimi_hendrix.mp3' },
    { title: 'We Are The Champions - Queen', file: '/music/we_are_the_champs.mp3' },
    { title: 'What Is Love - Haddaway', file: '/music/what_is_love.mp3' },
    { title: 'When I Come Around - Green Day', file: '/music/when_come_around_greenday.mp3' }
  ]);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioElementRef = useRef(null);
  const prevThemeRef = useRef('');
  const firstRenderRef = useRef(true);
  
  // Create and set up the audio element with explicit ID
  useEffect(() => {
    console.log('Initializing MusicPlayer...');
    
    // Create audio element with explicit ID
    const audioElement = document.createElement('audio');
    audioElement.id = 'music-player-audio';
    audioElement.preload = 'auto';
    
    // Add it to the document but keep it hidden
    document.body.appendChild(audioElement);
    
    // Store references
    audioRef.current = audioElement;
    audioElementRef.current = audioElement;
    
    // Set up event listeners
    audioRef.current.addEventListener('ended', handleNext);
    
    // Set initial theme reference
    prevThemeRef.current = themeMode;
    
    // Direct event listener for theme changes
    const handleThemeChange = (e) => {
      console.log('Theme change event received:', e.detail.theme);
      if (e.detail.theme === 'futuristic') {
        const randomIndex = selectRandomTrack();
        console.log('Selected random track:', tracks[randomIndex].title);
        
        // Force a slight delay to ensure audio loads properly
        setTimeout(() => {
          if (audioRef.current) {
            console.log('Attempting to play audio...');
            audioRef.current.play()
              .then(() => {
                console.log('Audio playing successfully');
                setIsPlaying(true);
              })
              .catch(err => {
                console.error('Autoplay prevented:', err);
                setIsPlaying(false);
              });
          }
        }, 300);
      }
    };
    
    // Add listener for custom play music event
    const handlePlayMusic = () => {
      console.log('Play music event received');
      if (themeMode === 'futuristic') {
        const randomIndex = selectRandomTrack();
        
        // Ensure audio source is set
        if (audioRef.current) {
          audioRef.current.src = tracks[randomIndex].file;
          audioRef.current.load();
          
          setTimeout(() => {
            console.log('Attempting to play audio from play event...');
            audioRef.current.play()
              .then(() => {
                console.log('Audio playing successfully from play event');
                setIsPlaying(true);
              })
              .catch(err => {
                console.error('Autoplay prevented from play event:', err);
                setIsPlaying(false);
              });
          }, 100);
        }
      }
    };
    
    // Add listener for resume music event (fired when Rick Roll popup is closed)
    const handleResumeMusicPlayback = () => {
      console.log('Resume music playback event received');
      if (themeMode === 'futuristic' && audioRef.current) {
        setIsPlaying(true);
      }
    };
    
    document.addEventListener('themeChange', handleThemeChange);
    document.addEventListener('playMusic', handlePlayMusic);
    document.addEventListener('resumeMusicPlayback', handleResumeMusicPlayback);
    
    // Load initial track
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].file;
      audioRef.current.load();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleNext);
        audioRef.current.pause();
        document.body.removeChild(audioRef.current);
      }
      document.removeEventListener('themeChange', handleThemeChange);
      document.removeEventListener('playMusic', handlePlayMusic);
      document.removeEventListener('resumeMusicPlayback', handleResumeMusicPlayback);
    };
  }, []);
  
  // Select a random track and return its index
  const selectRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    setCurrentTrack(randomIndex);
    return randomIndex;
  };
  
  // Watch for theme changes via context
  useEffect(() => {
    // Skip first render
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    
    console.log('Theme changed via context:', themeMode, 'Previous:', prevThemeRef.current);
    
    if (themeMode === 'futuristic' && prevThemeRef.current === 'standard') {
      console.log('Switching to cyberpunk theme, selecting random track and playing');
      const randomIndex = selectRandomTrack();
      
      // Set the audio source
      if (audioRef.current) {
        audioRef.current.src = tracks[randomIndex].file;
        audioRef.current.load();
        
        // Force a slight delay to ensure audio loads properly
        setTimeout(() => {
          if (audioRef.current) {
            console.log('Attempting to play audio after theme change...');
            audioRef.current.play()
              .then(() => {
                console.log('Audio playing successfully after theme change');
                setIsPlaying(true);
              })
              .catch(err => {
                console.error('Autoplay prevented after theme change:', err);
                setIsPlaying(false);
              });
          }
        }, 300);
      }
    } else if (themeMode === 'standard') {
      // Pause when switching back to standard theme
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    
    prevThemeRef.current = themeMode;
  }, [themeMode]);
  
  // Handle track change
  useEffect(() => {
    if (!audioRef.current) return;
    
    console.log('Track changed to:', tracks[currentTrack].title);
    audioRef.current.src = tracks[currentTrack].file;
    audioRef.current.load();
    
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .catch(e => console.log('Playback error on track change:', e));
        }
      }, 100);
    }
  }, [currentTrack, tracks]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    console.log('Play state changed:', isPlaying);
    
    if (isPlaying) {
      audioRef.current.play()
        .catch(e => {
          console.log('Playback error on play/pause:', e);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  // Toggle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Next track (random)
  const handleNext = () => {
    selectRandomTrack();
  };
  
  // Only show the player in cyberpunk mode
  if (themeMode !== 'futuristic') {
    return null;
  }
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1500, // High z-index but below RickRoll button
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '50px',
        background: 'linear-gradient(45deg, #6200ea, #b620e0)',
        boxShadow: '0 4px 20px rgba(138, 43, 226, 0.6)',
        maxWidth: 'min(400px, calc(100vw - 150px))', // Dynamic width based on viewport
        minWidth: '120px', // Minimum width for controls
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        '&:hover': {
          boxShadow: '0 6px 25px rgba(138, 43, 226, 0.8)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <PlayArrowIcon
        onClick={handlePlayPause}
        sx={{ 
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.8rem',
          flexShrink: 0, // Prevent icon from shrinking
          marginRight: '8px',
          '&:hover': {
            transform: 'scale(1.2)',
            textShadow: '0 0 10px #fff',
          },
          transition: 'all 0.2s',
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </PlayArrowIcon>
      
      <SkipNextIcon 
        onClick={handleNext}
        sx={{ 
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.8rem',
          flexShrink: 0, // Prevent icon from shrinking
          marginRight: '12px',
          '&:hover': {
            transform: 'scale(1.2)',
            textShadow: '0 0 10px #fff',
          },
          transition: 'all 0.2s',
        }}
      />
      
      <Typography 
        variant="body2" 
        noWrap 
        sx={{ 
          color: '#fff',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          letterSpacing: '0.5px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexGrow: 1, // Allow text to take available space
          minWidth: '50px', // Minimum width for very short titles
          paddingRight: '8px',
        }}
      >
        {tracks[currentTrack]?.title || 'No track selected'}
      </Typography>
    </Box>
  );
};

export default MusicPlayer;
