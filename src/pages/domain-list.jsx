import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import DomainCard from "@/components/DomainCard";
import domainData from "@/data/domain.json";
import { useState } from "react";

const DomainList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDomains = domainData.filter(domain => 
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SidebarProvider>
            <div className="flex bg-background text-foreground w-full relative">
                <Sidebar />
                <div className="flex flex-col flex-1 min-h-screen">
                    <SideHeader 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                    <main className="flex-1 p-6 relative mt-16"> {/* Added mt-16 for header spacing */}
                        <div className="max-w-4xl mx-auto"> {/* Container for better alignment */}
                            <h1 className="text-3xl font-bold mb-8">Domains</h1>
                            <div className="space-y-4"> {/* Single column layout */}
                                <DomainCard domainData={filteredDomains} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default DomainList;