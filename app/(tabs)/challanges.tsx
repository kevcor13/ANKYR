import React, { useEffect, useState } from "react";
import {View, Text, FlatList, ScrollView, TouchableOpacity} from "react-native";
import {useGlobal} from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ChallengesPage: React.FC = () => {
    const [dailyChallengesOpen, setDailyChallengesOpen] = useState(false);
    const { userData, fetchWorkout, userGameData } = useGlobal()
    const [mondayWorkoutOpen, setMondayWorkoutOpen] = useState(false);
    const [random, setRandom] = useState('legs')
    const [currentDay, setCurrentDay] = useState('')
    const [workoutRoutine, setWorkoutRoutine] = useState([])
    const [todayWorkout, setTodayWorkout] = useState(null); // State for today's workout
    const [randomData, setRandomData] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const workout = await fetchWorkout(token, userData._id);


                // Ensure the workout data exists and has the correct structure
                const routineArray = workout?.routine || [];
                setWorkoutRoutine(routineArray);

                // Get the current day
                const today = new Date().toLocaleString("en-US", { weekday: "long" });
                setCurrentDay(today);

                // Find today's workout in the routine array
                const workoutOfTheDay = routineArray.find((dayRoutine: { day: string; }) => dayRoutine.day === today);

                // Extract today's workoutRoutine if available, otherwise set to null
                setTodayWorkout(workoutOfTheDay?.workoutRoutine || null);

                console.log("Workout for today:", workoutOfTheDay);
            } catch (error) {
                console.error("Error fetching workout data:", error);
            }
        };

        fetchData();
    }, [userData]);


    const press= (name: any) =>{

    }

    const renderExercises = (exercises: any[]) =>
        exercises.map((exercise, index) => (
            <TouchableOpacity onPress={() => press(exercise.exercise)}>
            <View
                key={index}
                className="flex-row items-center bg-gray-800 rounded-lg p-4 mb-4"
            >
                {/* Exercise Image
                <View className="w-16 h-16 bg-gray-900 rounded-full overflow-hidden mr-4">
                    <Image
                        source={{ uri: exercise.image || 'https://via.placeholder.com/150' }} // Replace with actual image URL if available
                        className="w-full h-full object-cover"
                    />
                </View>
                */}
                {/* Exercise Details */}
                <View>
                    <Text className="text-white font-bold text-lg">{exercise.exercise}</Text>
                    <Text className="text-gray-400">
                        {exercise.sets
                            ? `${exercise.sets} sets x ${exercise.reps} reps`
                            : exercise.duration}
                    </Text>
                </View>
            </View>
            </TouchableOpacity>
        ));

    const AI = async () => {
        try {
            const message = `"Generate a full week workout plan with warmups, exercises, and sets/reps for each day."`;
            const UserID = userData._id;
            console.log("Requesting workout plan with message:", message);

            // Send the request to the new endpoint
            const response = await axios.post("http://localhost:5001/aI", {message, UserID});

            // Log the response from the server
            console.log("Workout saved successfully! Response:", response.data);
        } catch (error) {
            console.error("Error generating and saving workout:");
        }
    };

    return(
        <ScrollView className="flex-1 bg-black px-4">
            <View className="mt-8">
                {/* Header Section */}
                <View className=" mt-16 flex-row justify-between items-center">
                    <Text className="text-white text-2xl font-bold">Challenges.</Text>
                    <Text className="text-teal-200 text-lg">{`${userGameData.points} XP`}</Text>
                </View>
                <Text className="text-gray-400 mt-10">{`Earn XP through challenges and streaks to go up league ranks and earn rewards.`}</Text>
                <View className="px-20">
                    <TouchableOpacity className="bg-teal-100 py-3 rounded-lg mt-4"
                        onPress={() => AI()}
                    >
                        <Text
                            className="text-black text-center font-poppins">Learn more</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Challenges Dropdown */}
                <View className="mt-10 mb-0">
                    <TouchableOpacity
                        className="flex-row justify-between items-center"
                        onPress={() => setDailyChallengesOpen(!dailyChallengesOpen)}
                    >
                        <Text className="text-white font-poppins font-bold text-2xl">DAILY CHALLENGES</Text>
                        <Text className="text-white text-xl">{dailyChallengesOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {dailyChallengesOpen && (
                        <View className="mt-4 mb-0">
                            <Text className="text-gray-400">INCOMPLETE:</Text>
                            <Text className="text-white mt-2">☐ Complete workout - <Text className="text-blue-400">25 XP</Text></Text>
                            <Text className="text-white mt-2">☐ Drink 60oz water - <Text className="text-blue-400">10 XP</Text></Text>
                        </View>
                    )}
                </View>

                {/* Your Monday Workout Dropdown */}
                <View className="mt-8">
                    <TouchableOpacity
                        className="flex-row justify-between items-center"
                        onPress={() => setMondayWorkoutOpen(!mondayWorkoutOpen)}
                    >
                        <Text className="text-white font-poppins-semibold text-3xl uppercase">{`Your ${currentDay} workout`}</Text>
                        <Text className="text-white text-xl">{mondayWorkoutOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {mondayWorkoutOpen && (
                        <View className="mt-6">
                            {todayWorkout ? (
                                <View className="space-y-4">{renderExercises(todayWorkout)}</View>
                            ) : (
                                <Text className="text-gray-400 mt-2">No workout scheduled for today.</Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Additional Sections */}
                <View className="mt-6">
                    <Text className="text-red-700 font-poppins font-bold text-2xl">LEAGUE</Text>
                </View>
                <View className="mt-6">
                    <Text className="text-white font-poppins font-bold text-2xl">EXTRA CHALLENGES</Text>
                </View>
                <View className="mt-6">
                    <Text className="text-white font-poppins font-bold text-2xl">EDIT CHALLENGES</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ChallengesPage;
