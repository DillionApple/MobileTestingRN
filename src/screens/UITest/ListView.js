import React from 'react';
import {View, FlatList, StyleSheet, Text, Dimensions, Button} from 'react-native';
import Timeout from 'await-timeout';

const {width, height} = Dimensions.get('window');

class ListView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.mounted = true;
        this.timerHandle = new Timeout();
        this.startPlay();
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.timerHandle) {
            this.timerHandle.clear();
        }
    }

    // [0,max)
    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    async startPlay() {
        this._flatList.scrollToOffset({animated: true, offset: 500});
        await this.timerHandle.set(100);

        this._flatList.scrollToEnd({animated: true});
        await this.timerHandle.set(200);
        this._flatList.scrollToOffset({animated: true, offset: 0});

        for (let i = 0; i < 20; i++) {
            await this.timerHandle.set(50);
            this._flatList.scrollToIndex({animated: true, index: this.randomInt(500)});
        }
        this.props.navigation.state.params.onGoBack(this.mounted);
    }

    refreshing() {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            alert('刷新成功')
        }, 1500)
    }

    _onload() {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            alert('加载成功')
        }, 1500)
    }

    render() {
        let data = [];
        for (let i = 0; i < 10000; i++) {
            data.push({key: i, title: i + ''});
        }

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        ListHeaderComponent={this._header}
                        ListFooterComponent={this._footer}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}
                        onRefresh={this.refreshing}
                        refreshing={false}
                        onEndReachedThreshold={0}
                        onEndReached={
                            this._onload
                        }
                        numColumns={3}
                        columnWrapperStyle={{borderWidth: 2, borderColor: 'black'}}

                        //horizontal={true}

                        getItemLayout={(data, index) => (
                            {length: 100, offset: (100 + 2) * index, index}
                        )}

                        data={data}>
                    </FlatList>
                </View>

            </View>
        );
    }


    _renderItem = (item) => {
        let txt = item.item.title;
        let bgColor = item.index % 2 == 0 ? 'black' : 'grey';
        return <Text style={[{flex: 1, height: 100, backgroundColor: bgColor}, styles.txt]}>{txt}</Text>
    }

    _header = () => {
        return <Text style={[styles.txt, {backgroundColor: 'black'}]}>Header</Text>;
    }

    _footer = () => {
        return <Text style={[styles.txt, {backgroundColor: 'black'}]}>Bottom</Text>;
    }

    _separator = () => {
        return <View style={{height: 2, backgroundColor: 'yellow'}}/>;
    }

}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1
    },
    content: {
        width: width,
        height: height,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cell: {
        height: 100,
        backgroundColor: 'purple',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#ececec',
        borderBottomWidth: 1

    },
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});
export default ListView;