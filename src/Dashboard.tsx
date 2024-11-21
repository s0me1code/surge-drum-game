import { useEffect, useState } from "react";
import { IScore } from "./state/game.state";
import { collection, getDocs } from "firebase/firestore";
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
        <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th>Flow</th>
                    <th>Level</th>
                    <th>Pressure</th>
                    <th>Temp</th>
                    <th>Out</th>
                    <th>Lost Reason</th>
                    <th>Elapsed Time</th>
                    <th>Flow Variances</th>
                    <th>At</th>
                    <th>By</th>
                </tr>
            </thead>
            <tbody>
                {scores?.map((score, index) => (
                    <tr key={index}>
                        <td>{score.gauges.flow}</td>
                        <td>{score.gauges.level}</td>
                        <td>{score.gauges.pressure}</td>
                        <td>{score.gauges.temp}</td>
                        <td>{score.gauges.out}</td>
                        <td>{score.lostResoan}</td>
                        <td>{score.elapsedTime}</td>
                        <td>{score.flowVariances}</td>
                        <td>{formatDate(score.at)}</td>
                        <td>{score.by || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
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
