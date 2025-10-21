import MainHeader from "@components/MainHeader";
import MainFooter from "@components/MainFooter";
import "../globals.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">

            <body className="flex flex-col min-h-screen">
                <MainHeader />
                <main className="flex-1 flex items-center justify-center">{children}</main>
                <MainFooter />
            </body>


        </html>
    )
}