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
  Alert,
  Platform
} from 'react-native';

import { Button } from 'react-native-material-ui';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player";

import Icon from 'react-native-vector-icons/MaterialIcons';

import RNFS from 'react-native-fs';

//import localTrack from '../assets/test.mp3';

var PERMISSIONS;
var requestMultiple;

if (Platform.OS === 'android') {

  PERMISSIONS = require('react-native-permissions').PERMISSIONS;
  requestMultiple = require('react-native-permissions').requestMultiple();

}

import * as RNLocalize from "react-native-localize";

/* On défini la langue de l'utilisateur */
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
    'NEXT_SONGS': 'Prochaines musiques',
    'DL_REQUIRED': 'Téléchargement requis',
    'DL_ASK': "Pour profiter de la fonctionnalitée hors ligne, l'application dois télécharger le contenu nécéssaire, cela peut prendre quelques minutes, assurez vous d'être connectés à internet et de posséder au moins 2Go d'espace libre sur votre appareil.",
    'DL_CANCEL': 'Annuler',
    'DL_DOWNLOAD': 'Télécharger',
    'DL_STATE_LAUNCH': 'Lancement du téléchargement des musiques...',
    'DL_STATE_LAUNCH_JINGLES': 'Lancement du téléchargement des jingles...',
    'DL_STATE_RECUP': 'Liste des musiques récupérée, total musiques : \r\n\r\n',
    'DL_STATE_RECUP_JINGLES': 'Liste des jingles récupérée, total jingles : \r\n\r\n',
    'DL_STATE_START_DL': 'Téléchargement de la musique : ',
    'DL_STATE_START_DL_JINGLES': 'Téléchargement du jingle : ',
    'DL_STATE_START_DL_COUNTER': 'Musique ',
    'DL_STATE_START_DL_COUNTER_JINGLES': 'Jingle ',
    'ACTIONS': 'Actions',
    'ACTIONS_UPDATE': 'Mettre à jour les musiques',
    'ACTIONS_RELOAD': 'Effacer les musiques et tout retélécharger',
    'SURE': "C'est votre dernier mot ?",
    'SURE_ASK': "En validant, l'intégralité des musiques, jingles, covers et paroles va être supprimé de votre appareil, puis retéléchargé.\r\nAssurez vous de disposer d'au moins 2Go d'espace disque avant de continuer.",
    'VALIDATE': 'Valider',
    'PLAYLIST_GENERATE': "Génération de la playlist...",
    'ACTIONS_REGEN_PLAYLIST': "Regénérer la playlist",
  },
  'en': {
    'TITLE': 'Radiotaku',
    'SUBTITLE': 'The radio 100% J-POP, J-ROCK, OST !',
    'CURRENT_SONG': 'Current song',
    'NEXT_SONGS': 'Next songs',
    'DL_REQUIRED': 'Download required',
    'DL_ASK': "To take advantage of the offline functionality, the application must download the necessary content, this can take a few minutes, make sure you are connected to the internet and have at least 2GB of free space on your device.",
    'DL_CANCEL': 'Cancel',
    'DL_DOWNLOAD': 'Download',
    'DL_STATE_LAUNCH': 'Launch of songs downloads...',
    'DL_STATE_LAUNCH_JINGLES': 'Launch of jingles downloads...',
    'DL_STATE_RECUP': 'List of songs retrieved, total songs : \r\n\r\n',
    'DL_STATE_RECUP_JINGLES': 'List of jingles retrieved, total jingles : \r\n\r\n',
    'DL_STATE_START_DL': 'Song download : ',
    'DL_STATE_START_DL_JINGLES': 'Jingle download : ',
    'DL_STATE_START_DL_COUNTER': 'Song ',
    'DL_STATE_START_DL_COUNTER_JINGLES': 'Jingle ',
    'ACTIONS': 'Actions',
    'ACTIONS_UPDATE': 'Update songs',
    'ACTIONS_RELOAD': 'Erase songs and redownload everything',
    'SURE': "Are you sure ?",
    'SURE_ASK': "By validating, all of the songs, jingles, covers and lyrics will be deleted from your device, then redownloaded.\r\nMake sure you have at least 2GB of disk space before continuing.",
    'VALIDATE': 'Validate',
    'PLAYLIST_GENERATE': "Playlist generation...",
    'ACTIONS_REGEN_PLAYLIST': "Refresh playlist",
  },
  'jp': {
    'TITLE': 'ラジオタク',
    'SUBTITLE': 'ラジオ100％J-POP、J-ROCK、OST！',
    'CURRENT_SONG': '現在の歌',
    'NEXT_SONGS': '次の曲',
    'DL_REQUIRED': 'ダウンロードが必要です',
    'DL_ASK': "オフライン機能を利用するには、アプリケーションが必要なコンテンツをダウンロードする必要があります。これには数分かかる場合があります。インターネットに接続していて、デバイスに少なくとも2GBの空き容量があることを確認してください。",
    'DL_CANCEL': 'キャンセル',
    'DL_DOWNLOAD': 'ダウンロード',
    'DL_STATE_LAUNCH': '曲のダウンロードの開始...',
    'DL_STATE_LAUNCH_JINGLES': 'ジングルダウンロードの開始...',
    'DL_STATE_RECUP': '取得した曲のリスト、合計曲 : \r\n\r\n',
    'DL_STATE_RECUP_JINGLES': '取得したジングルのリスト、合計ジングル : \r\n\r\n',
    'DL_STATE_START_DL': '曲のダウンロード : ',
    'DL_STATE_START_DL_JINGLES': 'ジングルダウンロード : ',
    'DL_STATE_START_DL_COUNTER': '歌 ',
    'DL_STATE_START_DL_COUNTER_JINGLES': 'ジングル ',
    'ACTIONS': '行動',
    'ACTIONS_UPDATE': '曲を更新する',
    'ACTIONS_RELOAD': '曲を消去してすべてを再ダウンロードする',
    'SURE': "本気ですか ?",
    'SURE_ASK': "検証すると、すべての曲、ジングル、カバー、歌詞がデバイスから削除され、再ダウンロードされます.\r\n続行する前に、少なくとも2GBのディスク容量があることを確認してください.",
    'VALIDATE': '検証',
    'PLAYLIST_GENERATE': "プレイリストの生成...",
    'ACTIONS_REGEN_PLAYLIST': "プレイリストを更新",
  }
};

