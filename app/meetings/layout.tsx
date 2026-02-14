import { Meeting } from "@/lib/types";
import { MeetingProvider } from "@/Providers/MeetingProviders"


function MeetingLayout({ children }: { children: React.ReactNode }) {
    const meeting:Meeting= {} as Meeting // Replace with actual meeting data fetching logic
  return (
    <MeetingProvider meeting={meeting}>
      {children}    
    </MeetingProvider>
  )
}

export default MeetingLayout    
