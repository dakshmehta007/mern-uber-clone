module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "traffic-light":
          "url('https://img.freepik.com/premium-photo/temporary-traffic-control-lights-triangle-building-site-traffic-sign_93675-146809.jpg')",
      },
      colors: {
        customGrey: "#eeeeee",
        black: "#111",
        lightGreen: "#10b461",
        whiteshade: '#eee',
      },
      fontSize: {
        xs: "10px", // Add this line
      },
    },
  },
  plugins: [],
};
