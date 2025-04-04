import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useGlobal} from "@/context/GlobalProvider";

interface PostCardProps {
    post: {
        _id: string;
        username: string;
        content: string;
        imageUrl: string;
        createdAt: string;
        UserID: string;
    };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const {userData} = useGlobal();
    console.log(userData.profileImage);
    const image = userData.profileImage;
    return (
        <TouchableOpacity onPress={() => { /* Add navigation or other action here */ }}>
                {post.imageUrl ? (
                    <Image
                        source={{ uri: post.imageUrl }}
                        style={{height: 400}}
                        resizeMode="cover"
                    />
                ) : null}
                {post.content ? (
                    <View className="mb-6 mt-6 px-10">
                        <Text className="text-white font-poppins-semibold text-l">
                            "{post.content}"
                        </Text>
                        <Text className="text-white font-poppins-semibold text-l">
                            {post.username}
                        </Text>
                    </View>
                ) : null}
        </TouchableOpacity>
    );
};

export default PostCard;
