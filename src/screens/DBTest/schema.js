import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'posts',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'body', type: 'string' },
                { name: 'author', type: 'string' },
                { name: 'is_pinned', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'comments',
            columns: [
                { name: 'body', type: 'string' },
                { name: 'author', type: 'string' },
                { name: 'post_id', type: 'string', isIndexed: true },
            ]
        }),
    ]
})