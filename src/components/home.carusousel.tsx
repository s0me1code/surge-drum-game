import { Card } from "../../components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "../../components/ui/carousel"
import { useEffect, useState } from "react"

export type IDifficalty = {
    label: string,
    value: string,
    videoUrl: string,
}
interface DifficultyCarouselProps {
    selectedDifficulty: string
    difficulties: IDifficalty[]
}

export const DifficultyCarousel = ({ selectedDifficulty, difficulties }: DifficultyCarouselProps) => {
    const [api, setApi] = useState<any>()
    useEffect(() => {
        if (api) {
            const index = difficulties.findIndex((d, i) => { if (d.value == selectedDifficulty) return i })
            api.scrollTo(index)
        }
    }, [api, selectedDifficulty, difficulties])
    return (
        <Carousel setApi={setApi} className="w-full max-w-2xl mx-auto">
            <CarouselContent>
                {difficulties.map((difficulty, index) => (
                    <CarouselItem key={index}>
                        <Video {...difficulty} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

type IVideo = {
    videoUrl: string,
}
const Video = ({ videoUrl }: IVideo) => {
    return (
        <Card className=" w-[36rem] overflow-clip p-1">
            <video
                className="rounded-lg"
                src={videoUrl}
                autoPlay
                loop
                controls={false}
            />
        </Card>
    );
}
