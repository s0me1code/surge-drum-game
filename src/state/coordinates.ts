import { create } from 'zustand'

const useCoord = create(() => ({
    initBox: {
        position: { x: 1.2, y: 2}
    },
}))

export { useCoord }
