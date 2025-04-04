import {View, Text, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";
import icons from '@/constants/images'
const TabsLayout = () => {


    const TabIcon = ({focused, icon, title} : {focused: boolean, icon: any, title: string}) => (
        <View className="flex-1 mt-3 items-center">
            <Image
                source={icon}
                tintColor={focused ? 'white' : 'gray'}
                //tintColor={focused ? "#0061FF" : "#666876"}
                className="size-13"
            />
            <Text
                className={`${
                    focused
                        ? "text-white font-poppins"
                        : "text-white font-poppins"
                } text-xs w-full text-center mt-1`}
            >
                {title}
            </Text>
        </View>
    )
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'black',
                    position: 'absolute',
                    borderTopColor: 'black',
                    borderTopWidth: 1,
                    minHeight: 70,
                },
            }}
        >
            <Tabs.Screen
                name="library"
                options={{
                    title: 'library',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.meals} title="" />
                    )
                }}
            />
            <Tabs.Screen
                name="challanges"
                options={{
                    title: 'challanges',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.streak} title="" />
                    )
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.ankyrIcon} title="" />
                    )
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: "camera",
                    headerShown: false,
                    tabBarStyle: { display: "none" },
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.WheelIcon}/>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.profile} title={''} />
                    )
                }}
            />
        </Tabs>
    )
}
export default TabsLayout
