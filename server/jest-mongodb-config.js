module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: process.env.DB_VERSION || '5.0.0',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    replSet: {
      count: 3,
      storageEngine: 'wiredTiger',
    },
  },
};