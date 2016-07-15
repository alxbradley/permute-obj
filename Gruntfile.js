module.exports = grunt => {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        'babel': {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/permute-obj.js': 'src/permute-obj.js'
                }
            }
        },

        'watch': {
            scripts: {
                files: ['src/*.js'],
                tasks: ['babel']
            }
        }
    });

    grunt.registerTask('default', ['babel']);
}