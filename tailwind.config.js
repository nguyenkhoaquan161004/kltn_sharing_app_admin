module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#e0f7f4",
                    100: "#b2e9e4",
                    300: "#81dbd2",
                    500: "#1ABC9C",
                    600: "#16a495",
                    700: "#128d80",
                },
                accent: {
                    yellow: "#F9CA24",
                    red: "#F44336",
                    orange: "#FF8A65",
                },
            },
        },
    },
    plugins: [],
};
