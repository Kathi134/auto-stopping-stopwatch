import React, { useEffect, useState } from 'react';
import { setTheme } from './themes';
import { MdDarkMode, MdLightMode } from "react-icons/md";

function ToggleTheme() {
    const [togClass, setTogClass] = useState('dark');
    let theme = localStorage.getItem('theme');

    useEffect(() => {
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTogClass('dark')
        } else if (localStorage.getItem('theme') === 'theme-light') {
            setTogClass('light')
        }
    }, [theme])

    const handleOnClick = () => {
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTheme('theme-light');
            setTogClass('light')
        } else {
            setTheme('theme-dark');
            setTogClass('dark')
        }
    }  

    return (
        <div className="cursor">
            {
                togClass === "dark"
                ? <MdLightMode className="default" onClick={handleOnClick}/>
                : <MdDarkMode className="default" onClick={handleOnClick}/>
            }
        </div>
    )
}

export default ToggleTheme;
