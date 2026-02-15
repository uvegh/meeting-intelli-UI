"use client";
import { Meeting } from "@/lib/types";
import { createContext,ReactNode,useContext } from "react";

interface MeetingContextType {
 meeting: Meeting;
 children?:ReactNode;
}
 export const MeetingContext = createContext<MeetingContextType>({
    meeting:{} as Meeting
})
export const MeetingProvider =({meeting,children}:MeetingContextType)=>{
    

    return(
        <MeetingContext.Provider value={{meeting}} >
|            {children}
        </MeetingContext.Provider>
    )
}