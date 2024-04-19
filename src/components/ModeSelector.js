import MODES from "../model/modes";
import { useMode } from "../context/ModeContext";

export default function ModeSelector() {
    const { mode, setMode } = useMode();

    return (<>
        <div className="horizontal-container select">
            <select onChange={(e) => setMode(JSON.parse(e.target.value))} value={JSON.stringify(mode)}>
                {MODES.map(m => <option value={JSON.stringify(m)} key={m.name} >{m.name}</option>)}
            </select>
        </div>
    </> 
    );
}