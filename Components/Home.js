import React, {useState, useEffect} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  StatusBar,
  Linking,
  Image,
  Shape,
  Platform
} from 'react-native';

import { Button } from 'react-native-material-ui';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/MaterialIcons';

import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player";

import Share from 'react-native-share'

import * as RNLocalize from "react-native-localize";

import {
  AdMobInterstitial,
} from 'react-native-admob'

const langs = RNLocalize.getLocales();
const avail_langs = new Array('fr', 'en', 'jp');
let current_lang = 'en';

for (let i = 0; i < langs.length; i++) {

  var lang = langs[i];

  if (avail_langs.indexOf(lang.languageCode) != -1) {

    current_lang = lang.languageCode;
    break;
    
  }

}

/* LANG STRINGS ARRAY */
var translate = {
  'fr': {
    'TITLE': 'Radiotaku',
    'SUBTITLE': 'La radio 100% J-POP, J-ROCK, OST !',
    'CURRENT_SONG': 'Musique en diffusion',
    'BUY_CD': 'Acheter le CD',
    'NEXT_SONGS': 'Prochaines musiques',
    'HELP_US': 'Soutenez nous',
    'HELP_US_UTIP': 'Aidez nous sur Utip',
    'SHARE': 'Partager Radiotaku',
  },
  'en': {
    'TITLE': 'Radiotaku',
    'SUBTITLE': 'The radio 100% J-POP, J-ROCK, OST !',
    'CURRENT_SONG': 'Current song',
    'BUY_CD': 'Buy CD',
    'NEXT_SONGS': 'Next songs',
    'HELP_US': 'Help us',
    'HELP_US_UTIP': 'Help us on Utip',
    'SHARE': 'Share Radiotaku',
  },
  'jp': {
    'TITLE': 'ラジオタク',
    'SUBTITLE': 'ラジオ100％J-POP、J-ROCK、OST！',
    'CURRENT_SONG': '現在の歌',
    'BUY_CD': 'CDを購入',
    'NEXT_SONGS': '次の曲',
    'HELP_US': '助けて',
    'HELP_US_UTIP': 'Utipで私たちを助けてください',
    'SHARE': 'ラジオタクを共有',
  }
};

