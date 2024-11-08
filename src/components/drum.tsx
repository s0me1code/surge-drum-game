import { ThreeElements } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import { _ } from "./_"

export const Drum = (props: ThreeElements['group']) => {
    return <_ name="drum.group" {...props} >
        <Box/>
    </_ >
}
