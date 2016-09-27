'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var semver = require('semver');
var request = require('request');
var tar = require('tar');

var tmp = require('os').tmpdir();

var distBaseUrl = 'https://dl.bintray.com/lovell/sharp/';

// Use NPM-provided environment variable where available, falling back to require-based method for Electron
var minimumLibvipsVersion = process.env.npm_package_config_libvips || require('./package.json').config.libvips;

var vipsHeaderPath = path.join(__dirname, 'include', 'vips', 'vips.h');

// -- Helpers

// Does this file exist?
var isFile = function (file) {
  var exists = false;
  try {
    exists = fs.statSync(file).isFile();
  } catch (err) {
  }
  return exists;
};

var unpack = function (tarPath, done) {
  var extractor = tar.Extract({
    path: __dirname
  });
  extractor.on('error', error);
  extractor.on('end', function () {
    if (!isFile(vipsHeaderPath)) {
      error('Could not unpack ' + tarPath);
    }
    if (typeof done === 'function') {
      done();
    }
  });
  fs.createReadStream(tarPath).on('error', error)
    .pipe(zlib.Unzip())
    .pipe(extractor);
};

// Error
var error = function (msg) {
  if (msg instanceof Error) {
    msg = msg.message;
  }
  process.stderr.write('ERROR: ' + msg + '\n');
  process.exit(1);
};

// -- Check if win 32bit

module.exports.check_win32 = function () {
  // Ensure Intel 32-bit or ARM
  if (require('os').platform() !== 'win32') {
    error('This version of sharp only for Windows 32-bit system, for Windows 64-bit version or another OS - please see https://github.com/lovell/sharp');
  }
};

module.exports.use_global_vips = function () {
  var useGlobalVips = false;
  var globalVipsVersion = process.env.GLOBAL_VIPS_VERSION;
  if (globalVipsVersion) {
    useGlobalVips = semver.gte(
      globalVipsVersion,
      minimumLibvipsVersion
    );
  }
  if (process.platform === 'darwin' && !useGlobalVips) {
    if (globalVipsVersion) {
      error(
        'Found libvips ' + globalVipsVersion + ' but require ' + minimumLibvipsVersion +
        '\nPlease upgrade libvips by running: brew update && brew upgrade'
      );
    } else {
      error('Please install libvips by running: brew install homebrew/science/vips --with-webp --with-graphicsmagick');
    }
  }
  process.stdout.write(useGlobalVips ? 'true' : 'false');
};
