import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import withObservables from '@nozbe/with-observables'
import {database} from "../../../index";

const Comment = ({comment}) => (
    <div>
        <Text>{comment.body} ¡ª by {comment.author}</Text>
    </div>
)

const enhance = withObservables(['comment'], ({comment}) => ({
    comment
}))
const EnhancedComment = enhance(Comment)

const PostList = ({posts}) => {
    return (
        posts.map(post =>
            <EnhancedPost key={post.id} post={post}/>
        ))
}

const Post = ({post, comments}) => (
    <View>
        <Text>Title:{post.title}</Text>
        <Text>Body:{post.body}</Text>
        <Text>Author:{post.author}</Text>
        {/*<Text>Comments</Text>*/}
        {comments.map(comment =>
            <EnhancedComment key={comment.id} comment={comment}/>
        )}
    </View>
)
const enhancePost = withObservables(['post'], ({post}) => ({
    post,
    comments: post.comments, // Shortcut syntax for `post.comments.observe()`
}))

const EnhancedPost = enhancePost(Post)

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
        return (<View style={styles.container}>
            <PostList posts={this.state.posts}/>
            <Button title="|-ADD POST-|" onPress={this.addNewPost}/>
            <Button title="|-DELETE POSTS-|" onPress={this.deletePost}/>
            {/*<Button title="|-UPDATE POSTS-|" onPress={this.updatePosts}/>*/}
        </View>)

    }

    updatePosts = async () => {
        const posts = await database.collections.get('posts').query().fetch()
        this.setState({
            posts: posts
        });
        console.log(`posts : ${this.state.posts}`);
    };

    addNewPost = async () => {
        const postsCollection = database.collections.get('posts')
        await database.action(async () => {
            const newPost = await postsCollection.create(post => {
                post.title = 'I am title';
                post.body = 'I am body:' + this.randInt(0, 100);
                post.author = 'gerald';
                post.isPinned = false;
            });
            console.log(`newPost : ${newPost}`);
        });
        this.updatePosts();
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
    }
});

export default DBScreen