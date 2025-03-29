# Cyberpunk Theme Music

This folder contains MP3 files for the cyberpunk theme music player in the PartiVotes application.

## How to Add Music Files

1. Upload your MP3 files to this directory (`public/music/`)
2. The music player will automatically detect and play files with the following naming convention:
   - `cyberpunk-theme.mp3`
   - `night-city.mp3`
   - `digital-dreams.mp3`

## Custom Music Configuration

If you want to add custom music files with different names, you'll need to update the track list in the `MusicPlayer.jsx` component:

1. Open `/src/components/music/MusicPlayer.jsx`
2. Find the `useEffect` hook that loads the tracks (around line 30)
3. Update the `availableTracks` array with your custom track information:

```javascript
const availableTracks = [
  { id: 1, title: 'Your Custom Title', file: '/music/your-custom-file.mp3' },
  // Add more tracks as needed
];
```

## Notes

- For optimal performance, use MP3 files with reasonable file sizes (under 10MB per track)
- The music player will only be visible when the cyberpunk theme is active
- Music playback state is not persisted between page refreshes
