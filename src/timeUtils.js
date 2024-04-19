function spreadFromMillis(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time / 60000) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = time % 1000;

    return {hours, minutes, seconds, milliseconds}
}

function displayFromMillis(time) {
    const {hours, minutes, seconds, milliseconds} = spreadFromMillis(time)
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
}

function formatDateWithLeadingZeros(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(4, '0');
    
    return `${day}.${month}.${year}`;
}

export {displayFromMillis, formatDateWithLeadingZeros};


// 60000