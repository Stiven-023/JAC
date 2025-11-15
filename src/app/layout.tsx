'use client'

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
                <ThemeProvider theme={theme}>
                {children}
                <CssBaseline />
                </ThemeProvider>
            </body>


        </html>
    )
}