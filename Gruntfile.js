/*global module:false, grunt:false */

'use strict';

/**
 * @param grunt
 */
module.exports = function grunt(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    var distDirectory = './dist/';
    var pkgDirectory = './dist/';
    var srcDirectory = './src/';
    var libDirectory = srcDirectory + 'lib/';

    var banner = ['/**',
        ' * ' + pkg.name,
        ' * @version ' + pkg.version + ' (' + grunt.template.today('yyyy-mm-dd') + ')',
        ' * @author ' + pkg.author.name,
        ' * @license ' + pkg.license,
        ' */\n'].join('\n');

    grunt.initConfig({
        pkg: pkg,

        clean: [pkgDirectory],

        concat: {
            options: {
                banner: banner,
                separator: ''
            },
            dist: {
                options: {
                },
                banner: '(c) ' + pkg.author.name,
                src: [
                    srcDirectory + '_module.start.js',
                    srcDirectory + '_namespace.js',
                    libDirectory + '**/*.js',
                    srcDirectory + '_module.end.js'
                ],
                dest: pkgDirectory + pkg.name + '.js',
                nonull: true
            }
        },

        copy: {
            dist: {
                files: [
                    { flatten:true, src: ['LICENSE', '*.bat', '*.sh'], dest: pkgDirectory + '/' }
                ]
            }
        },

        compress: {
            main: {
                options: {
                    archive: distDirectory + pkg.name + '.zip'
                },
                expand: true,
                cwd: pkgDirectory,
                src: ['**/*', '!closure-report.txt'],
                dest: pkg.name
            }
        },

        eslint: {
            options: {
                config: './.eslintrc'
            },
            target: [srcDirectory + '**/*.js', '!' + srcDirectory + '**/_module*.js']
        },

        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: pkgDirectory + pkg.name + '.js',
                dest: pkgDirectory + pkg.name + '.min.js'
            }
        },

        'closure-compiler': {
            main: {
                closurePath: 'build/closure-compiler',
                js: pkgDirectory + pkg.name + '.js',
                jsOutputFile: pkgDirectory + pkg.name + '.min.js',
                maxBuffer: 500,
                reportFile: pkgDirectory + 'closure-report.txt',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    'warning_level': 'verbose',
                    'summary_detail_level': 3,
                    'jscomp_off': ['undefinedVars', 'externsValidation'],
                    'externs': ['build/closure-compiler/externs/*.js']
                }
            }
        }
    });

    // Load all npm tasks.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('compile', ['clean', 'concat:dist', 'copy']);
    grunt.registerTask('build', ['compile', 'uglify', 'eslint']);
    grunt.registerTask('build-closure', ['compile', 'closure-compiler', 'eslint']);
    grunt.registerTask('test', ['compile']);
    grunt.registerTask('release', ['build', 'compress']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
