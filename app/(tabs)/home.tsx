import {View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images"
import icons from "@/constants/icons"
import {useGlobal} from "@/context/GlobalProvider";
import {router} from "expo-router";

const Home = () => {
    const { userData, logoutUser } = useGlobal();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set a short timeout to ensure userData is loaded
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (!userData) {
                router.push('/(root)/sign-in');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [userData]);

    const handleSignOut = () => {
        logoutUser();
        router.push('/(root)/sign-in');
    }

    if (isLoading) {
        return (
            <SafeAreaView className="bg-black h-full justify-center items-center">
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text className="text-white mt-4">Loading your data...</Text>
            </SafeAreaView>
        );
    }

    if (!userData) return null;

    return (
        <SafeAreaView className="bg-black h-full">
            <FlatList
                data={[{id:1}, {id:2}, {id:3}]}
                renderItem={({item}) => (
                    <Text className="text-3xl text-white">{item.id}</Text>
                )}
                ListHeaderComponent={() => (
                    <><View className="my-6 px-4 space-y-6">
                        <View className="justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-poppins-medium text-gray-100">Welcome Back</Text>
                                <Text
                                    className="font-poppins-semibold text-2xl text-cyan-100">{userData?.username || "User"}</Text>
                            </View>
                            <View className="mt-[-20]">
                                <Image
                                    source={images.ankyr}
                                    className="w-20 h-20"
                                    resizeMode="contain"/>
                            </View>
                        </View>
                    </View>
                        <View className="mt-[-20] flex-row px-10">
                            <View className="items-center">
                                <TouchableOpacity className="p-6 rounded-full bg-white">
                                    <Image source={icons.headphonesIcon} className="w-8 h-8"/>
                                </TouchableOpacity>
                                <Text className="text-white font-poppins-semibold mt-4 text-center text-lg">Playlist</Text>
                            </View>
                            <View className="items-center px-12">
                                <TouchableOpacity className="p-6 rounded-full bg-white">
                                    <Image source={icons.libraryIcon} className="w-8 h-8"/>
                                </TouchableOpacity>
                                <Text className="text-white font-poppins-semibold mt-4 text-center text-lg">Your library</Text>
                            </View>
                            <View className="items-center">
                                <TouchableOpacity
                                    className="p-6 rounded-full bg-white"
                                    onPress={() => router.push("/(components)/SearchScreen?query=")}
                                >
                                    <Image source={icons.searchIcon} className="w-8 h-8" />
                                </TouchableOpacity>
                                <Text className="text-white font-poppins-semibold mt-4 text-center text-lg">Search</Text>
                            </View>
                        </View>
                    </>
                )}
            />
            <View>
                <Text className="text-white">hello</Text>
            </View>
        </SafeAreaView>
    )
}

export default Home