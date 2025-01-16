import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from '../features/kanbanSlice';
import { loadState, saveState } from "./localstorage";

const persistedState = loadState();

const store = configureStore( {
    
    reducer: {
        kanban: kanbanReducer,
    },
    preloadedState: persistedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

export default store;