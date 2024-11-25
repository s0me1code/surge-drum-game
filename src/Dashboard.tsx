import { useEffect, useState } from "react";
import { IScore } from "./state/game.state";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./../components/ui/table"
import { ScrollArea } from "./../components/ui/scroll-area"
import { db } from "./firebase/config";
import { formatSecondsToMinutes } from "./utils/_";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [scores, setScores] = useState<IScore[]>()
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/", { state: { reset: true } })
    }

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // Get today's start and end timestamps
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);

                // Construct Firestore query to get only today's scores
                const scoresQuery = query(
                    collection(db, "_"),
                    where("at", ">=", todayStart.getTime()),
                    where("at", "<=", todayEnd.getTime())
                );

                // Fetch the filtered scores from Firestore
                const querySnapshot = await getDocs(scoresQuery);
                const scoresList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                })) as IScore[];

                // Sort scores by elapsedTime
                const sortedScores = scoresList.sort((a, b) => b.elapsedTime - a.elapsedTime);

                setScores(sortedScores);
                console.log(sortedScores);
            } catch (error) {
                console.error("Error fetching scores: ", error);
            }
        };

        fetchScores();
    }, []);

    return <>
        <div className=" flex flex-col justify-center items-center min-h-screen  p-4">
            <h1 className="text-4xl font-bold mb-4 text-white/90">Today's Dashboard</h1>
            <div className="relative w-full max-w-4xl">
                <Button onClick={handleBack} variant="outline" className="absolute -top-14 left-0 z-20 mb-4">
                    Back to Play
                </Button>
                <div className="w-full bg-white/40 rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-gray-100 text-lg">
                                <TableRow>
                                    <TableHead className="w-[100px] text-primary">Name</TableHead>
                                    <TableHead className="text-right text-primary">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <ScrollArea className="h-[70vh]">
                        <Table className="text-lg">
                            <TableBody>
                                {scores && scores.map((score, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{score.name}</TableCell>
                                        <TableCell className="text-right">{formatSecondsToMinutes(score.elapsedTime)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </div>
    </>
}