const Offline = () => {

  const [Data, setData ] = useState();
  const [MusicPlayer, setMusicPlayer ] = useState();
  const musicAllUrl = '';
  const musicCoverUrl = '';
  const musicMP3Url = '';
  const jinglesAllUrl = '';
  let scrollViewRef = null;

  useFocusEffect(
    React.useCallback(() => {
      
      /* Actions quand a le focus */
      TrackPlayer.stop();

      TrackPlayer.removeUpcomingTracks();

      // Creates the player
      TrackPlayer.setupPlayer().then(() => {
      });

      TrackPlayer.updateOptions({  
        // An array of capabilities that will show up when the notification is in the compact form on Android
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_STOP,
        ],
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP
        ]
      });

      checkPerms();

      /**
       * On génère la playlist si ce n'est pas la première fois 
       * que l'onglet est ouvert
      */   

      /* Quand la musique change on update les infos */
      TrackPlayer.addEventListener('playback-track-changed', () => updateMusicInfo(true));

      /* Quand la playlist est finie on la regénère */
      TrackPlayer.addEventListener('playback-queue-ended', () => preGeneratePlaylist());

      setInterval(() => {

        updateButton();
        
      }, 2000);

      return () => {
        /* Actions quand perd le focus */
      };
    }, [])
  );

  function checkPerms(action = "checkSongs", update = false) {

    /* On check les permissions */
    if (Platform.OS == 'android') {

      requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses) => {
            
            if (statuses["android.permission.READ_EXTERNAL_STORAGE"] == "granted" && statuses["android.permission.WRITE_EXTERNAL_STORAGE"] == "granted") {

              if (action == "checkSongs") {

                checkSongs(update);

              } else if (action == "askClearCache") {

                askClearCache();
                
              }
              
              
            }    
          
      });

    } else {

      if (action == "checkSongs") {

        checkSongs(update);

      } else if (action == "askClearCache") {

        askClearCache();
        
      }

    }

  }

  /**
   * Fonction qui permet de mélanger un tableau aléatoirement
   * @param {array} array 
   */
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  /* Fonction qui permet de faire un scrolltotop sur la ScrollView principale */
  async function goToTop() {

    if (scrollViewRef !== null) {

      scrollViewRef.scrollTo({x: 0, y: 0, animated: true});

    }
    
  }

  /**
   * Fonction pratique qui implémente le retry sur fetch, si la requête plante,
   * elle est relancée n fois
   * @param {string} url 
   * @param {object} options 
   * @param {number} n 
   * @returns {promise}
   */
  async function fetch_retry(url, options, n) {
    return fetch(url, options).catch(function(error) {
        if (n === 1) throw error;
        return fetch_retry(url, options, n - 1);
    });
  }

  /**
   * Fonction de mise à jour des infos de la musique en cours de diffusion,
   * la playlist, etc... 
   */
  async function updateMusicInfo(update = false) {

    var musiqueId = await TrackPlayer.getCurrentTrack();
    var musique = await TrackPlayer.getTrack(musiqueId);
    //console.log(musique);
    var musiqueName = encodeIOS(musique.title);
    var musiqueCover = musique.artwork;

    /* On check si le cover existe */
    await RNFS.exists(RNFS.CachesDirectoryPath + '/covers/' + musiqueName + '.txt').then((exist) => {

        if (exist == true && musiqueCover == undefined) {

          /* On update le cover */
          updateCover(musiqueId, musiqueName);

        } else if (exist == false) {

          /* On update les autres infos */
          updateLyrics(musiqueId, musiqueName, '');

        }

      }).then(() => {

        /* Si update == false c'est que c'est la première execution de la fonction */
        if (update == false) {

          /* On lance la musique */
          TrackPlayer.play();

        }
        
    });

  }

  /**
   * Fonction qui va récupérer le cover et l'assigner à la musique en cours +
   * l'afficher dans l'encart prévu
   */
  async function updateCover(musiqueId, musiqueName) {

    await RNFS.readFile(RNFS.CachesDirectoryPath + '/covers/' + musiqueName + '.txt').then((coverBase64) => {
    
      /* On associe l'image à la musique dans la playlist */
      TrackPlayer.updateMetadataForTrack(musiqueId, {
        title: decodeIOS(musiqueName),
        artwork: coverBase64,
      });   

      /* On va récup les lyrics */
      updateLyrics(musiqueId, musiqueName, coverBase64);

    });

  }

  /**
  * Fonction qui va récupérer les lyrics pour l'afficher dans l'encart prévu
  */
  async function updateLyrics(musiqueId, musiqueName, coverBase64) {

    await RNFS.readFile(RNFS.CachesDirectoryPath + '/lyrics/' + musiqueName + '.txt').then((Lyrics) => {  

      /* On va récup la playlist pour afficher les muusiques suivantes */
      updateNext(musiqueId, musiqueName, coverBase64, Lyrics);

    }).catch(err => {

      /* On va récup la playlist pour afficher les muusiques suivantes */
      updateNext(musiqueId, musiqueName, coverBase64, '');

    });

  }

  async function updateNext(musiqueId, musiqueName, coverBase64, Lyrics) {

    /* On récupère la playlist */
    var playlist = await TrackPlayer.getQueue();

    /* On setup notre liste des 10 prochaines musiques */
    var nexts = "";

    /* On setup le compteur */
    var i = -1;

    /* On boucle sur chaque musique */
    playlist.forEach(function(musique, index, array) {

      /* Si on a pas atteint nos 10 musiques et 
      que la musique n'est pas celle en diffusion */
      if (i > -1 && i < 10) {

        /* On check si c'est un jingle */
        if (musique.title.includes("Jingle ")) {

          /* C'est un jingle on fait rien on veut pas voir les jingles dans la liste */

        } else {

          /* C'est bien une musique, on ajoute la musique et on incrémente le compteur */
          if (i == 0) {

            nexts  = (i+1) + ". " + musique.title;

          } else {

            nexts  = nexts + "\r\n\r\n" + (i+1) + ". " + musique.title;

          }
          

          i++;
        }

      } else if (i == -1) {

        i++;
        
      }

    });

    /* On met le cover dans data */
    var predata = getData();

    predata.MusicTitle = decodeIOS(musiqueName);
    predata.MusicCover = coverBase64;
    predata.MusicParoles = Lyrics;
    predata.MusicNext = nexts;
    setData(predata);

  }

  /**
   * Fonction pour récupérer rapidement la variable stateful "Data" ou un objet
   * vide si undefined, elle est en async car sinon dans certains cas elle bloque
   * le rerender lorsque le setState est fait
   */
  async function getData() {

    if (Data == undefined) {

      var predata = new Object();
      predata.MusicTitle = '';
      predata.MusicAchat = '';
      predata.MusicParoles = '';
      predata.MusicCover = '';
      predata.MusicNext = '';
      predata.Playlist = [];

    } else {

      var predata = Data;

    }

    return predata;

  }

  /**
   * Fonction qui récupère les musiques et jingles installés avant 
   * de générer la playlist
  */
  async function preGeneratePlaylist() {

    var predata = getData();

    predata.DLState = translate[current_lang]['PLAYLIST_GENERATE'];
    setData(predata);

    /* On récup la liste des jingles déjà installées */
    await RNFS.readdir(RNFS.CachesDirectoryPath + '/jingles').then((jinglesInstall) => {

      /* On récup la liste des musiques déjà installées */
      RNFS.readdir(RNFS.CachesDirectoryPath + '/songs').then((musiquesInstall) => {

        if (musiquesInstall == undefined || musiquesInstall == []) {


        } else {

          /* On va générer la playlist */
          generatePlaylist(musiquesInstall, jinglesInstall);

        }
        

      });

    }).catch(err => {
      /* Musiques pas encore dl on fait rien */
    });
    
  }

  /**
   * Fonction qui va générer la playlist aléatoirement en intercalant toutes les
   * 2 chansons un jingle au hasard
   * @param {array} musiques Tableau des musiques installées
   * @param {array} jingles Tableau des jingles installés
   */
  async function generatePlaylist(musiques, jingles) {

    /* On mélange les musiques */
    shuffle(musiques);

    /* On cut pour n'avoir que les 50 premières (moins lourd) */
    musiques = musiques.slice(0, 50);

    var i = 0;
    var id_musique = 0;
    
    if (Platform.OS === 'android') {

      var filePrefix = 'file://';

    } else {

      var filePrefix = 'file://';

    }

    //var localTrack = filePrefix + RNFS.CachesDirectoryPath + '/songs/test-file.mp3';

    /* On boucle sur chaque musique */
    await musiques.forEach(function(musique, index, array) {

      musiqueName = musique.replace(".mp3", ""); 

      /* Le cas échéant on intervale un jingle au hasard */
      if (i == 2) {

        /* On mélange les jingles */
        shuffle(jingles);

        var jingle = jingles[0];
        jingle = jingle.replace(".mp3", ""); 

        /* On ajoute un jingle à la playlist */
        //console.log(id_musique + ' - Jingle : ' + jingle);
        TrackPlayer.add({
          id: id_musique,
          url: filePrefix + RNFS.CachesDirectoryPath + '/jingles/' + encodeURI(jingle) + '.mp3',
          //url: encodeURI(localTrack),
          title: decodeIOS(jingle),
          artist: '',
        });
        
        /* Reset compteur de jingles */
        i = 0;
        id_musique++;
      }

      /* On ajoute la musique à la playlist */
      console.log(filePrefix + RNFS.CachesDirectoryPath + '/songs/' + musiqueName + '.mp3');
      TrackPlayer.add({
        id: id_musique,
        url: filePrefix + RNFS.CachesDirectoryPath + '/songs/' + encodeURI(musiqueName) + '.mp3',
        //url: encodeURI(localTrack),
        title: decodeIOS(musiqueName),
        artist: '',
      }).catch(err => {
        console.log(err);
      });

      i++;
      id_musique++;
      
    });

    var predata = getData();

    predata.DLState = '';
    setData(predata);

    /* On met à jour l'affichage des infos de la musique en cours */
    updateMusicInfo();   

  }

  /**
   * Fonction qui demande à l'utilisateur si il est sûr de vouloir clear les musiques
   * et autres données, utile pour éviter le missclick
   */
  function askClearCache() {

    Alert.alert(
      translate[current_lang]['SURE'],
      translate[current_lang]['SURE_ASK'],
      [
        {
          text: translate[current_lang]['DL_CANCEL'],
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: translate[current_lang]['VALIDATE'], onPress: () => clearCache() }
      ],
      { cancelable: false }
    );

  }

  /**
   * Fonction qui vide le cache avant de relancer le téléchargement
   * de toutes les musiques, jingles, covers et lyrics
   */
  async function clearCache() {

    /* On remonte en haut de page */
    await goToTop();

    /* On vide les musiques */
    await RNFS.unlink(RNFS.CachesDirectoryPath + '/songs').then(() => {
    }).catch(err => {
    });

    /* On vide les jingles */
    await RNFS.unlink(RNFS.CachesDirectoryPath + '/jingles').then(() => {
    }).catch(err => {
    });

    /* On vide les covers */
    await RNFS.unlink(RNFS.CachesDirectoryPath + '/covers').then(() => {
    }).catch(err => {
    });

    /* On vide les lyrics */
    await RNFS.unlink(RNFS.CachesDirectoryPath + '/lyrics').then(() => {
    }).catch(err => {
    });

    checkSongs(false, true);

  }

  /**
   * Check si des musiques sont présente, si non lance la fonction launchDownload()
   * avec ou sans le param update
   * @param {boolean} update Défini si on fait une mise à jour des musiques
   */
  async function checkSongs(update = false, bypass = false) {

    /* On remonte en haut de page */
    await goToTop();

    /* Si le dossier songs n'existe pas */
    await RNFS.exists(RNFS.CachesDirectoryPath + '/songs').then((exist) => {
      
      /* Si tableau vide c'est qu'il n'y a pas de musiques */
      if (exist == false) {
        /* Si pas de bypass, on affiche l'alerte avant de download */
        if (bypass == false) {

          /* On propose a l'utilisateur de télécharger les musiques */
          Alert.alert(
            translate[current_lang]['DL_REQUIRED'],
            translate[current_lang]['DL_ASK'],
            [
              {
                text: translate[current_lang]['DL_CANCEL'],
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: translate[current_lang]['DL_DOWNLOAD'], onPress: () => launchDownload() }
            ],
            { cancelable: false }
          );

        } else if (bypass == true) {

          /* Si bypass, on n'affiche pas l'alerte, on execute le download direct */
          launchDownload();

        }

      } else if (exist == true && update == true) {

        /* Il existe donc on update */
        launchDownload(true);

      } else if (exist == true && update == false) {
        
        preGeneratePlaylist();

      }
      
    });

  }

  /**
   * Check les musiques installées lors d'un update
   * @param {Object} musiques Liste des musiques en ligne
   */
  async function checkSongsInstalled(musiques) {

    var predata = getData();

    var countMusiques = musiques.length;

    /* On récup la liste des musiques déjà installées */
    await RNFS.readdir(RNFS.CachesDirectoryPath + '/songs').then((musiquesInstall) => {   

      /* On boucle sur les musiques en ligne pour checker celles à traiter */
      for(var k = musiques.length -1; k >= 0 ; k--){

        /* On check si la musique en ligne existe en local */
        if (musiquesInstall.indexOf(musiques[k]['nom'] + '.mp3') > 0) {

          /* Elle existe on la retire du tableau de musiques à traiter */
          musiques.splice(k, 1);

        }

      }

    });

    countMusiques = musiques.length;
    
    /* On dit qu'on a récup la liste */
    predata.DLState = translate[current_lang]['DL_STATE_RECUP'] + countMusiques;
    setData(predata);
    
    /* On traite la liste */
    extractDatas(musiques, true);
    

  }

    /**
   * Check les musiques installées lors d'un update
   * @param {Object} musiques Liste des musiques en ligne
   */
  async function checkJinglesInstalled(jingles) {

    var predata = getData();

    var countJingles = jingles.length;

    /* On récup la liste des jingles déjà installées */
    await RNFS.readdir(RNFS.CachesDirectoryPath + '/jingles').then((jinglesInstall) => {

      /* On boucle sur les jingles en ligne pour checker ceux à traiter */
      for(var k = jingles.length -1; k >= 0 ; k--){

        /* On check si le jingle en ligne existe en local */
        if (jinglesInstall.indexOf(jingles[k]['nom'] + '.mp3') > 0) {

          /* Elle existe on la retire du tableau de jingles à traiter */
          jingles.splice(k, 1);

        }

      }

    });

    countJingles = jingles.length;

    /* On dit qu'on a récup la liste */
    predata.DLState = translate[current_lang]['DL_STATE_RECUP_JINGLES'] + countJingles;
    setData(predata);
    
    /* On traite la liste */
    extractDatasJingles(jingles, true);
    

  }

  /**
   * Lance le téléchargement des musiques, des covers et des paroles
   * @param {boolean} update Défini si on fait une mise à jour des musiques
   */
  async function launchDownload(update = false) {

    var predata = getData();

    predata.DLState = translate[current_lang]['DL_STATE_LAUNCH'];
    setData(predata);

    if (update == false) {

      /* On crée les dossiers dans le cache */
      await RNFS.mkdir(RNFS.CachesDirectoryPath + '/songs').then(() => {
      });

      await RNFS.mkdir(RNFS.CachesDirectoryPath + '/covers').then(() => {
      });

      await RNFS.mkdir(RNFS.CachesDirectoryPath + '/lyrics').then(() => {
      });

      RNFS.mkdir(RNFS.CachesDirectoryPath + '/jingles').then(() => {
      });

      /* Récupération liste musiques */
      await fetch_retry(musicAllUrl, null, 5)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then( responseJson  => {

          var musiques = responseJson;

          var predata = getData();

          var countMusiques = musiques.length;

          /* On dit qu'on a récup la liste */
          predata.DLState = translate[current_lang]['DL_STATE_RECUP'] + countMusiques;
          setData(predata);

          /* On traite la liste */
          extractDatas(musiques, false);

        });

    } else {

      /* Récupération liste musiques */
      await fetch_retry(musicAllUrl, null, 5)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then( responseJson  => {

          var musiques = responseJson;

          checkSongsInstalled(musiques);

        });

    }

  }

  /**
   * Lance le téléchargement des jingles
   * @param {boolean} update Défini si on fait une mise à jour
   */
  async function launchDownloadJingles(update = false) {

    var predata = getData();
    predata.DLState = translate[current_lang]['DL_STATE_LAUNCH_JINGLES'];
    setData(predata);

    if (update == false) {

      /* Récupération liste jingles */
      await fetch_retry(jinglesAllUrl, null, 5)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then( responseJson  => {

          var jingles = responseJson;

          var predata = getData();

          var countJingles = jingles.length;

          /* On dit qu'on a récup la liste */
          predata.DLState = translate[current_lang]['DL_STATE_RECUP_JINGLES'] + countJingles;
          setData(predata);

          /* On traite la liste */
          extractDatasJingles(jingles, false);

        });

    } else {

      /* Récupération liste jingles */
      await fetch_retry(jinglesAllUrl, null, 5)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then( responseJson  => {

          var jingles = responseJson;

          checkJinglesInstalled(jingles);

        });

    }

  }

  /** 
   * Traitement de la liste de musiques et extraction des données
   * @param {Object} musiques Liste des musiques en ligne
   * @param {boolean} update Défini si on fait une mise à jour des musiques
   **/
  async function extractDatas(musiques, update) {

    var countMusiques = musiques.length;

    if (countMusiques > 0) {

      var i = 1;

      /* On boucle sur chaque musique */
      for (var k in musiques) {

        var musiqueName = musiques[k]['nom'];
        var musiqueParoles = musiques[k]['lyrics'];

        var predata = getData();

        predata.DLState = translate[current_lang]['DL_STATE_START_DL'] + "\r\n\r\n" + musiqueName + "\r\n\r\n" + translate[current_lang]['DL_STATE_START_DL_COUNTER'] + i + "/" + countMusiques;
        setData(predata);

        /* On stocke les paroles dans un fichier en cache */
        await RNFS.writeFile(RNFS.CachesDirectoryPath + '/lyrics/' + encodeIOS(musiqueName) + '.txt', musiqueParoles).then(() => {
        });

        /* On choppe le cover */
        await fetch_retry(musicCoverUrl + "?name=" + encodeURI(musiqueName), null, 5)
        .then((response) => response.text())
        .then((coverBase64) => {

          /* On stocke le cover en base64 dans un fichier en cache */
          RNFS.writeFile(RNFS.CachesDirectoryPath + '/covers/' + encodeIOS(musiqueName) + '.txt', coverBase64).then(() => {
          });

        });

        /* On télécharge le mp3 */
        await RNFS.downloadFile({
          fromUrl: musicMP3Url + "&name=" + encodeURI(musiqueName),
          toFile: RNFS.CachesDirectoryPath + '/songs/' + encodeIOS(musiqueName) + '.mp3',
          connectionTimeout: 12000,
          readTimeout: 12000,
        }).promise.then((r) => {
        }).catch(err => {
        });

        i++;
      }

    }

    launchDownloadJingles(update);

  }

  function encodeIOS(string) {

    if (Platform.OS === 'android') {

      return string;

    } else {

      return string.split(' ').join('_').split('[').join('leftcr').split(']').join('rightcr').split('(').join('leftpar').split(')').join('rightpar').split('!').join('exclp').split("'").join('apost').split("~").join('tilde');

    }
    
  }

  function decodeIOS(string) {

    if (Platform.OS === 'android') {

      return string;

    } else {

      return string.split('_').join(' ').split('leftcr').join('[').split('rightcr').join(']').split('leftpar').join('(').split('rightpar').join(')').split('exclp').join('!').split('apost').join("'").split("tilde").join('~');

    }
    
  }

  /** 
   * Traitement de la liste de jingles et extraction des données
   * @param {Object} musiques Liste des jingles en ligne
   * @param {boolean} update Défini si on fait une mise à jour
   **/
  async function extractDatasJingles(jingles, update) {

    var countJingles = jingles.length;

    if (countJingles > 0) {

      var i = 1;

      /* On boucle sur chaque jingle */
      for (var k in jingles) {

        var jingleName = jingles[k]['nom'];

        var predata = getData();

        predata.DLState = translate[current_lang]['DL_STATE_START_DL_JINGLES'] + "\r\n\r\n" + jingleName + "\r\n\r\n" + translate[current_lang]['DL_STATE_START_DL_COUNTER_JINGLES'] + i + "/" + countJingles;
        setData(predata);

        /* On télécharge le mp3 */
        await RNFS.downloadFile({
          fromUrl: musicMP3Url + "&jingle=1&name=" + encodeURI(jingleName),
          toFile: RNFS.CachesDirectoryPath + '/jingles/' + encodeIOS(jingleName) + '.mp3',
          connectionTimeout: 12000,
          readTimeout: 12000,
        }).promise.then((r) => {
        }).catch(err => {
        });

        i++;
      }

    }

    /* Téléchargement terminé, on efface le texte de statut */
    var predata = getData();
    predata.DLState = '';
    setData(predata);

    preGeneratePlaylist();

  }

  async function playPause() {

    var state = await TrackPlayer.getState();

    if (state !== TrackPlayer.STATE_PLAYING) {

      TrackPlayer.play();

    } else if (state == TrackPlayer.STATE_PLAYING) {

      TrackPlayer.pause();

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

    //console.log(state);

    /* Si on vient de faire play */
    if (state == TrackPlayer.STATE_PLAYING) {

      PreMusicPlayer.PlayPauseButton = "Pause";
      PreMusicPlayer.PlayPauseButtonIcon = "pause";

    } else if (state == TrackPlayer.STATE_STOPPED || state == TrackPlayer.STATE_PAUSED || state == TrackPlayer.STATE_BUFFERING) {

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

  /* Fonction pour regen la playlist au clic sur le bouton */
  async function regenPlaylist() {

    await goToTop();

    var predata = getData();

    predata.DLState = translate[current_lang]['PLAYLIST_GENERATE'];
    setData(predata);

    await TrackPlayer.stop();

    await TrackPlayer.removeUpcomingTracks();

    await TrackPlayer.setupPlayer().then(() => {

      TrackPlayer.updateOptions({  
        // An array of capabilities that will show up when the notification is in the compact form on Android
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_STOP,
        ],
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP
        ]
      });

    });

    /* On récup la liste des jingles déjà installées */
    await RNFS.readdir(RNFS.CachesDirectoryPath + '/jingles').then((jinglesInstall) => {

      /* On récup la liste des musiques déjà installées */
      RNFS.readdir(RNFS.CachesDirectoryPath + '/songs').then((musiquesInstall) => {

        if (musiquesInstall == undefined || musiquesInstall == []) {


        } else {

          /* On va générer la playlist */
          generatePlaylist(musiquesInstall, jinglesInstall);

        }
        

      });

    }).catch(err => {
      /* Musiques pas encore dl on fait rien */
    });

  }

  /* Execution au lancement */
  if (Data == undefined) {

    /* On setup les infos avec des données vides pour éviter les erreurs de rendu */
    var predata = getData();
    setData(predata);

    updateButton();

  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeareaview}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          ref={(scrollview) => { scrollViewRef = scrollview; }}>
          
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
                    {(Data == undefined) ? '' : Data.MusicTitle}
                </Text>

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
                            {(Data == undefined) ? '' : Data.DLState}
                        </Text>
                    </ScrollView>
                </View>

                <View style={styles.MusicPlayer}>
                    <Icon.Button name={(MusicPlayer == undefined) ? 'play-arrow' : MusicPlayer.PlayPauseButtonIcon} size={25} onPress={() => playPause()} >
                        {(MusicPlayer == undefined) ? 'Play' : MusicPlayer.PlayPauseButton}
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
                  {translate[current_lang]['ACTIONS']} :
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
                  style={{container: styles.ActionRegenPlaylist,
                  text: styles.ActionRegenPlaylistText}}
                  text={translate[current_lang]['ACTIONS_REGEN_PLAYLIST']}
                  icon={<Icon name="playlist-play" size={45} color="white" />}
                  onPress={() => regenPlaylist()}
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
                  style={{container: styles.ActionUpdate,
                  text: styles.ActionUpdateText}}
                  text={translate[current_lang]['ACTIONS_UPDATE']}
                  icon={<Icon name="update" size={45} color="white" />}
                  onPress={() => checkPerms("checkSongs", true)}
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
                  style={{container: styles.ActionReload,
                  text: styles.ActionReloadText}}
                  text={translate[current_lang]['ACTIONS_RELOAD']}
                  icon={<Icon name="system-update" size={45} color="white" style={styles.ActionReloadIcon} />}
                  onPress={() => checkPerms('askClearCache')}
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
    backgroundColor: Colors.grey,
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
  ActionRegenPlaylist: {
    backgroundColor: '#0C6291',
    height: 60,
  },
  ActionRegenPlaylistText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  ActionUpdate: {
    backgroundColor: '#13293D',
    height: 60,
  },
  ActionUpdateText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  ActionReload: {
    backgroundColor: '#B20D30',
    height: 60,
  },
  ActionReloadText: {
    color: '#FFFFFF',
    marginLeft: 0,
    textAlign: 'center',
  },
  ActionReloadIcon: {
    // marginRight: -40,
    // marginLeft: 40,
  },
});

export default Offline;