import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import axios from "axios";
import images from "@/constants/images"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useGlobal} from "@/context/GlobalProvider";
import CustomButton from "@/components/CustomButton";

const Questionnaire = () => {
    const {userData, logoutUser ,markQuestionnaireCompleted, ngrokAPI } = useGlobal()
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [age, setAge] = useState(0);
    const [weight, setWeight] = useState(0);
    const [fitness, setFitness] = useState('')
    const [workoutDays, setWorkoutDays] = useState(0)
    const [goal, setGoal] = useState('')
    const [equipmentAvailable, setEquipmentAvailable] = useState('');
    const [medicalCondition, setMedicalCondition] = useState(false);
    const [injuryType, setInjuryType] = useState('');
    const [sleepQuality, setSleepQuality] = useState('');
    const [stressLevel, setStressLevel] = useState('');
    const [nutritionQuality, setNutritionQuality] = useState('')
    const [changeDays, setChangeDays] = useState(false)
    useEffect(() => {

    }, []);

    const handleSubmit = () => {
        setLoading(true);
        console.log(userData)
        try {
            const fitnessData = {
                UserID: userData._id,
                gender: gender,
                weight: weight,
                fitnessLevel: fitness,
                workoutDays: workoutDays,
                fitnessGoal: goal,
            };
            const points ={
                UserID: userData._id,
                streak: 0,
                points: 0
            }
            const message = `Generate a workout plan for ${workoutDays} days with warmups, exercises and reps for a ${gender}, ${age} years old, who weights ${weight} lbs. has a fitness level of ${fitness} and primary goal to ${goal}. has ${equipmentAvailable}. ${medicalCondition ? `has injury type of ${injuryType}`:`has no medical conditions`}. has a ${sleepQuality} sleep quality and a ${stressLevel} stress level`
            const UserID = userData._id // Pass the userID here

            axios.post(`${ngrokAPI}/fitnessInfo`, fitnessData)
                .then(res => {
                    console.log("hello 1 ", res.data)
                    markQuestionnaireCompleted()
                    axios.post(`${ngrokAPI}/gameSystem`, points)
                        .then((res) => {
                            console.log("game system created", res.data)
                            axios.post(`${ngrokAPI}/aI`, {message, UserID})
                                .then(res => {
                                    console.log("Workout saved successfully! Response:", res.data)
                                    router.push('/LoadingScreen');
                            })
                        })
                })
                .catch(e => console.log(e));

        } catch (error) {
            console.log(error)
        }
    }
    const handleSignOut = async () =>{
        await logoutUser();
    }
    const handleNext = async () => {
        if (questionIndex < questions.length - 1) {
            setQuestionIndex(questionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSelection = (setter: (arg0: any) => void, value: any) => {
        setter(value);
        handleNext();
    };



    const questions = [
        {
            // AGE QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">Let's start off simple.</Text>
                    <View className="mt-40 px-20">
                    <Text className="text-white text-lg font-bold mb-4">What is your age?</Text>
                    <TextInput
                        className="bg-gray-500 text-white p-4 rounded"
                        keyboardType="numeric"
                        placeholder="Enter your age"
                        placeholderTextColor="#888"
                        value={age.toString()}
                        onChangeText={(text) => setAge(parseFloat(text) || 0)}
                    />
                        <TouchableOpacity className="bg-white p-4 rounded mt-6" onPress={handleNext}>
                            <Text className="text-black text-center font-bold">Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
            // GENDER QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <Text className="text-white text-lg font-bold mb-4 mt-60 font-poppins text-center">Where you born a male or female?</Text>
                    <View className="flex-row px-20">
                        <View className="flex-row mt-6">
                            <Image source={images.womanIcon} resizeMode="cover"></Image>
                            <View className="flex-row px-40" >
                                <Image source={images.maleIcon} resizeMode="cover"></Image>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row px-9 space-x-4 mt-6">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14" onPress={() => handleSelection(setGender, 'Male')}>
                            <Text className="text-center text-black">Male</Text>
                        </TouchableOpacity>
                        <View className="flex-row px-10">
                            <TouchableOpacity className="bg-white p-4 rounded-2xl px-14" onPress={() => handleSelection(setGender, 'Female')}>
                                <Text className="text-center text-black">Female</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ),
        },
        {
            // WEIGHT QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-40 px-10">
                        <Text className="text-white text-2xl font-bold mb-4">What is your current weight?</Text>
                    </View>
                    <View className="mt-7 px-28">
                    <TextInput
                        className="bg-gray-800 text-white p-4 rounded-xl mt-6"
                        keyboardType="numeric"
                        placeholder="Enter your weight"
                        placeholderTextColor="#888"
                        value={weight.toString()}
                        onChangeText={(text) => setWeight(parseFloat(text) || 0)}
                    />
                        <TouchableOpacity className="bg-white p-4 rounded mt-6" onPress={handleNext}>
                            <Text className="text-black text-center font-bold">Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        // WORKOUT DAYS QUESTIONS
        {
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-24 px-14">
                        <Text className="text-white text-2xl font-bold mb-4">How  many days a week are you currently working out?</Text>
                    </View>
                    <View className="mt-7 px-16">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14" onPress={() => handleSelection(setWorkoutDays, 0)}>
                            <Text className="text-center font-poppins-semibold text-black">0, that's why I'm here</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14 mt-7" onPress={() => handleSelection(setWorkoutDays, 2)}>
                            <Text className="text-center font-poppins-semibold text-black">1-2 day(s) a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14 mt-7" onPress={() => handleSelection(setWorkoutDays, 4)}>
                            <Text className="text-center font-poppins-semibold text-black">3-4 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14 mt-7" onPress={() => handleSelection(setWorkoutDays, 6)}>
                            <Text className="text-center font-poppins-semibold text-black">5-6 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-14 mt-7" onPress={() => handleSelection(setWorkoutDays, 7)}>
                            <Text className="text-center font-poppins-semibold text-black">Everyday</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
            //SLEEP QUALITY QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-40 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4">Describe your sleep routine</Text>
                    </View>
                    <View className="mt-7 px-10">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setSleepQuality, "Very consistent, 8 hours")}>
                            <Text className="text-center font-poppins-semibold text-black">Very consistent, at least 8 hours </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setSleepQuality, "Moderately good")}>
                            <Text className="text-center font-poppins-semibold text-black">Moderately good, some off days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setSleepQuality, "Very inconsistent")}>
                            <Text className="text-center font-poppins-semibold text-black">Very inconsistent, I never
                                get 8 hours</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
            //STRESS LEVEL QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-40 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">How would you describe your stress?</Text>
                    </View>
                    <View className="mt-7 px-10">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setStressLevel, "High Stress")}>
                            <Text className="text-center font-poppins-semibold text-black">High Stress lifestyle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setStressLevel, "Occasional stress")}>
                            <Text className="text-center font-poppins-semibold text-black">Occasional stress</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
            // fitness level
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-40 px-6 items-center">
                        <Text className="text-white text-2xl font-bold mb-4">What is your fitness experience?</Text>
                    </View>
                    <View className="mt-7 px-6">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setFitness, "Beginner")}>
                            <Text className="text-center font-poppins-semibold text-black">I’m just getting into fitness</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setFitness, "Intermediate")}>
                            <Text className="text-center font-poppins-semibold text-black">I have some fitness experience</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setFitness, "Expert")}>
                            <Text className="text-center font-poppins-semibold text-black">I am currently active and consistent </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        {
            //MEDICAL CONDITIONS QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">A thing or two about you.</Text>
                    <View className="mt-40 px-6 items-center">
                        <Text className="text-white text-2xl font-bold mb-4">What is your fitness experience?</Text>
                    </View>
                    <View className="mt-7 px-6">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setMedicalCondition, false)}>
                            <Text className="text-center font-poppins-semibold text-black">No/rather not share</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-20 px-6 items-center">
                        <Text className="text-white text-2xl font-bold mb-4">If so, type in the box below</Text>
                    </View>
                        <View className="mt-4 px-10">
                            <TextInput
                                className="bg-gray-800 text-white p-6 rounded"
                                placeholder="Example: Asthma..."
                                placeholderTextColor="#B0B0B0"
                                onChangeText={setInjuryType}
                            />
                        </View>
                    <View className="items-center px-10 mt-6">
                    <Text className="text-gray-500 font-bold">
                        Not required if you are not comfortable sharing. You don’t have to be too specific. Information shared with ANKYR is kept confidential.
                    </Text>
                    </View>
                </View>
            ),
        },
        {
            // CHANGE WORKOUT DAYS QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">Set your goals</Text>
                    <View className="mt-40 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            Would you like to change the days you work out?
                        </Text>
                    </View>
                    <View className="mt-7 px-10">
                        <TouchableOpacity
                            className="bg-white p-4 rounded-2xl px-6"
                            onPress={() => {
                                setChangeDays(true);
                                setQuestionIndex(questionIndex + 1); // Move to the new workout days question
                            }}
                        >
                            <Text className="text-center font-poppins-semibold text-black">Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-white p-4 rounded-2xl px-6 mt-7"
                            onPress={() => {
                                setChangeDays(false);
                                setQuestionIndex(questionIndex + 2); // Skip workout days question and go to fitness goals
                            }}
                        >
                            <Text className="text-center font-poppins-semibold text-black">No, I like my routine</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">Set your goals</Text>
                    <View className="mt-20 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                           How many days would you like to work out?
                        </Text>
                    </View>
                    <View className="mt-7 px-10">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setWorkoutDays, 1)}>
                            <Text className="text-center font-poppins-semibold text-black">1 Day a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setWorkoutDays, 2)}>
                            <Text className="text-center font-poppins-semibold text-black">2 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setWorkoutDays, 3)}>
                            <Text className="text-center font-poppins-semibold text-black">3 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setWorkoutDays, 4)}>
                            <Text className="text-center font-poppins-semibold text-black">4 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setWorkoutDays, 5)}>
                            <Text className="text-center font-poppins-semibold text-black">5 days a week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setWorkoutDays, 6)}>
                            <Text className="text-center font-poppins-semibold text-black">6 days a week</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        {
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">Set your goals</Text>
                    <View className="mt-20 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            What is your main fitness goal?
                        </Text>
                    </View>
                    <View className="mt-7 px-10">
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6" onPress={() => handleSelection(setGoal, "lose weight" )}>
                            <Text className="text-center font-poppins-semibold text-black">Lose Weight</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setGoal, "Build Muscle" )}>
                            <Text className="text-center font-poppins-semibold text-black">Build Muscle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setGoal, "lose weight and build muscle" )}>
                            <Text className="text-center font-poppins-semibold text-black">Both of the above</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setGoal, "running" )}>
                            <Text className="text-center font-poppins-semibold text-black">Running</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setGoal, "be active" )}>
                            <Text className="text-center font-poppins-semibold text-black">I just want to be active</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        {
            // EQUIPMENT AVAILABLE QUESTION
            question: (
                <View>
                    <Text className="text-white text-3xl font-bold font-poppins">Set your goals</Text>
                    <View className="mt-20 px-10 items-center">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            What equipment do you have access to?
                        </Text>
                    </View>
                    <View className="mt-7 px-10">

                    <TouchableOpacity className="bg-white p-4 rounded-2xl" onPress={() => handleSelection(setEquipmentAvailable, "full gym" )}>
                        <Text className="text-center font-poppins-semibold text-black">Gym membership</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setEquipmentAvailable, "small at home gym" )}>
                        <Text className="text-center font-poppins-semibold text-black">Small home gym</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white p-4 rounded-2xl px-6 mt-7" onPress={() => handleSelection(setGoal, "no equipment" )}>
                        <Text className="text-center font-poppins-semibold text-black">I dont have access to equipment</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            ),
        },
    ]
    return (
        <SafeAreaView className="bg-black h-full">
            {/* Show Loading Screen if loading is true */}
            {loading ? (
                <View className="flex-1 mt-10 justify-center items-center">
                    <Text className="text-white text-2xl font-bold font-poppins">Give us a second while our A.I. is personalizes your workouts...</Text>
                </View>
            ) : (
                // Show questionnaire if not loading
                <View className="p-4">
                    <View>{questions[questionIndex].question}</View>
                </View>
            )}
        </SafeAreaView>
    )
}
// @ts-ignore
export default Questionnaire
