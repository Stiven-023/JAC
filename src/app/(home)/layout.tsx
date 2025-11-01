import MainFooter from "@components/MainFooter";
import MainHeader from "@components/MainHeader";
import "../globals.css";
import HomeHeader from "../components/HomeHeader";
export default function HomeLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">


                <HomeHeader />
                <main className="flex-1 flex items-center justify-center">{children}</main>

                <MainFooter />
            </body>


        </html>
    )
}