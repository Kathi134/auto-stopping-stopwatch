import Header from "./Header"
import Stopwatch from "./Stopwatch"
import { useMode } from "../../context/ModeContext";

export default function Main() {
    const { mode } = useMode();

    return <>
        <Header />
        <Stopwatch mode={mode} />
    </>
}