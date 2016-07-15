// Example schema

var schema = {
    type: 'list',
    schema: {
        linkMeta: {
            type: 'object',
            schema: {
                type: {
                    type: 'value',
                    values: ['foo', 'bar']
                },
                disableTextTransform: {
                    type: 'boolean'
                }
            }
        },

        isSelectedItem: {
            type: 'boolean'
        }
    }
};