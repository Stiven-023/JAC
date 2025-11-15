import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import "../globals.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
            <div className="flex flex-col min-h-screen">
                <MainHeader />
                <main className="flex-1 flex items-center justify-center">
                    {children}
                </main>
                <MainFooter />
            </div>
    )
}