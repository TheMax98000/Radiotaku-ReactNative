import TrackPlayer from 'react-native-track-player';

import Platform from 'react-native';

module.exports = async function() {
    // This service needs to be registered for the module to work
    // but it will be used later in the "Receiving Events" section
    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    if (Platform.OS === 'android') {
        
        TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    } else {

        TrackPlayer.addEventListener('remote-pause', () => {

            if (TrackPlayer !== null) {

                TrackPlayer.getCurrentTrack().then((trackid) => {
                    
                    if (trackid == 'radiotaku-player') {

                        TrackPlayer.stop().then(() => {
                           
                            TrackPlayer.removeUpcomingTracks().then(() => {

                                TrackPlayer.add({
                                    id: 'radiotaku-player',
                                    url: 'https://radiotaku.net/stream',
                                    title: 'Radiotaku',
                                    artist: '',
                                });

                            });        
                        });

                    } else {

                        TrackPlayer.pause();

                    }

                });

            }

        });

    }

    TrackPlayer.addEventListener('remote-stop', () => {
        TrackPlayer.destroy()
    });

    setInterval(() => {

        if (TrackPlayer !== null) {

            TrackPlayer.getCurrentTrack().then((trackid) => {
                
                if (trackid == 'radiotaku-player') {

                    if (TrackPlayer.getState() != TrackPlayer.STATE_NONE) {

                        fetch('https://radiotaku.net/ajax/get_title.php?json=1')
                        .then((response) => response.json())
                        .then((responseJson) => {
                            return responseJson;
                        })
                        .then( responseJson  => {
                
                            TrackPlayer.updateMetadataForTrack('radiotaku-player', {
                                title: responseJson.Nom,
                            });   
                
                        });

                    }

                }
                
            });

            

        }
        
        
    }, 5000);
}