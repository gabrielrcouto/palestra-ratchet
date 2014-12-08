/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    compass: {
      site: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          specify: [
            'sass/style.scss'
          ],
          noLineComments: false
        }
      },
    },

    concat: {
      options: {
      
      },
      
      site : {
        src: [
          'js/base.js', 
          'js/start.js',

          'js/modules/ghost.js',
          'js/modules/phaser.js',
          'js/modules/score.js',
          'js/modules/socket.js',

          'js/levels/main.js',
        ],

        dest: 'js/code.min.js',
      },
    },

    watch: {
      options: {
        livereload: true,
      },
      siteSass: {
        files: ['sass/**/*.scss'],
        tasks: ['compass:site'],
      },
      siteJs: {
        files: ['js/**/*.js', '!js/code.min.js'],
        tasks: ['concat:site'],
        options: {
          livereload: true,
        },
      },
      siteCodeJs: {
        files: ['js/code.min.js'],
        tasks: [],
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('concatenate', ['concat']);

};
