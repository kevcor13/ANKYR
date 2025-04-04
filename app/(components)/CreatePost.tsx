import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobal } from "@/context/GlobalProvider";
import { router, useLocalSearchParams } from "expo-router";
import images from "@/constants/images";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreatePost() {
    const { userData, ngrokAPI } = useGlobal();
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const params = useLocalSearchParams();
    const imageUri = params.imageUrl;

    // Check if image URI is available

    const handleShare = async () => {
        if (!caption.trim()) {
            Alert.alert("Error", "Please add a caption to your snap");
            return;
        }

        if (!imageUri) {
            Alert.alert("Error", "No image to share");
            return;
        }

        setIsLoading(true);

        try {
            // Get token for authentication
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "Authentication required");
                return;
            }

            // Configure axios with headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // Prepare the post data
            const postData = {
                UserId: userData?._id,
                username: userData?.username,
                content: caption,
                imageUrl: imageUri
            };

            console.log('Sharing post with data:', postData);

            // Make API call to backend
            const response = await axios.post(
                `${ngrokAPI}/createPost`,
                postData,
                config
            );

            console.log('Post created successfully:', response.data);
            Alert.alert("Success", "Your snap has been shared!", [
                { text: "OK", onPress: () => router.push('/home') }
            ]);
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert("Error", "Failed to share your snap. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView>
        <SafeAreaView className="flex-1 bg-black">
            {/* Header with a Back button and Logo */}
            <View className="flex-row items-center justify-between px-4 py-2">
                <TouchableOpacity onPress={() => router.push('/camera')}>
                    <Text className="text-white font-poppins-semibold text-xl">&larr; Back</Text>
                </TouchableOpacity>
            </View>

            {/* Title */}
            <View className="px-4 mt-6 mb-6 flex-row">
                <Text className="text-white text-2xl font-semibold">Share your snap</Text>
                <View className="px-48">
                    <Image source={images.send} className=""/>
                </View>
            </View>

            {/* Image preview */}
            <View className="px-10 mb-6">
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-60 h-80 rounded-md"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-60 h-80 rounded-md bg-gray-800 items-center justify-center">
                        <Text className="text-white">No image available</Text>
                    </View>
                )}
            </View>

            {/* Caption input */}
            <View className="px-6 mb-4">
                <Text className="text-white mb-2 font-poppins text-xl">Caption your snap:</Text>
                <TextInput
                    className="bg-slate-700 p-4 text-white rounded-md"
                    placeholder="Type your caption..."
                    placeholderTextColor="#aaa"
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    maxLength={200}
                />
            </View>

            {/* Share button */}
            <View className="px-6 mt-6">
                <TouchableOpacity
                    onPress={handleShare}
                    disabled={isLoading || !imageUri}
                    className={`p-6 rounded-md items-center ${
                        isLoading || !imageUri ? 'bg-gray-500' : 'bg-[#DCE0E3]'
                    }`}
                >
                    <Text className="text-black font-semibold">
                        {isLoading ? 'Sharing...' : 'Share'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </ScrollView>
    );
}