import ToggleTheme from "./ToggleTheme";
import Logo from "./Logo";
import { useMode } from "./ModeContext";
import ToggleOptionsMenu from "./ToggleOptionsMenu";
import Clock from 'react-live-clock';
import { formatDateWithLeadingZeros } from "./timeUtils";


export default function Header() {
    const {mode} = useMode();

    
      
      const formattedDate = formatDateWithLeadingZeros(new Date());
      console.log(formattedDate);

    return(<>
        <div className="header-container">
            <div className="horizontal-container">
                <Logo/>
                <div className="vertical-container padding-left">
                    <span>Puzzlemeisterschaft Köditz</span>
                    <span>{formatDateWithLeadingZeros(new Date())}, <Clock format={'HH:mm:ss'} ticking={true} /></span>
                    <span>{mode.name}</span>
                </div>
            </div>
            
            <div className="toggle-container">
                <ToggleOptionsMenu/>
                <ToggleTheme/>
            </div>
        </div>
    </>)
}