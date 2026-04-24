export default {
  base: '/NFL-wins-draft/',
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
