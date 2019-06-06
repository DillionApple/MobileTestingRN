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


const Post = ({post, comments}) => (
    <View>
        <Text>{post.title}</Text>
        <Text>{post.body}</Text>
        <Text>Comments</Text>
        {/*{comments.map(comment =>*/}
        {/*    <EnhancedComment key={comment.id} comment={comment}/>*/}
        {/*)}*/}
    </View>
)
const enhancePost = withObservables(['post'], ({post}) => ({
    post,
    // comments: post.comments, // Shortcut syntax for `post.comments.observe()`
}))

const EnhancedPost = enhancePost(Post)

class DBScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            posts: null
        }
    }

    componentWillMount(): void {
        const postsCollection = database.collections.get('posts')
        this.setState({
            posts: postsCollection.query().fetch()
        })
    }

    slotRender() {
        return (<View style={styles.container}>
            <EnhancedPost post={this.state.posts}/>
            <Button title="|-ADD POST-|" onPress={this.addNewPost}/>
        </View>)

    }

    async addNewPost() {
        const postsCollection = database.collections.get('posts')
        await database.action(async () => {
            const newPost = await postsCollection.create(post => {
                post.title = 'New post';
                post.body = 'Lorem ipsum...';
                post.author = 'gerald';
                post.isPinned = false;
            })
            console.log(`newPost : ${newPost}`);
        })
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    }
});

export default DBScreen