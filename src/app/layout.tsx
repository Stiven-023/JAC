'use client'

import { Toaster } from "react-hot-toast";
import "./globals.css";

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
export default function RootLayout({ children }: { children: React.ReactNode }) {


    return (
        <html lang="en">
            <body>
                <Toaster
                position="bottom-right"
                reverseOrder={false}
                />
                <ThemeProvider theme={theme}>
                {children}
                <CssBaseline />
                </ThemeProvider>
            </body>


        </html>
    )
}