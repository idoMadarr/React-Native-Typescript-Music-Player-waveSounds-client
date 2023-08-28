import {oauthSignout} from './OAuth';
import store from '../redux/store';
import {resetAuthSlice} from '../redux/slices/authSlice';
import {resetDezeerSlice} from '../redux/slices/deezerSlice';
import {clearStorage} from './asyncStorage';
import {userLogout} from '../redux/actions/authAction';

export const onLogout = async () => {
  oauthSignout();
  await userLogout();
  store.getState().deezerSlice.currentTrack?.stop();
  store.dispatch(resetAuthSlice());
  store.dispatch(resetDezeerSlice());
  clearStorage();
  // socket.disconnect();
};
