import {StreamChat} from 'stream-chat';
import {ENV} from '../config/env.js'

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY,ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUser(userData);
        console.log("Stream user upserted successfully", userData.name);
        return userData;
    }catch(error){
        console.log("Error upserting Stream user" , error);
    }
};

export const deleteStreamUser = async(userId) =>{
    try{
        await streamClient.deleteUser(userId);
        console.log("Stream User deleted successfully", userId);
    }catch(error){
        console.error("Error deleting stream user" , error);
    }
};

// stream creates a token for auth

export const generateStreamToken = (userId) =>{
    try{
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    }catch(error){
        console.log("Error generating stream Token", error);
        return null;
    }
}