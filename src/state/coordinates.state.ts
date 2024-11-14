import { create } from 'zustand';
import { Coord2D, Coord3D } from '../types';

type IBox = {
    position: Coord2D;
}

type IDirectionalLight = {
    position: Coord3D;
    target: Coord3D;
}

type ICamera = {
    position: Coord3D;
    target: Coord3D;
}

type State = {
    box: IBox;
    setBox: (coordTemp: IBox) => void;
    directionalLight: IDirectionalLight;
    setDirectionalLight: (coordTemp: IDirectionalLight) => void;
    camera: ICamera;
    setCamera: (coordTemp: ICamera) => void;
    saveCoord: () => void;
}

const useCoord = create<State>((set, get) => {
    let initialCoord = {
        box: {
            position: { x: 1.2, y: 3 }
        },
        directionalLight: {
            position: { x: -8, y: 12, z: 13 },
            target: { x: 0, y: 3, z: 0 },
        },
        camera: {
            position: { x: 1, y: 3, z: 7 },
            target: { x: 1, y: 3.35, z: 0 },
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
        box: initialCoord.box,
        setBox: (newC: IBox) => {
            set(() => ({
                box: {
                    ...newC,
                },
            }));
        },
        directionalLight: initialCoord.directionalLight,
        setDirectionalLight: (newC: IDirectionalLight) => {
            set(() => ({
                directionalLight: {
                    ...newC,
                },
            }));
        },
        camera: initialCoord.camera,
        setCamera: (newC: ICamera) => {
            set(() => ({
                camera: {
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

