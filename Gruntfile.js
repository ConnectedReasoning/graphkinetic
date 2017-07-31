'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    clean: {
        dev:[ 'client/**/*','client/**/**/*' ],
        prod:[ 'client/**/*'],
        temp: ['clientSrc/tmp/**/*']
    },
    copy: {
        dev: {
            files: [
                { 'client/index.html' : 'clientSrc/html/app.dev.html' },
            ]
        }
    },
    // Concatinationg JS files
    concat: {
        // RE-USE
        libsList: [            
            'clientSrc/js/lib/jquery/jquery.js',
            'clientSrc/js/lib/lodash/lodash.js',
            'clientSrc/js/lib/moment/moment.js',
            'clientSrc/js/lib/angular/angular.js',
            'clientSrc/js/lib/angular/angular-animate.js',
            'clientSrc/js/lib/angular/angular-route.js',
            'clientSrc/js/lib/angular/angular-storage.js',
            'clientSrc/js/lib/angular/angular-cookies.js',
            'clientSrc/js/lib/bootstrap/bootstrap.js',
            'clientSrc/js/lib/ui-bootstrap/ui-bootstrap-tpls-2.5.0.min.js',
            'clientSrc/js/lib/ngParallax/ngParallax.js',
            'clientSrc/js/lib/stripe/angular-stripe-checkout.js'
        ],
        prodLibsList: [
            'clientSrc/js/lib/jquery/jquery.min.js',
            'clientSrc/js/lib/lodash/lodash.min.js',
            'clientSrc/js/lib/moment/moment.min.js',
            'clientSrc/js/lib/angular/angular.min.js',
            'clientSrc/js/lib/angular/angular-animate.min.js',
            'clientSrc/js/lib/angular/angular-route.min.js',
  	        'clientSrc/js/lib/angular/angular-storage.min.js',
            'clientSrc/js/lib/angular/angular-cookies.min.js',
            'clientSrc/js/lib/bootstrap/bootstrap.min.js',
            'clientSrc/js/lib/ui-bootstrap/ui-bootstrap-tpls-2.5.0.min.js',
            'clientSrc/js/lib/ngParallax/ngParallax.min.js',
            'clientSrc/js/lib/stripe/angular-stripe-checkout.min.js'

        ],
        ieLibsList: [
            'clientSrc/js/lib/ie/*.js',
        ],
        // DEVELOPMENT
        devA: {
            options : { separator : ';' },
            files   : { 'client/scripts/app.js' : ['clientSrc/js/app/*.js'] }
        },
        devC: {
            options : { separator : ';' },
            files   : { 'client/scripts/controllers.js' : ['clientSrc/js/controllers/*.js'] }
        },
        devD: {
            options : { separator : ';' },
            files   : { 'client/scripts/directives.js' : ['clientSrc/js/directives/*.js'] }
        },
        devF: {
            options : { separator : ';' },
            files   : { 'client/scripts/filters.js' : ['clientSrc/js/filters/*.js'] }
        },
        devS: {
            options : { separator: ';' },
            files   : { 'client/scripts/services.js' : ['clientSrc/js/services/*.js'] }
        },
        devLibs: {
            options : { separator: ';' },
            files   : { 'client/scripts/libraries.js' : '<%= concat.libsList %>' }
        },
        prod: {
            files: [
                { 'client/scripts/libraries.min.js': '<%= concat.prodLibsList %>' },
                { 'clientSrc/tmp/js/tapp.js': ['clientSrc/tmp/js/app/*.js'] },
                { 'clientSrc/tmp/js/controllers.js': ['clientSrc/tmp/js/controllers/*.js'] },
                { 'clientSrc/tmp/js/directives.js': ['clientSrc/tmp/js/directives/*.js'] },
                { 'clientSrc/tmp/js/filters.js': ['clientSrc/tmp/js/filters/*.js'] },
                { 'clientSrc/tmp/js/services.js': ['clientSrc/tmp/js/services/*.js'] },
                { 'clientSrc/tmp/js/app.js': ['clientSrc/tmp/js/tapp.js', 'clientSrc/tmp/js/controllers.js', 'clientSrc/tmp/js/directives.js', 'clientSrc/tmp/js/filters.js', 'clientSrc/tmp/js/services.js'] }
            ]
        }
    }, 
    watch: {
        css: {
            files: ['clientSrc/less/*.less',
                    'clientSrc/less/app/*.less',
                    'clientSrc/less/app/suits/*.less',
                    'clientSrc/less/base/*.less',
                    'clientSrc/less/comp/*.less',
                    'clientSrc/less/suits/*.less'],
            tasks : ['less:devComp',
                     'less:devBase',
                     'less:devApp']
        },

        // Images, copy
        files: {
            files: ['clientSrc/html/*.html', 
                    'clientSrc/tpl/*.html', 
                    'clientSrc/tpl/*/*.html', 
                    'clientSrc/json/*.json'],
            tasks : ['copy:dev']
        },
            
        js: {
            files: ['clientSrc/js/app/*.js',
                    'clientSrc/js/controllers/*.js', 
                    'clientSrc/js/directives/*.js', 
                    'clientSrc/js/filters/*.js', 
                    'clientSrc/js/services/*.js', 
                    'clientSrc/js/lib/*.js' 
                    ],
            tasks : ['concat:devA',
                    'concat:devC',
                    'concat:devD',
                    'concat:devF',
                    'concat:devS',
                    'concat:devLibs']

      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'develop',
    'watch'
  ]);
};
