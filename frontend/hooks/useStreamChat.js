import {useQuery} from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.STREAM_API_KEY;

// hook -> to connect the current user to stream chat api
// so that user can see other messages, send messages to each other and real time updates
// also handles disconnection when user leaves the page

export const useStreamChat = () => {
    const {user} = useUser();
    const [chatClient,setChatClient] = useState(null);

    // fetch the stream token using tan query

    const {data:tokenData,isLoading:tokenLoading,error:tokenError} = useQuery({
        queryKey : ['streamToken'],
        queryFn : getStreamToken,
        enabled : !!user?.id, // take object and convert to boolean value
    });

    // init stream chat client

    useEffect(() => {
        const initChat = async() => {
            if(!tokenData?.token || !user) return;

            try{
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser({
                    id: user._id,
                    name: user.fullName,
                    image : user.imageUrl
                });
                setChatClient(client);    
            }catch(error){
                console.log("Error connecting to Stream" , error);
                Sentry.captureException(error, {
                    tags: {component: "useStreamChat"},
                    extra : {
                        context : "stream_chat_connection",
                        userId : user?.id,
                        streamApiKey : STREAM_API_KEY ? "present" : "missing",
                    },
                });
            }
        }
        initChat();

        // cleanup

        return () => {
            if(chatClient) chatClient.disconnectUser();
        }
    }, [tokenData,user, chatClient]);

    return {chatClient,isLoading : tokenLoading, error :tokenError};
};