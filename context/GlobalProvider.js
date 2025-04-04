import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import nativeReanimated from "react-native-reanimated/src/NativeReanimated";

export const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState('');
    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(true);
    const [questionStatus, setQuestionStatus] = useState(false);
    const [userGameData, setUserGameData] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState('');
    const ngrokAPI = 'https://c647-140-209-96-63.ngrok-free.app'


    // function to sign up the user
    const signUpUser = async (username, email, password, profile) => {
        console.log(profile);
        try{
            const response = await axios.post(`${ngrokAPI}/register`, {username, email, password, profile});
            const data = response.data;
            console.log(data)
            if (data.status === "success") {
                await AsyncStorage.setItem("token", data.data); // Save the JWT token
                await AsyncStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);
                fetchUserData(data.data);
                return { status: "success"};
            } else {
                return {success: false, message: data.message};
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "Login failed." };
        }
    }

    // Function to log in the user
    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${ngrokAPI}/login`, { email, password });
            const data = response.data;

            if (data.status === "success") {
                await AsyncStorage.setItem("token", data.data); // Save the JWT token
                await AsyncStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);
                setUser(data.user);

                // Fetch user data immediately after login
                await fetchUserData(data.data);

                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "Login failed." };
        }
    };


    const fetchUserPosts = async () => {
        if (!userData?._id) {
            console.error('No user ID available');
            return;
        }

        try {
            // Get the token from AsyncStorage
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await fetch(`${ngrokAPI}/UserImages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    UserId: userData._id
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                setUserPosts(result.data);
            } else {
                console.error('Failed to fetch posts:', result.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };


    // Function to log out the user
    const logoutUser = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setUser(null);
            setUserData(null); // Clear user data
            setQuestionStatus(false);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // Function to check the login state
    const checkLoginState = async () => {
        try {
            const loggedIn = await AsyncStorage.getItem("isLoggedIn");
            const token = await AsyncStorage.getItem("token");
            if (loggedIn === "true" && token) {
                setIsLoggedIn(true);
                fetchUserData(token); // Fetch user data using the token

            }
        } catch (error) {
            console.error("Error checking login state:", error);
        } finally {
            setLoading(false);
        }
    };

    // get the user data
    const fetchUserData = async (token) => {
        try {
            const response = await axios.post(`${ngrokAPI}/userdata`, { token });
            if (response.data.status === "success") {
                setUserData(response.data.data);
            } else {
                console.error("Failed to fetch user data:", response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // get the game data
    const fetchGameData = async (token, UserID) => {
        try {
            const response = await axios.post(`${ngrokAPI}/gamedata`, {token, UserID});
            if (response.data.status === "success") {
                setUserGameData(response.data.data);
                return response.data.data;
            } else {
                console.error("Failed to fetch user data:", response.data.data);
            }
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }

    //get the workout data
    const fetchWorkout = async (token, UserID) => {
        try{
            const response = await axios.post(`${ngrokAPI}/workout`, {token, UserID});
            if (response.data.status === "success") {
                return response.data.data;
            } else {
                console.error("Failed to fetch workout data:", response.data.data);
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    }


    const fetchQuestionnaireCompletion = async ()  => {
        try{
            const response = userData.questionnaire;
            console.log("user completion", response);
            setCompletedQuestions(response);
        } catch {
            console.error("Failed to fetch questionnaire completion:", error);
        }
    }

    const AI = async () => {
        //const message = `what is ${random} * ${random}`
        console.log(message)

        try {
            // Send API request
            const res = await axios.post("http://localhost:5001/AI", {
                //message,
            });

            const chatResponse = res.data.reply.content;
            console.log("ChatGPT Response:", chatResponse);

            // Save response to state
            setWorkoutPlan(chatResponse);

        } catch (error) {
            console.error("Error communicating with ChatGPT:", error);
        }
    }

    // Function to mark the questionnaire as completed
    const markQuestionnaireCompleted = async () => {
        try {
            const UserID = userData._id;
            console.log(UserID)
            axios.post("http://localhost:5001/mark-questionnaire",  {UserID} );
            setQuestionStatus(true);
            console.log(questionStatus);
        } catch (error) {
            console.error("Error marking questionnaire as completed:", error);
            return { success: false, message: "Failed to mark questionnaire as completed." };
        }
    };

    useEffect(() => {
        checkLoginState();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                user,
                userData, // Expose userData to the rest of the app
                loading,
                questionStatus,
                userGameData,
                ngrokAPI,
                fetchUserPosts,
                signUpUser,
                loginUser,
                logoutUser,
                fetchQuestionnaireCompletion,
                markQuestionnaireCompleted,
                fetchUserData, // Expose fetchUserData if needed elsewhere
                fetchGameData,
                fetchWorkout
            }}
        >
            {!loading && children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
