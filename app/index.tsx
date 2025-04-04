import {View, Text, ScrollView, Image, ImageBackground, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images"
import CustomButton from "@/components/CustomButton";
import {Redirect, router} from "expo-router";
import {useGlobal} from "@/context/GlobalProvider";

const index = () => {
    const { loading,isLoggedIn, questionStatus} = useGlobal();

    if (isLoggedIn) {
        console.log(isLoggedIn)
        return <Redirect href="/home"/>
    }
    return (
        <ImageBackground source={images.onboard} className="h-full w-full " resizeMode="cover">
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerClassName=" items-center">
                    <View className="px-10 mt-40 ">
                        <Image source={images.ankyr} className="ml-36 w-40 h-40"/>
                        <Text className=" text-white text-2xl font-poppins font-bold text-center">it's time to actualize your</Text>
                        <Text className="text-white text-2xl font-poppins font-bold text-center">potential with</Text>
                        <Text className="mt-10 text-white text-7xl font-poppins font-bold text-center">A N K Y R</Text>
                        <CustomButton
                            title="Log In or Sign Up"
                            handlePress={()=> router.push("/sign-in")}
                        />
                        <Text className="text-white text-center mt-7">Everything you need to help you reach your goals; whether its new workouts, meal plans, or a bomb</Text>
                        <Text className="text-white text-center ">gym playlist.</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    )
}
export default index
