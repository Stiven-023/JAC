'use client'

import MainFooter from "@/components/MainFooter";
import "../globals.css";
import HomeHeader from "../../components/HomeHeader";


export default function HomeLayout({ children }: { children: React.ReactNode }) {


    return (
        <main className="min-h-screen">
            <HomeHeader />
            <div className="px-4">
                {children}
            </div>
            <MainFooter />
        </main>
    )
}