module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.1.0',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
  },
};
