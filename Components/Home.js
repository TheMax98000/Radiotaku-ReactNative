import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  StatusBar,
  Button,
  Linking,
  Image,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { Player, MediaStates } from '@react-native-community/audio-toolkit';
 
const Home = () => {

  const musicTitleUrl = 'https://radiotaku.net/ajax/get_title.php?json=1';
  const musicCoverUrl = 'https://radiotaku.net/ajax/get_image.php';
  const musicParolesUrl = 'https://radiotaku.net/ajax/get_paroles.php?app=1';
  const [Data, setData ] = useState();
  let playPauseButton = 'Play';
  let playPauseButtonIcon = 'play-arrow'; /* ou 'stop' */

  useEffect(()=>{

    setInterval(() => {

      getMusicTitle();
      
    }, 5000);

  } , []);

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

          setData(predata);

        });

      });

    }

    function redirectAchat() {

      Linking.openURL(Data.musicAchat);

    }

    /* Execution au lancement */
    getMusicTitle();
    

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          nestedScrollEnabled = {true}>
          <View style={styles.body}>
            <ImageBackground source={require('../assets/background.png')} style={styles.backgroundImage}>
              <View style={styles.backgroundView}>
                <Text style={styles.TitleH1}>
                  Radiotaku
                </Text>
                <Text style={styles.TitleH2}>
                  La radio 100% J-POP, J-ROCK, OST !
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
                    Musique en diffusion :
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
                {(Data == undefined || Data.MusicAchat == '') ? null : <Icon.Button name="music-note" size={25} onPress={() => redirectAchat()}> Acheter le CD</Icon.Button>}
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
                    <Icon.Button name={playPauseButtonIcon} size={25} onPress={() => playPause()} >
                        {playPauseButton}
                    </Icon.Button>
                </View>

                <Text style={{color: '#ffffff'}}>
                  Duis nostrud sunt esse velit est voluptate veniam. In sunt nisi officia dolor anim voluptate voluptate occaecat qui. Laborum elit qui ex ad esse deserunt laborum qui fugiat sit enim non ullamco minim. Ut aliquip cillum irure eiusmod occaecat officia culpa qui.

                  Sint tempor cupidatat et labore cillum proident dolor proident incididunt. Labore nostrud elit in officia dolor do. Magna qui est velit Lorem esse. Eiusmod cillum consequat adipisicing adipisicing sunt cupidatat mollit anim occaecat ea et consequat irure.

                  Qui ipsum mollit ipsum laborum ullamco adipisicing sit occaecat anim voluptate enim. Dolor excepteur amet consequat Lorem. Ad adipisicing adipisicing cupidatat adipisicing laboris exercitation. Nulla anim id quis in. Do voluptate nostrud occaecat velit voluptate anim velit adipisicing anim sunt minim mollit ipsum.

                  Deserunt cillum ad exercitation voluptate. Non voluptate et amet duis sunt est id id. Cupidatat nisi deserunt tempor nisi ipsum anim velit tempor velit qui. Mollit qui minim adipisicing cillum excepteur minim nulla cillum. Culpa sint deserunt cillum mollit do adipisicing. Officia cupidatat deserunt fugiat fugiat.

                  Exercitation nulla mollit aliqua Lorem esse sit pariatur sint ex voluptate deserunt. Dolore ullamco non deserunt labore cupidatat. Anim dolore id anim elit cillum sit tempor officia Lorem elit magna voluptate deserunt. Labore ullamco velit commodo amet occaecat incididunt ipsum veniam laboris culpa eu elit incididunt. Fugiat reprehenderit qui fugiat dolor Lorem tempor ullamco. Veniam qui enim cupidatat duis non ea velit. Nulla velit exercitation nulla consectetur.

                  Nostrud anim est est sit duis magna aliquip duis excepteur magna tempor. Adipisicing consectetur proident aliqua cillum culpa sit eu eu adipisicing nisi exercitation. Aliquip non est nisi in. Sunt tempor ut quis id. Magna exercitation sunt ea eu sint labore est sint aute consectetur voluptate amet irure labore.
                </Text>
              </View>
            </ImageBackground>    
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default Home;