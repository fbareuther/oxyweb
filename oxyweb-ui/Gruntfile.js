var util = require('util');

/*global $:false */
module.exports = function (grunt) {

	/*jslint node: true */
	'use strict';

	// Project configuration
	grunt.initConfig({

		// Metadata
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
			'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.organization.name %> (<%= pkg.organization.url %>)\n' +
			' */\n',

		// Clean (https://github.com/gruntjs/grunt-contrib-clean)
		clean: {
			dist: ['dist', 'target']
		},

		// JSHint (https://github.com/gruntjs/grunt-contrib-jshint)
		jshint: {
			options: {
				"curly": true,
				"eqnull": true,
				"eqeqeq": true,
				"undef": true,
				"expr": true,
				globals: {
					window: true,
					console: true,
					module: true,
					document: true,
					jQuery: true,
					$: true,
					ace: true,
					Handlebars: true,
					hljs: true,
					ZeroClipboard: true
				}
			},
			js: [
				'Gruntfile.js',
				'js/**/*.js',
				'templates/helpers/**/*.js'
			],
			docs: [
				'docs/js/**/*.js'
			]
		},

		// Copy (https://github.com/gruntjs/grunt-contrib-copy)
		copy: {
			images: {
				files: [
					{	// Common
						expand: true,
						cwd: 'images',
						src: '**',
						dest: 'dist/images/'
					},
					{	// Docs
						expand: true,
						cwd: 'docs/images',
						src: '**',
						dest: 'target/images/'
					}
				]
			},
			fonts: {
				files: [
					{	// ObliqueUI
						expand: true,
						cwd: 'fonts',
						src: '**',
						dest: 'dist/fonts/'
					},
					{	// Bootstrap Glyphicons
						expand: true,
						cwd: 'vendor/bootstrap/dist/fonts',
						src: '**',
						dest: 'dist/fonts/'
					},
					{	// Font-Awesome
						expand: true,
						cwd: 'vendor/font-awesome/fonts',
						src: '**',
						dest: 'dist/fonts/'
					}
				]
			},
			vendor: {
				files: [
					{   // Ace:
						expand: true,
						cwd: 'vendor/ace/src-min-noconflict',
						src: [
							'ace.js',
							'mode-css.js',
							'mode-html.js',
							'mode-javascript.js',
							'theme-twilight.js',
							'worker-css.js',
							'worker-html.js',
							'worker-javascript.js'
						],
						dest: 'target/vendor/ace/'
					},
					{   // highlight.js:
						expand: true,
						cwd: 'vendor/highlightjs/',
						src: ['highlight.pack.js', 'styles/default.css', 'styles/github.css'],
						dest: 'target/vendor/highlightjs/'
					},
					{  // handlebars.js:
						expand: true,
						cwd: 'vendor/handlebars/',
						src: 'handlebars.min.js',
						dest: 'target/vendor/handlebars/'
					},
					{  // Holder.js:
						expand: true,
						cwd: 'vendor/holderjs/',
						src: 'holder.js',
						dest: 'target/vendor/holderjs/'
					},
					{   // html5shiv:
						expand: true,
						cwd: 'vendor/html5shiv/dist/',
						src: '**',
						dest: 'target/vendor/html5shiv/'
					},
					{   // jQuery - Cookie:
						expand: true,
						cwd: 'vendor/jquery-cookie/',
						src: 'jquery.cookie.js',
						dest: 'target/vendor/jquery-cookie/'
					},
					{   // Respond:
						expand: true,
						cwd: 'vendor/respond/dest/',
						src: '**',
						dest: 'target/vendor/respond/'
					},
					{   // ZeroClipboard:
						expand: true,
						cwd: 'vendor/zeroclipboard/dist/',
						src: ['ZeroClipboard.min.js', 'ZeroClipboard.min.map', 'ZeroClipboard.swf'],
						dest: 'target/vendor/zeroclipboard/'
					},
					{  // Custom:
						expand: true,
						cwd: 'docs/vendor/',
						src: '**',
						dest: 'target/vendor/'
					}
				]
			},
			dist: {
				files: [
					{   // ObliqueUI Framework distribution:
						expand: true,
						cwd: 'dist/',
						src: '**',
						dest: 'target/vendor/oblique-ui/'
					}
				]
			},
			docs: {
				files: [
					{
						expand: true,
						cwd: 'docs/',
						src: [
							'js/**/*.js',
							'snippets/**/*.html',
							'snippets/**/*.css',
							'snippets/**/*.js'
						],
						dest: 'target/',
						flatten: false
					}
				]
			}
		},

		// LESS (https://github.com/gruntjs/grunt-contrib-less)
		less: {
			css: {
				options: {
					ieCompat: true
				},
				files: [
					{
						src: 'less/main.less',
						dest: 'dist/css/<%= pkg.name %>.css'
					},
					{
						expand: true,
						cwd: 'themes/',
						src: '**/*-theme.less',
						dest: 'dist/themes/',
						ext: '.css'
					},
					{
						src: 'docs/less/docs.less',
						dest: 'target/css/docs.css'
					}
				]
			},
			minify: {
				options: {
					expand: true,
					cleancss: true
				},
				files: [
					{
						expand: true,
						cwd: 'dist/css/',
						src: '**/*.css',
						dest: 'dist/css/',
						report: 'min',
						ext: '.min.css'
					},
					{
						expand: true,
						cwd: 'dist/themes/',
						src: '**/*.css',
						dest: 'dist/themes/',
						report: 'min',
						ext: '.min.css'
					}
				]
			}
		},

		// Banner (https://github.com/mattstyles/grunt-banner)
		usebanner: {
			css: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [
						'dist/css/*.css',
						'dist/themes/**/*.css',
						'target/css/*.css'
					]
				}
			}
		},

		// Concat (https://github.com/gruntjs/grunt-contrib-concat)
		concat: {
			options: {
				process: true,
				banner: '<%= banner %>',
				stripBanners: false
			},
			js: {
				files: [
					{
						src: ['js/**/*.js'],
						dest: 'dist/js/<%= pkg.name %>.js'
					},
					{
						src: [
							'vendor/jquery/dist/jquery.js',
							'vendor/bootstrap/dist/js/bootstrap.js',
							'js/**/*.js'
						],
						dest: 'dist/js/<%= pkg.name %>-all.js'
					},
					{
						src: 'docs/js/**/*.js',
						dest: 'target/js/<%= pkg.name %>-docs-all.js'
					}
				]
			}
		},

		// Uglify (https://github.com/gruntjs/grunt-contrib-uglify)
		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'dist/js/',
						src: ['**/*.js'],
						dest: 'dist/js/',
						ext: '.min.js'
					}
				]
			}
		},

		// Assemble (https://github.com/assemble/assemble)
		assemble: {
			options: {
				data: [
					'package.json',
					'docs/data/*.{json,yml}'
				],
				layout: 'default.hbs',
				layoutdir: 'templates/layouts/',
				partials: [
					'templates/partials/*.hbs',
					'docs/templates/partials/**/*.hbs',
					'docs/snippets/**/*.hbs'
				],
				helpers: [
					'handlebars-helper-include',
					'handlebars-helper-lorem',
					'handlebars-helper-partial',
					'handlebars-helper-prettify',
					'templates/helpers/*.js',
					'docs/helpers/*.js'
				],
				prettify: {
					condense: true,
					indent: 1,
					"indent_char": "	", // Required for Markdown
					padcomments: true
				},
				assets: 'target/',
				flatten: false,

				// ObliqueUI specific:
				obliqueui: {
					name: "oblique-ui",
					site: {
						home: 'index.html',
						pages: ''
					},
					vendor: "vendor/oblique-ui/",
					offsets: {
						intermediary: 80,
						final: 160
					}
				}
			},
			samples: {
				options: {
					layout: false,
					assets: './target/'
				},
				files: [
					{
						expand: true,
						cwd: 'docs/samples/',
						src: ['**/*.hbs'],
						dest: 'target/samples/'
					}
				]
			},
			snippets: {
				options: {
					layout: false
				},
				files: [
					{
						expand: true,
						cwd: 'docs/snippets/',
						src: ['**/*.hbs'],
						dest: 'target/snippets/'
					}
				]
			},
			'snippets-layouts': {
				options: {
					layout: false,
					assets: './target/snippets/layouts/'
				},
				files: [
					{
						expand: true,
						cwd: 'docs/samples/layouts/',
						src: ['**/*.hbs'],
						dest: 'target/snippets/layouts/'
					}
				]
			},
			'snippets-templates': {
				options: {
					layout: false,
					assets: './target/snippets/templates/'
				},
				files: [
					{
						expand: true,
						cwd: 'docs/samples/templates/',
						src: ['**/*.hbs'],
						dest: 'target/snippets/templates/'
					}
				]
			},
			docs: {
				files: [
					{
						expand: true,
						cwd: 'docs/pages',
						src: '**/*.hbs',
						dest: 'target/'
					}
				]
			},
			viewports: {
				options: {
					layout: 'base.hbs',
					assets: 'target/',
					relativePath: "../"
				},
				files: [
					{
						expand: true,
						cwd: 'docs/pages/layouts/',
						src: ['**/*.hbs'],
						dest: 'target/viewports/layouts/'
					}
				]
			}
		},

		// Text replace (https://github.com/yoniholmes/grunt-text-replace)
		replace: {
			version: {
				src: ['README.md'],
				overwrite: true,
				replacements: [
					{
						from: /v?[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?/g,
						to: "v<%= pkg.version %>"
					}
				]
			}
		},

		// Changelog (https://github.com/btford/grunt-conventional-changelog)
		changelog: {
			options: {
				versionText: function(version, subtitle) {
					var PATTERN = '<a name="v%s"></a>\n## v%s%s';
					return util.format(PATTERN, version, version, subtitle ? ' - ' + subtitle : '');
				},
				patchVersionText: function(version, subtitle) {
					var PATTERN = '<a name="v%s"></a>\n### v%s%s';
					return util.format(PATTERN, version, version, subtitle ? ' - ' + subtitle : '');
				},
				commitLink: function(hash) {
					var LINK_COMMIT = '[%s](%s/commits/%s)';
					var shortHash = hash.substring(0,8); // No need to show full hash in log
					return util.format(LINK_COMMIT, shortHash, grunt.template.process('<%= pkg.repository.home %>'), hash);
				}
			}
		},

		// Compress (https://github.com/gruntjs/grunt-contrib-compress)
		compress: {
			dist: {
				options: {
					archive: function () {
						return grunt.template.process('target/<%= name %>-v<%= version %>.zip', {data: grunt.config('pkg')});
					}
				},
				expand: true,
				cwd: 'dist/',
				src: '**'
			},
			docs: {
				options: {
					archive: function () {
						return grunt.template.process('target/<%= name %>-v<%= version %>-docs.zip', {data: grunt.config('pkg')});
					}
				},
				expand: true,
				cwd: 'target/',
				src: '**'
			}
		},

		// Release (https://github.com/vojtajina/grunt-bump)
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['.'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version v%VERSION%',
				push: true,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},

		// Watch (https://github.com/gruntjs/grunt-contrib-watch)
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['default']
			},
			css: {
				files: [
					'less/**/*.less',
					'themes/**/*.less',
					'docs/less/**/*.less'
				],
				tasks: ['less:css', 'usebanner']
			},
			js: {
				files: [
					'js/**/*.js',
					'docs/js/*.js'
				],
				tasks: ['jshint', 'concat', 'copy:docs']
			},
			html: {
				files: [
					'*.json',
					'templates/**/*',
					'docs/data/*.{json,yml}',
					'docs/**/*.hbs',
					'docs/snippets/**/*.html'
				],
				tasks: ['copy:docs', 'assemble']
			},
			docs: {
				files: 'dist/**/*',
				tasks: ['copy:dist']
			},
			options: {
				livereload: true
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('assemble');
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});


	// Project tasks
	// ----------------------------------

	// Default task:
	grunt.registerTask('default', ['dist', 'docs']);

	// Full distribution task:
	grunt.registerTask('dist', ['clean', 'jshint', 'copy', 'dist-css', 'dist-js']);

	// CSS distribution task:
	grunt.registerTask('dist-css', ['less', 'usebanner']);

	// JS distribution task:
	grunt.registerTask('dist-js', ['concat', 'uglify']);

	// Docs tasks:
	grunt.registerTask('docs', ['assemble', 'copy:dist']);

	// Deployment tasks
	// ----------------------------------

	// Dev mode:
	grunt.registerTask('dev', ['default', 'watch']);

	// Release (see https://github.com/vojtajina/grunt-bump#usage-examples):
	grunt.registerTask('release', function(target) {
		grunt.task.run([
			'bump-only:' + (target || 'patch'),
			'replace',
			'changelog',
			'default',
			'compress',
			'bump-commit'
		]);
	});

};
