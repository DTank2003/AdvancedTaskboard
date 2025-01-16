export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('kanbanState', serializedState);
    } catch (e) {
        console.error(e);
    }
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('kanbanState');
        if(serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch(e) {
        console.error('Failed to load state from local', e);
        return undefined;
    }
}
