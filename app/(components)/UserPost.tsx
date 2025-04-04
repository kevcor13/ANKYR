import { View, Text, TouchableOpacity, SafeAreaView, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from "expo-router";
import images from "@/constants/images";
import { useGlobal } from "@/context/GlobalProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

interface UserImage {
    _id: string;
    image: string;
    url: string;
    createdAt: string;
    UserID: string;
}

const UserPost = () => {
    const { userData, ngrokAPI } = useGlobal();
    const [userImages, setUserImages] = useState<UserImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserImages();
    }, []);

    const fetchUserImages = async () => {
        if (!userData?._id) {
            console.error('No user ID available');
            return;
        }
        const UserID = userData._id;

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.error('No authentication token found');
                router.replace('/');
                return;
            }

            const response = await axios.post(`${ngrokAPI}/UserImages`, { token, UserID });
            if (response.data.status === 'success') {
                console.log(response.data.data);
                setUserImages(response.data.data);
            } else {
                console.error('Failed to fetch images:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isBlurred = (createdAt: string) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInMinutes = (now.getTime() - createdDate.getTime()) / (1000 * 60);
        return diffInMinutes < 5;
    };

    const groupedImages = userImages.reduce((acc: Record<string, UserImage[]>, img) => {
        const date = formatDate(img.createdAt);
        if (!acc[date]) acc[date] = [];
        acc[date].push(img);
        return acc;
    }, {});

    const handleImageClick = (image: UserImage) => {
        router.push({ pathname: '/(components)/CreatePost', params: { imageUrl: image.image } });
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center px-4 py-2">
                <TouchableOpacity onPress={() => router.push('/camera')}>
                    <Text className="text-white text-xl font-poppins-semibold">&larr; Camera</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row px-4 mt-6 justify-between items-center">
                <Text className="text-white text-3xl font-poppins-semibold">Your snaps</Text>
                <TouchableOpacity onPress={fetchUserImages}>
                    <Image className="w-12 h-12" source={images.libraryIcon} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            ) : userImages.length === 0 ? (
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-white text-lg text-center font-poppins-regular">
                        No snaps yet. Take your first picture!
                    </Text>
                </View>
            ) : (
                <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
                    {Object.entries(groupedImages).map(([date, images]) => (
                        <View key={date} className="mb-6">
                            <Text className="text-white text-base mb-2 font-poppins-regular">{date}</Text>
                            <View className="flex-row flex-wrap gap-3">
                                {images.map((img) => (
                                    <TouchableOpacity
                                        key={img._id}
                                        onPress={() => handleImageClick(img)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{ uri: img.image }}
                                            className="w-36 h-48 rounded-lg"
                                            style={{
                                                opacity: isBlurred(img.createdAt) ? 0.3 : 1,
                                                filter: isBlurred(img.createdAt) ? 'blur(5px)' : 'none',
                                            }}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default UserPost;
