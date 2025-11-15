'use client'

import MainFooter from "@components/MainFooter";
import MainHeader from "@components/MainHeader";
import "../globals.css";
import HomeHeader from "../components/HomeHeader";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});
export default function HomeLayout({ children }: { children: React.ReactNode }) {


    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">

                <ThemeProvider theme={theme}>

                    <HomeHeader />
                    <main >
                        {children}
                        <CssBaseline />
                    </main>
                    <MainFooter />
                </ThemeProvider>
            </body>


        </html>
    )
}