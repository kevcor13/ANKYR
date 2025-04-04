import {View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, TextInput, Alert} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images"
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import {Link, router} from "expo-router";
import axios from 'axios';
import {useGlobal} from "@/context/GlobalProvider";

const SignUp = () => {
    const {signUpUser} = useGlobal()
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const profile = images.ProfileImage

    const submit = async () =>{
        const result = await signUpUser(username, email, password, profile);
        console.log("this is the part", result.status);
        if(result.status === "success"){
            router.push("/home");
        } else {
            console.log(result);
        }
    }

    return (
        <ImageBackground source={images.login} className="h-full w-full " resizeMode="cover">
            <ScrollView>
                <View className="flex justify-center mt-40 py-4 px-6">
                    <Text className="text-white font-poppins text-3xl">Welcome Back.</Text>

                    {/* the username input box */}
                    <Text className="text-white mt-6">Username</Text>
                    <View className="bg-black/40 mt-4 px-4 rounded-2xl py-4 focus:border-black">
                        <TextInput
                            className="text-white font-poppins"
                            onChangeText={(e) => setUsername(e)}
                        />
                    </View>

                    {/*the email input box*/}
                    <Text className="text-white mt-6">Email</Text>
                    <View className="bg-black/40 mt-4 px-4 rounded-2xl py-4 focus:border-black">
                        <TextInput
                            className="text-white font-poppins"
                            onChangeText={(e) => setEmail(e)}
                        />
                    </View>

                    {/*the password input box*/}
                    <Text className="text-white mt-6">Password</Text>
                    <View className="bg-black/40 mt-4 px-4 rounded-2xl py-4 focus:border-black flex-row ">
                        <TextInput
                            className="flex-1 text-white font-poppins"
                            onChangeText={(e) => setPassword(e)}
                            secureTextEntry={!showPassword}
                        />
                        {/* the eye icon control*/}
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Image
                                source={!showPassword ? images.eye : images.eyeHide}
                                className="h-6 w-6 "
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* login button */}
                    <TouchableOpacity className="bg-white rounded-2xl py-4 mt-20 justify-center" onPress={submit} activeOpacity={0.7}>
                        <View className="flex flex-row items-center justify-center">
                            <Text className="font-poppins text-center text-lg">L O G I N</Text>
                        </View>
                    </TouchableOpacity>

                    {/* switching tabs between login and logout */}
                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-gray-500 text-lg font-poppins">
                            Already have an account?
                        </Text>
                        <Link href="/sign-in" className="text-lg font-poppins text-blue-400">Sign in</Link>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}
export default SignUp
