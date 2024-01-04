import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import Analytics from 'appcenter-analytics';
import {fetchSerchResults} from '../redux/actions/deezerActions';
import {setSearchResults} from '../redux/slices/deezerSlice';
import LinearGradient from 'react-native-linear-gradient';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import Colors from '../assets/design/palette.json';
import {TrackType} from '../types/Types';
import Lottie from 'lottie-react-native';
import {FloatingPlayerInstance} from '../models/FloatingPlayerInstance';
import {PropDimensions} from '../dimensions/dimensions';
import {initSoundTrack} from '../utils/soundTracker';
import {useVoiceRecognition} from '../utils/useVoiceRecognition';

// Components
import StatusBarElement from '../components/resuable/StatusBarElement';
import SearchHeader from '../components/SearchPartials/SearchHeader';
import SearchItem from '../components/SearchPartials/SearchItem';

const DEFAULT_SEARCH = 'Post malone';

const SearchScreen = () => {
  const {state, startRecognizing, stopRecognizing} = useVoiceRecognition();

  const searchResults = useAppSelector(
    state => state.deezerSlice.searchResults,
  );
  const username = useAppSelector(state => state.authSlice.user.username);

  const [searchState, setSearchState] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    updateSearch(DEFAULT_SEARCH);
  }, []);

  useEffect(() => {
    if (state.results?.length) {
      updateSearch(state.results![0]);
    }
  }, [state.results]);

  const updateSearch = async (value: string) => {
    if (value === '') return;
    const results = await dispatch(fetchSerchResults(value));
    // Tracking event through appcenter about user search value
    Analytics.trackEvent(`serach-${username}`, {key: value});
    if (results) {
      dispatch(setSearchResults(results));
    }
  };

  const debounce = (func: Function) => {
    let timer: any;
    return (args: string) => {
      setSearchState(args);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func(args);
      }, 500);
    };
  };

  const optimizeSearchFunc = useCallback(debounce(updateSearch), []);

  const playSoundTrack = useCallback((item: TrackType) => {
    const {id, title, artist, preview, image} = item;

    const createFloatingTrack = new FloatingPlayerInstance(
      id,
      title,
      artist,
      image,
      preview!,
    );

    initSoundTrack(preview!, searchResults, createFloatingTrack);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.primary}
      />
      <LinearGradient
        style={styles.main}
        colors={[Colors.primary, Colors['primary-shadow'], Colors.primary]}>
        <SearchHeader
          isRecording={state.isRecording}
          startRecognizing={startRecognizing}
          stopRecognizing={stopRecognizing}
          optimizeSearchFunc={optimizeSearchFunc}
          searchState={searchState}
        />
        {state.isRecording && (
          <Lottie
            source={require('../assets/lottie/recording.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
        {searchResults.length > 1 && !state.isRecording && (
          <FlatList
            keyExtractor={itemData => itemData.id.toString()}
            data={searchResults}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={5}
            removeClippedSubviews={true}
            renderItem={({item, index}) => (
              <SearchItem
                title={item.title}
                artist={item.artist}
                image={item.image}
                index={index}
                playSoundTrack={playSoundTrack.bind(this, item)}
              />
            )}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContainer: {
    width: PropDimensions.favoriteWidth,
  },
  main: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  lottie: {
    position: 'absolute',
    top: '45%',
    height: Dimensions.get('window').width * 0.25,
    width: Dimensions.get('window').width * 0.25,
  },
});

export default SearchScreen;
