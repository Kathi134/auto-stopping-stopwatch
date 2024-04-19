function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function keepTheme() {
    const stored = localStorage.getItem('theme');
    if (stored && stored in ['theme-dark', 'theme-light']) {
        setTheme(stored);
    } else {
        setTheme('theme-dark');
    }
}

module.exports = {
    setTheme,
    keepTheme
}