import {createSlice} from '@reduxjs/toolkit';
import {
  UserType,
  TrackType,
  ConnectedOnlineType,
  ChatMessageType,
  ChatDictType,
} from '../../types/Types';

interface RootStateApp {
  isAuth: boolean;
  user: UserType | null;
  onlines: ConnectedOnlineType[];
  currentRecipient: ConnectedOnlineType | null;
  chatDict: ChatDictType;
  chainChat: ChatMessageType[];
  favoritesList: TrackType[];
  favoritesObj: Object;
  shareMode: Object | null;
  isUpdate: boolean;
  modalMessage: any | null;
  microphonePermission: boolean;
  loading: boolean;
}

const initialState: RootStateApp = {
  isAuth: false,
  user: null,
  onlines: [],
  currentRecipient: null,
  chatDict: {},
  chainChat: [],
  favoritesList: [],
  favoritesObj: {},
  shareMode: null,
  isUpdate: false,
  modalMessage: null,
  microphonePermission: false,
  loading: false,
};

export const authSlice = createSlice({
  name: 'deezer',
  initialState,
  reducers: {
    setAuthentication: (state, action) => {
      state.isAuth = true;
      state.user = action.payload;
      state.loading = false;
    },
    setOnlines: (state, action) => {
      state.onlines = action.payload;
      state.loading = false;
    },
    updateOnline: (state, action) => {
      const method = action.payload.type;
      const currentUser = action.payload.user;

      if (method === 'add') {
        state.onlines.push(currentUser);
        return;
      }

      if (method === 'update') {
        const updateOnlines = state.onlines.map(online => {
          if (online.id === currentUser.id) {
            return {...online, socketId: currentUser.socketId};
          }
          return online;
        });

        state.onlines = updateOnlines;
        return;
      }

      if (method === 'remove') {
        state.onlines = state.onlines.filter(
          user => user.email !== currentUser.email,
        );
      }
    },
    setCurrentRecipient: (state, action) => {
      state.currentRecipient = action.payload;
    },
    updateChainChat: (state, action) => {
      const userA = action.payload.userA;
      const userB = action.payload.userB;

      const chainId = (userA + userB).split('').sort().join('');

      if (state.chatDict[chainId]) {
        state.chatDict[chainId].push(action.payload);
        return;
      }
      state.chatDict[chainId] = [action.payload];
    },
    resetAuthSlice: state => {
      state.isAuth = false;
      state.user = null;
    },
    setFavorites: (state, action) => {
      state.favoritesList = action.payload.favoriteArray;
      state.favoritesObj = action.payload.favoritesObject;
    },
    newFavorite: (state, action) => {
      state.favoritesList.unshift(action.payload);
      state.favoritesObj = {
        ...state.favoritesObj,
        [action.payload.id]: action.payload,
      };
      state.loading = false;
    },
    updateFavorites: (state, action) => {
      state.favoritesList = state.favoritesList.filter(
        favorite => favorite.id !== action.payload,
      );
    },
    setShareMode: (state, action) => {
      state.shareMode = action.payload;
    },
    setUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setModalMessage: (state, action) => {
      state.modalMessage = action.payload;
    },
    setMicrophonePermission: (state, action) => {
      state.microphonePermission = action.payload;
    },
    toggleSpinner: state => {
      state.loading = !state.loading;
    },
  },
});

export const {
  setAuthentication,
  setCurrentRecipient,
  setOnlines,
  updateOnline,
  updateChainChat,
  resetAuthSlice,
  setFavorites,
  newFavorite,
  updateFavorites,
  setShareMode,
  setUpdate,
  setModalMessage,
  setMicrophonePermission,
  toggleSpinner,
} = authSlice.actions;

export default authSlice.reducer;
