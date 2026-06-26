(function () {
    var STORAGE_KEY = 'theme';

    function getStoredTheme() {
        var stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : null;
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    function updateNavbar(theme) {
        var navbar = document.getElementById('site-navbar');
        if (!navbar) {
            return;
        }

        if (theme === 'light') {
            navbar.classList.remove('navbar-inverse');
            navbar.classList.add('navbar-default');
        } else {
            navbar.classList.remove('navbar-default');
            navbar.classList.add('navbar-inverse');
        }
    }

    function updateToggleButton(theme) {
        var toggle = document.getElementById('theme-toggle');
        if (!toggle) {
            return;
        }

        var icon = toggle.querySelector('i');
        if (!icon) {
            return;
        }

        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            toggle.setAttribute('aria-label', 'Switch to light mode');
            toggle.setAttribute('aria-pressed', 'true');
        } else {
            icon.className = 'fas fa-moon';
            toggle.setAttribute('aria-label', 'Switch to dark mode');
            toggle.setAttribute('aria-pressed', 'false');
        }
    }

    function setTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        updateNavbar(theme);
        updateToggleButton(theme);

        if (persist !== false) {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    }

    function resolveInitialTheme() {
        return getStoredTheme() || getSystemTheme();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var theme = resolveInitialTheme();
        setTheme(theme, false);

        var toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', function (event) {
                event.preventDefault();
                var nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
            });
        }

        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
            if (!getStoredTheme()) {
                setTheme(event.matches ? 'light' : 'dark', false);
            }
        });
    });
})();
