import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import LeagueScreen from "@/components/LeagueScreen";
import { useGlobal } from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import PostCard from "@/components/PostCard";
import axios from "axios";
import PostScreen from "@/components/PostScreen";

interface posts {
    _id: string;
    username: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    UserID: string;
}

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'POSTS' | 'WORKOUTS' | 'PLAYLISTS' | 'LEAGUE'>('POSTS');
    const { userData, fetchGameData, logoutUser, ngrokAPI } = useGlobal();
    const [streak, setStreak] = useState<number | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [league, setLeague] = useState<string | null>(null);
    const [badgeImage, setBadgeImage] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [posts, setPosts] = useState<posts[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);

    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);
            await logoutUser();
            router.replace("/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Fetch user posts and game data when userData is available
    useEffect(() => {
        if (isLoggingOut || !userData) return;

        const fetchUserPosts = async () => {
            if (!userData?._id) {
                console.error('No user ID available');
                return;
            }
            const UserId = userData._id;

            try {
                setLoadingPosts(true);
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                const response = await axios.post(`${ngrokAPI}/getUserPosts`, { token, UserId });
                if (response.data.status === 'success') {
                    setPosts(response.data.data);
                } else {
                    console.error('Failed to fetch images:', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoadingPosts(false);
            }
        };

        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token && userData?._id) {
                    const gameData = await fetchGameData(token, userData._id);
                    if (gameData) {
                        setPoints(gameData.points);
                        setStreak(gameData.streak);
                    }
                }
            } catch (error) {
                console.error("Error fetching game data:", error);
            }
        };

        fetchData();
        fetchUserPosts();
    }, [userData, isLoggingOut]);

    // Determine league and badge based on points
    useEffect(() => {
        if (points !== null) {
            if (points >= 30000) {
                setLeague("OLYMPIAN");
                setBadgeImage(images.Olympian);
            } else if (points >= 20000) {
                setLeague("TITAN");
                setBadgeImage(images.titan);
            } else if (points >= 12000) {
                setLeague("SKIPPER");
                setBadgeImage(images.skipper);
            } else if (points >= 5000) {
                setLeague("PILOT");
                setBadgeImage(images.pilot);
            } else if (points >= 1000) {
                setLeague("PRIVATE");
                setBadgeImage(images.Private);
            } else {
                setLeague("NOVICE");
                setBadgeImage(images.novice);
            }
        }
    }, [points]);

    // Header and tab navigation
    const renderHeader = () => (
        <>
            <View className="px-4 py-2">
                <CustomButton title="Logout" handlePress={handleSignOut} />
            </View>
            <View className="flex-row items-center justify-between mt-10 px-4">
                <Image source={userData.profileImage} className="w-20 h-20 rounded-full" />
                <TouchableOpacity className="mt-12 px-6">
                    <Image source={images.followButton}/>
                </TouchableOpacity>
                <Image className="w-20 h-20 rounded-full" resizeMode="cover" />
                {badgeImage ? (
                    <Image source={badgeImage} className="w-28 h-28" resizeMode="contain" />
                ) : (
                    <Text className="text-gray-500">Loading badge...</Text>
                )}
            </View>
            <View className="flex-row px-4">
            </View>
            <View className="flex-row items-center justify-between mt-6 px-4">
                <Text className="text-3xl font-poppins font-bold text-white">
                    {userData?.username || "User"}
                </Text>
                <Text className="font-raleway text-3xl text-blue-400">
                    {streak !== null ? streak : "Loading streak..."}
                </Text>
            </View>
            <View className="flex-row justify-around mt-6 border-b border-gray-600 px-4">
                {['POSTS', 'WORKOUTS', 'PLAYLISTS', 'LEAGUE'].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
                        <Text className={`text-lg ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );

    // Fallback if no posts exist
    const renderPostsFallback = () => (
        <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-gray-500 italic">
                {userData?.username || "User"} has not posted yet
            </Text>
            <TouchableOpacity onPress={() => router.push("/(components)/CreatePost")}>
                <View className="bg-gray-800 rounded-2xl p-2 mt-2">
                    <Text className="text-white">Create a post</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    // Render POSTS content by mapping over posts array
    const renderPosts = () => (
        <>
            {posts.map((item) => (
                <View key={item._id} className="px-4 mb-4">
                    <PostCard post={item} />
                </View>
            ))}
        </>
    );

    // For other tabs, wrap content in a ScrollView as well.
    return (
        <SafeAreaView className="px-6 bg-black h-full">
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
                {renderHeader()}
                {activeTab === 'POSTS' && (
                    loadingPosts ? (
                        <View className="flex-1 justify-center items-center my-4">
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        </View>
                    ) : (
                        posts.length > 0 ? (
                            <PostScreen posts={posts} />
                        ) : (
                            renderPostsFallback()
                        )
                    )
                )}
                {activeTab === 'WORKOUTS' && (
                    <View className="flex-1 justify-center items-center mt-4">
                        <Text className="text-gray-500 italic">No workouts available yet</Text>
                    </View>
                )}
                {activeTab === 'PLAYLISTS' && (
                    <View className="flex-1 justify-center items-center mt-4">
                        <Text className="text-gray-500 italic">No playlists created</Text>
                    </View>
                )}
                {activeTab === 'LEAGUE' && (
                    <View className="flex-1 mt-4">
                        {points !== null ? (
                            <LeagueScreen userXP={points} League={league} />
                        ) : (
                            <Text className="text-gray-500 text-center">Loading League...</Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
