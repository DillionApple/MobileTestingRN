import { Model } from '@nozbe/watermelondb'
import {children, field} from '@nozbe/watermelondb/decorators'

export default class Post extends Model {
    static table = 'posts'
    static associations = {
        comments: { type: 'has_many', foreignKey: 'post_id' },
    }

    @field('title') title
    @field('body') body
    @field('author') author
    @field('is_pinned') isPinned
    @children('comments') comments
}