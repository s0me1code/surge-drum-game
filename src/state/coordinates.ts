import { create } from 'zustand';

export interface Coord2D {
    x: number;
    y: number;
}

export interface Coord3D {
    x: number;
    y: number;
    z: number;
}

interface InitBox {
    position: Coord2D;
}

interface InitDirectionalLight {
    position: Coord3D;
    target: Coord3D;
}

interface InitCamera {
    position: Coord3D;
    target: Coord3D;
}

interface State {
    initBox: InitBox;
    setInitBox: (coordTemp: InitBox) => void;
    initDirectionalLight: InitDirectionalLight;
    setInitDirectionalLight: (coordTemp: InitDirectionalLight) => void;
    initCamera: InitCamera;
    setInitCamera: (coordTemp: InitCamera) => void;
    saveCoord: () => void;
}

const useCoord = create<State>((set, get) => {
    let initialCoord = {
        initBox: {
            position: { x: 1.2, y: 3 }
        },
        initDirectionalLight: {
            position: { x: -8, y: 12, z: 13 },
            target: { x: 0, y: 3, z: 0 },
        },
        initCamera : {
            position: { x: 0, y: 3, z: 7 },
            target: { x: 0, y: 3, z: 0 },
        }
    };
    // check localStorage
    // TODO: fix if you added and item it will give and undefined
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
        initDirectionalLight: initialCoord.initDirectionalLight,
        setInitDirectionalLight: (newC: InitDirectionalLight) => {
            set(() => ({
                initDirectionalLight: {
                    ...newC,
                },
            }));
        },
        initCamera: initialCoord.initCamera,
        setInitCamera: (newC: InitCamera) => {
            set(() => ({
                initCamera: {
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