const Home = () => {

  const musicTitleUrl = 'https://radiotaku.net/ajax/get_title.php?json=1';
  const musicCoverUrl = 'https://radiotaku.net/ajax/get_image.php';
  const musicParolesUrl = 'https://radiotaku.net/ajax/get_paroles.php?app=1';
  const musicNextUrl = 'https://radiotaku.net/ajax/get_next.php?app=1';
  const [Data, setData ] = useState();
  const [MusicPlayer, setMusicPlayer ] = useState();
  const shareOptions = {
    title: 'Partager via',
    message: 'Radiotaku : https://radiotaku.net \n\n La radio 100% J-POP, J-ROCK, OST !', 
  };

  // useEffect(()=> {

      

  // } , []);

  useFocusEffect(
    React.useCallback(() => {
  
      /* Actions quand a le focus */
      
      // Creates the player
      TrackPlayer.setupPlayer().then(() => {

        // Adds a track to the queue
        TrackPlayer.add({
            id: 'radiotaku-player',
            url: 'https://radiotaku.net/stream',
            title: 'Radiotaku',
            artist: '',
        });

      });

      /* Pub au lancement */
      AdMobInterstitial.setAdUnitID('ca-app-pub-5013571620129762/7170918286');
      AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
      AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd()).catch(err => {
      });

      TrackPlayer.updateOptions({  
        // An array of capabilities that will show up when the notification is in the compact form on Android
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_STOP,
        ],
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_STOP
        ]
      }).then(() => {

        

      });

      setInterval(() => {

        getMusicTitle();
        
      }, 5000);

      setInterval(() => {

        updateButton();
        
      }, 2000);

      return () => {
        /* Actions quand perte focus */
      };
    }, [])
  );

    function getMusicTitle() {

      fetch(musicTitleUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then( responseJson  => {

        if (Data == undefined) {

          var predata = new Object();
    
        } else {

          var predata = Data;

        }

        predata.MusicTitle = responseJson.Nom;
        predata.MusicTime = responseJson.Duree;
        predata.MusicAchat = responseJson.Achat;

        /* Si musique a changée, on update le cover et les paroles */
        if (predata.MusicTitle != predata.MusicOrigTitle && predata.MusicOrigTitle != '') {

            getMusicCoverLyrics(predata);

        } else {

          setData(predata);

        }     

      });

    }

    function getMusicCoverLyrics(predata) {

      /* On set le titre de la musique en cours */
      predata.MusicOrigTitle = predata.MusicTitle;

      /* On récupère le cover */
      fetch(musicCoverUrl + "?name=" + encodeURI(predata.MusicTitle))
      .then((response) => response.text())
      .then((responseText) => {

        predata.MusicCover = responseText;

        /* On récupère les paroles */
        fetch(musicParolesUrl + "&name=" + encodeURI(predata.MusicTitle))
        .then((response) => response.text())
        .then((responseText) => {
          predata.MusicParoles = responseText;

          /* On récupère les prochaines musiques */
          fetch(musicNextUrl)
          .then((response) => response.text())
          .then((responseText) => {

            predata.MusicNext = responseText;

            setData(predata);

          });

        });

      });

    }

    function redirectAchat() {

      Linking.openURL(Data.MusicAchat);

    }

    function helpUtip() {

      Linking.openURL('https://utip.io/radiotaku');

    }

    function shareWebsite() {

      Share.open(shareOptions)
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });

    }

    async function playPause() {

      var state = await TrackPlayer.getState();

      console.log('state :');
      console.log(state);
  
      if (state == TrackPlayer.STATE_STOPPED || state == TrackPlayer.STATE_PAUSED || state == 'idle' || state == TrackPlayer.STATE_BUFFERING  || state == TrackPlayer.STATE_READY) {
  
        await TrackPlayer.play();
  
      } else if (state == TrackPlayer.STATE_PLAYING) {
  
        await TrackPlayer.stop();
        await TrackPlayer.removeUpcomingTracks();
        await TrackPlayer.add({
          id: 'radiotaku-player',
          url: 'https://radiotaku.net/stream',
          title: 'Radiotaku',
          artist: '',
        });
  
      }
  
      updateButton();
  
    }
  
    async function updateButton() {
  
      if (MusicPlayer !== undefined) {
  
        PreMusicPlayer = MusicPlayer;
  
      } else {
  
        PreMusicPlayer = new Object();
  
      }
  
      var state = await TrackPlayer.getState();
  
      /* Si on vient de faire play */
      if (state == TrackPlayer.STATE_PLAYING) {
  
        PreMusicPlayer.PlayPauseButton = "Pause";
        PreMusicPlayer.PlayPauseButtonIcon = "pause";
  
      } else if (state == TrackPlayer.STATE_STOPPED || state == TrackPlayer.STATE_PAUSED) {
  
        /* Si on vient de faire pause ou stop */
        PreMusicPlayer.PlayPauseButton = "Play";
        PreMusicPlayer.PlayPauseButtonIcon = "play-arrow";
  
      } else {
  
        /* Si autre */
        PreMusicPlayer.PlayPauseButton = "Play";
        PreMusicPlayer.PlayPauseButtonIcon = "play-arrow";
        
      }
  
      setMusicPlayer(PreMusicPlayer);
  
    }

    /* Execution au lancement */
    if (Data == undefined) {

      getMusicTitle();

      updateButton();

    }

    if (MusicPlayer == undefined) {

      PreMusicPlayer = new Object();

      PreMusicPlayer.State = "stopped";
      PreMusicPlayer.PlayPauseButton = "Play";
      PreMusicPlayer.PlayPauseButtonIcon = "play-arrow";
      setMusicPlayer(PreMusicPlayer);

    }
    

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeareaview}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          nestedScrollEnabled = {true}>
          <View style={styles.body}>
            <ImageBackground source={require('../assets/background.png')} style={styles.backgroundImage}>
              <View style={styles.backgroundView}>
                
                <Text style={styles.TitleH1}>
                  {translate[current_lang]['TITLE']}
                </Text>
                <Text style={styles.TitleH2}>
                  {translate[current_lang]['SUBTITLE']}
                </Text>
                <View
                  style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: 1,
                    marginTop: 20,
                    marginBottom: 20,
                    width: '60%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
                <Text style={styles.MusicTitleLabel}>
                  {translate[current_lang]['CURRENT_SONG']} :
                </Text>
                <Text style={styles.MusicTitle}>
                    {(Data == undefined) ? '' : Data.MusicTitle} {(Data == undefined) ? '' : Data.MusicTime}
                </Text>
                <View
                  style={{
                    width: '60%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                {(Data == undefined || Data.MusicAchat == '') ? null : <Button raised primary upperCase={false} icon={<Icon name="music-note" size={25} color="white" />} text={translate[current_lang]['BUY_CD']} onPress={() => redirectAchat()} />}
                </View>

                {(Data == undefined || Data.MusicCover == '' || Data.MusicCover == null || Data.MusicCover == true || Data.MusicCover == false) ? null : <Image 
                style={{
                    flex: 1,
                    width: 250,
                    height: 250,
                    resizeMode: 'contain',
                    marginTop: 15,
                    marginBottom: 15,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                }}
                source={{uri: Data.MusicCover}}
                >
                </Image>}

                <View style={styles.MusicParolesContainer}>
                    <ScrollView nestedScrollEnabled = {true}>
                        <Text style={styles.MusicParoles}>
                            {(Data == undefined) ? '' : Data.MusicParoles}
                        </Text>
                    </ScrollView>
                </View>

                <View style={styles.MusicPlayer}>
                    <Icon.Button name={(MusicPlayer == undefined) ? '' : MusicPlayer.PlayPauseButtonIcon} size={25} onPress={() => playPause()} >
                        {(MusicPlayer == undefined) ? '' : MusicPlayer.PlayPauseButton}
                    </Icon.Button>
                </View>

                <Text style={styles.MusicTitleLabel}>
                  {translate[current_lang]['NEXT_SONGS']} :
                </Text>

                <View style={styles.MusicNextScrollView}>
                    <ScrollView nestedScrollEnabled = {true}>
                      <Text style={styles.MusicNext}>
                        {(Data == undefined) ? '' : Data.MusicNext}
                      </Text>
                    </ScrollView>
                </View>
                
                <View
                  style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    width: '60%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />

                <Text style={styles.MusicTitleLabel}>
                  {translate[current_lang]['HELP_US']} :
                </Text>

                <View
                  style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: 15,
                  }}
                >

                  <Button 
                  raised
                  upperCase={false}
                  style={{container: styles.HelpUtip,
                  text: styles.HelpUtipText}}
                  text={translate[current_lang]['HELP_US_UTIP']}
                  icon={<Icon name="live-tv" size={45} color="white" />}
                  onPress={() => helpUtip()}
                  />

                </View>
                
                <View
                  style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: 15,
                  }}
                >
                
                  <Button 
                  raised
                  upperCase={false}
                  style={{container: styles.ShareBtn,
                  text: styles.ShareBtnText}}
                  text={translate[current_lang]['SHARE']}
                  icon={<Icon name="share" size={45} color="white" />}
                  onPress={() => shareWebsite()}
                  />
                
                </View>
                
              </View>
            </ImageBackground>    
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeareaview: {
    marginTop: Platform.OS === 'ios' ? -20 : 0,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  backgroundView: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  TitleH1: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 60,
  },
  TitleH2: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 20,
  },
  MusicTitleLabel: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 15,
  },
  MusicTitle: {
    color: 'rgba(25, 252, 210, 1)',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
  },
  MusicParolesContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: '80%',
    marginBottom: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 250,
    flex: 1,
  },
  MusicParoles: {
    color: '#ffffff',
    textAlign: 'center',
  },
  MusicPlayer: {
    marginTop: 10,
    marginBottom: 15,
  },
  MusicAdvice: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 15,
  },
  MusicNextScrollView: {
    height: 250,
    marginBottom: 15,
  },
  MusicNext: {
    color: 'rgba(25, 252, 210, 1)',
    textAlign: 'center',
    fontSize: 18,
  },
  HelpUtip: {
    backgroundColor: '#0C6291',
    height: 60,
  },
  HelpUtipText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  ShareBtn: {
    backgroundColor: '#B20D30',
    height: 60,
  },
  ShareBtnText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default Home;