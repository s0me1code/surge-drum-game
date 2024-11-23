import { useEffect, useState } from "react";
import { IScore } from "./state/game.state";
import { collection, getDocs } from "firebase/firestore";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./../components/ui/table"
import { db } from "./firebase/config";

export const Dashboard = () => {
    const [scores, setScores] = useState<IScore[]>()
    useEffect(() => {
        const fetchScors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "_"));
                const scoresList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                })) as IScore[];
                setScores(scoresList);
                console.log(scoresList)
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchScors();
    }, []);
    return <>
        <h1>dashboard</h1>

        <Table>
            <TableCaption>A list of gauge readings and performance metrics.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Flow</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Pressure</TableHead>
                    <TableHead>Temp</TableHead>
                    <TableHead>Out</TableHead>
                    <TableHead>Lost Reason</TableHead>
                    <TableHead>Elapsed Time</TableHead>
                    <TableHead>Flow Variances</TableHead>
                    <TableHead>At</TableHead>
                    <TableHead>By</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {scores?.map((score, index) => (
                    <TableRow key={index}>
                        <TableCell>{score.gauges.flow}</TableCell>
                        <TableCell>{score.gauges.level}</TableCell>
                        <TableCell>{score.gauges.pressure}</TableCell>
                        <TableCell>{score.gauges.temp}</TableCell>
                        <TableCell>{score.gauges.out}</TableCell>
                        <TableCell>{score.lostResoan}</TableCell>
                        <TableCell>{score.elapsedTime}</TableCell>
                        <TableCell>{score.flowVariances}</TableCell>
                        <TableCell>{formatDate(score.at)}</TableCell>
                        <TableCell>{score.by || "N/A"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}
const formatDate = (date?: Date): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};
