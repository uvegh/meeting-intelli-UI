import { MeetingContext } from "@/Providers/MeetingProviders"
import { useContext } from "react"

export default function useMeetingContext() {
  return useContext(MeetingContext)
}