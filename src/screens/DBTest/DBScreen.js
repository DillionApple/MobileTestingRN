import React from 'react';
import {StyleSheet, Button, Text, View, ScrollView} from 'react-native';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import withObservables from '@nozbe/with-observables'
import {database} from "../../../index";

const Comment = ({comment}) => (
    <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between' }}>
        <View>
            <Text style={styles.medFont}>{comment.body} -- by {comment.author}</Text>
        </View>
        <View>
            <Button onPress={() => {
                deleteComment(comment)
            }} title="|-X-|"/>
        </View>
    </View>
)

const enhance = withObservables(['comment'], ({comment}) => ({
    comment
}))
const EnhancedComment = enhance(Comment)

const PostList = ({posts, addNewComment}) => {
    return (
        posts.map(post =>
            <ScrollView>
                <EnhancedPost key={post.id} post={post}/>
                <Button title="|-ADD COMMENT-|" onPress={() => {
                    addNewComment(post)
                }}/>
            </ScrollView>
        ))
}

const Post = ({post, comments}) => (
    <View>
        <Text style={styles.largeFont}>Title:{post.title}</Text>
        <Text style={styles.largeFont}>Body:{post.body}</Text>
        <Text style={styles.largeFont}>Author:{post.author}</Text>
        <Text style={styles.largeFont}>Comments:</Text>
        {comments.map(comment =>
            <EnhancedComment key={comment.id} comment={comment}/>
        )}

    </View>
);

const enhancePost = withObservables(['post'], ({post}) => ({
    post,
    comments: post.comments, // Shortcut syntax for `post.comments.observe()`
}))

const EnhancedPost = enhancePost(Post)
const deleteComment = async (comment) => {
    await database.action(async () => {
        await comment.destroyPermanently();
    });
}

class DBScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    randInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    async componentWillMount(): void {
        const posts = await database.collections.get('posts').query().fetch();
        this.setState({
            posts: posts
        })
    }

    slotRender() {
        return (<ScrollView style={styles.container}>
            <PostList posts={this.state.posts} addNewComment={this.addNewComment}/>
            <Button title="|-ADD POST-|" onPress={this.addNewPost}/>
            <Button title="|-DELETE POSTS-|" onPress={this.deletePost}/>
            {/*<Button title="|-UPDATE POSTS-|" onPress={this.updatePosts}/>*/}
        </ScrollView>)

    }

    updatePosts = async () => {
        const posts = await database.collections.get('posts').query().fetch()
        this.setState({
            posts: posts
        });
        console.log(`posts : ${this.state.posts}`);
    };

    addNewPost = async () => {
        const postsCollection = database.collections.get('posts');
        await database.action(async () => {
            const newPost = await postsCollection.create(post => {
                post.title = 'I am title';
                post.body = 'I am body--' + this.randInt(0, 100);
                post.author = 'gerald';
                post.isPinned = false;
            });
            console.log(`newPost : ${newPost}`);
        });
        this.updatePosts();
    };

    addNewComment = async (post) => {
        const commentsCollection = database.collections.get('comments');
        const comments = await commentsCollection.query().fetch();
        await database.action(async () => {
            const newComments = await commentsCollection.create(comments => {
                comments.post.set(post);
                comments.body = 'I am comment body--' + this.randInt(0, 100);
                comments.author = 'gerald' + this.randInt(0, 100);
            });
            console.log(`newComments : ${newComments}`);
        });
        // this.updatePosts();
    };

    deletePost = async () => {
        let posts = this.state.posts;
        {
            posts.length !== 0 &&
            await database.action(async () => {
                await posts[this.randInt(0, posts.length - 1)].destroyPermanently();
            });
        }
        this.updatePosts();
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    medFont: {
        fontSize: 16
    },
    largeFont: {
        fontSize: 20
    }
});

export default DBScreen