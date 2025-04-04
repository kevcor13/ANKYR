
import {Account, Avatars, Client, Databases, ID, Query} from 'react-native-appwrite';

export const config = {
    endpoint:"https://cloud.appwrite.io/v1",
    platform:"com.ankyr.Ankyr",
    projectID:"670dcd780032e814bc9c",
    databaseID: "670dce6600133baa7172",
    userCollectionID:"670dce7d0036996006d3",
    workoutsCollectionID:"6775b1e40001967daf47",
    storageID:"670dcf8e000a3813136c",
    fitnessDataCollectionId:"6771854c00021f31bc6b",
    gameSystemCollectionId:"677c37a4000e64473410",



    exampleDocumentID:"6775b3060017b919cf8a"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectID) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)
        const newUser = await databases.createDocument(
            config.databaseID,
            config.userCollectionID,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email:email,
                username: username,
                avatar: avatarUrl
            }
        )
        return newUser
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn (email, password) {
    try{
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch(error) {
        throw new Error(error);
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current");
        console.log("session success");
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error();

        const currentUser = await databases.listDocuments(
            config.databaseID,
            config.userCollectionID,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }catch(error){
        console.log(error);
    }
}

{/* this function  creates a fitness document based on user */}
export async function createFitnessData(user, gender, age, weight, goal){
    try {
        const newDocument = await databases.createDocument(
            config.databaseID,
            config.fitnessDataCollectionId,
            ID.unique(),
            {
                user: user.$id,
                gender: gender,
                age: age,
                weight: weight,
                goal: goal,
            }
        )
        return newDocument
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

{/* next two functions mark if the questionnaire has been completed */}
export const checkQuestionnaireStatus = async (userId) => {
    try {
        const response = await databases.getDocument(
            config.databaseID,
            config.userCollectionID,
            userId
        );
        return response.questionnaireCompleted || false;
    } catch (error) {
        console.error("Error checking questionnaire status:", error);
        return false;
    }
};

export const markQuestionnaireCompleted = async (userId) => {
    try {
        await databases.updateDocument(
            config.databaseID,
             config.userCollectionID,
             userId,
            {
            questionnaireCompleted: true,
        });
        console.log("questionnaireCompleted");
    } catch (error) {
        console.error("Error marking questionnaire as completed:", error);
    }
};

{/* fetch workouts */}
export async function fetchMondayWorkouts() {
    try {
        const response = await databases.listDocuments(
            config.databaseID,
            config.workoutsCollectionID
        );

        if (response.documents.length === 0) throw new Error("No documents found.");

        return response.documents[0].Workouts; // Assuming the first document is the one you want
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }
}

export const getPoints = async (user) => {
    try {
        const response = await databases.listDocuments(
            config.databaseID,
            config.gameSystemCollectionId,
            [Query.equal('player', user)]
        )
        return response.documents
    } catch (error) {
        console.error("Error getting points:", error);
    }
}

export const createWorkouts = async (user) => {
    const workoutData = {
        Workouts: [
            {
                day_number: 1,
                exercises: [
                    { name: "Push-Ups", sets: 3, reps: "15-20", rest_time: "60 seconds" },
                    { name: "Squats", sets: 3, reps: "12-15", rest_time: "90 seconds" },
                ],
            },
            {
                day_number: 2,
                exercises: [
                    { name: "Burpees", sets: 3, reps: "10-12", rest_time: "60 seconds" },
                    { name: "Plank", sets: 3, reps: "60 seconds", rest_time: "30 seconds" },
                ],
            },
        ],
    };
    try {
        const response = await databases.createDocument(
            config.databaseID,
            config.workoutsCollectionID,
            ID.unique(),
            workoutData,
        )
        return response
    } catch(error) {
        console.log("error creating document", error);
    }

}

export const fetchWorkout1 = async (user) => {
    try {
        const response = await databases.listDocuments(
            config.databaseID,
            config.workoutsCollectionID,
            [Query.equal('username', user)]
        )
        //const workouts = response.Workouts.map((workout) => JSON.parse(workout));
        return response.Workouts;
    } catch (error) {
        console.error("Error fetching workout:", error);
    }
}
export const fetchWorkout = async (user) => {
    try {
        const response = await databases.listDocuments(
            config.databaseID,
            config.workoutsCollectionID,
            [Query.equal('username', user)]
        );

        if (!response.documents || !Array.isArray(response.documents)) {
            throw new Error("No workouts found or invalid response format.");
        }

        // Log the raw response for debugging
        console.log("Response documents:", response.documents);

        // Extract and parse workout data
        const workouts = response.documents.map(doc => {
            // Use the correct field name for the workouts
            const workoutData = doc.Workouts || doc.workouts || null;
            if (!workoutData) {
                console.warn("Workout data missing in document:", doc);
                return null; // Skip documents without valid workout data
            }

            return typeof workoutData === "string"
                ? JSON.parse(workoutData)
                : workoutData;
        }).filter(workout => workout !== null); // Remove null entries

        console.log("Parsed workouts:", workouts); // Debug
        return workouts;

    } catch (error) {
        console.error("Error fetching workouts:", error.message || error);
        throw error;
    }
};

