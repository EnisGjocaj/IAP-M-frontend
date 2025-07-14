import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "../../components/ui/breadcrumb"
  import { Separator } from "../../components/ui/separator"
  import { SidebarTrigger } from "../../components/ui/sidebar"
  import { DashboardStats } from "../../components/improved-dashboard/dashboard-stats"
  
  export default function DashboardPage() {
    return (    
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
              <p className="text-lg text-gray-600 mt-2">
                Welcome to the IAP-M Admin Dashboard. Monitor your institute's performance and manage student development
                opportunities.
              </p>
            </div>
            <DashboardStats />
          </div>
        </div>
      </>
    )
  }
  