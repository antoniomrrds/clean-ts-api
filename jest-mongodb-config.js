module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.8',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
  },
};
