export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        picks: 'picks.html',
        design: 'design.html',
      },
    },
  },
};
