/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

var path = require('path'),
	debug = require('debug')('compile')
	_default = {
		options: {
			paths: ['src/mixins']
		},
		files: ['src/*.styl']
	}
	;

exports.init = function(grunt) {

	var exports = {};

	// Returns complete configuration object for rendering final output css
	// options: configuration options
	var getCompileData = function(options) {
			var compileData = {},
				pathData = getPathData(options);

			// Generates a unique compile configuration object
			// for each theme- variation file you include in your theme project
			grunt.util._.forEach(options.themeFiles, function(theme) {
				compileData[theme] = {
					options: {
						paths: pathData,
						import: getImportData(theme, options),
						compress: false
					},
					files: getFilesData(theme, options)
				};

			});

			return !Object.keys(compileData).length ? _default : compileData;
		};

	// Returns the paths to look in for imported files
	// options: configuration object
	var getPathData = function(options) {
			var pathData = [].concat(
					options.controlsFilesPath,
					options.utilsFilesPath,
					options.themeFilesPath);

			return pathData;
		};

	// Returns an array of file names to import
	// ( use this for variables )
	// Works in concert with getPathData
	// getPathData is the path Ex: src/theme/
	// getImportData are the found at those paths Ex: theme-mobile-dark.styl
	var getImportData = function(theme, options) {
			var importData = [
				theme,
				'nib'].concat(options.mixinFiles);

			importData.forEach(function(element, index, array) {
				array[index] = path.basename(element);
			});

			return importData;
		};

	var getFilesData = function(theme, options) {
			var fileData = [],
				releasePath = options.releasePath,
				skinFiles = options.skinsPath + '/**/src/*.styl',
				//TODO: Add platform file.
				//  write out nib vendor-prefixes variable with chosen platform variables
				//  in this format:
				//  vendor-prefixes ?= webkit moz o ms official
				includes = options.srcPath + '/**/src/includes/*.styl',
				fileName = path.basename(theme).split('.styl').join('.css');

			fileData.push({
				src: [includes, skinFiles],
				dest: releasePath + '/' + fileName.replace(options.themePrefix + '-', '')
			});

			return fileData;
		};

	exports.getCompileData = getCompileData;
	exports.getPathData = getPathData;
	exports.getImportData = getImportData;
	exports.getFilesData = getFilesData;

	return exports;
};
