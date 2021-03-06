module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "chai"],
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    concurrency: Infinity,
    preprocessors: {
      "test/**/*.spec.js": ["esbuild"],
    },
    files: ["test/**/*.spec.js"],
    esbuild: {
      target: "esnext",
    },
  });
};
