import { create } from 'zustand';

interface Position {
    x: number;
    y: number;
}

interface InitBox {
    position: Position;
}

interface State {
    initBox: InitBox;
    setInitBox: (coordTemp: InitBox) => void;
    saveCoord: () => void;
}

const useCoord = create<State>((set, get) => {
    let initialCoord = {
        initBox: {
            position: { x: 1.2, y: 3 }
        },
    };
    // check localStorage
    const storedState = localStorage.getItem('coord');
    if (storedState) {
        try {
            initialCoord = JSON.parse(storedState);
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }
    }
    // set coord
    set(initialCoord);
    return {
        initBox: initialCoord.initBox,
        setInitBox: (newC: InitBox) => {
            set(() => ({
                initBox: {
                    ...newC,
                },
            }));
        },
        saveCoord: () => {
            const state = get();
            const stateJSON = JSON.stringify(state, null, 2);
            localStorage.setItem('coord', stateJSON);
            console.log("State saved to localStorage");
        },
    };
});

export { useCoord };

