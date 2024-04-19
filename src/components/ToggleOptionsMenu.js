import { IoMdSettings } from "react-icons/io";
import { useSettings } from "../context/SettingsContext";

export default function ToggleOptionsMenu() {
    const {settings, setSettings} = useSettings();

    function toggleOptionsMenu() {
        setSettings({...settings, showOptionsMenu: !settings.showOptionsMenu})
    }

    return (<div>
        <IoMdSettings className="padding-right cursor" onClick={toggleOptionsMenu}/>
    </div>)
}