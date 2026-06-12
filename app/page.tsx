import { LeftSidebar } from "@/components/left-sidebar"
import { CenterColumn } from "@/components/center-column"
import { RightSidebar } from "@/components/right-sidebar"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <LeftSidebar />
        <CenterColumn />
        <RightSidebar />
      </div>
    </div>
  )
}
