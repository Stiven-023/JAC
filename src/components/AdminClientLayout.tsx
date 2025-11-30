'use client';

import { UserManagement } from "@/components/admin/UserManagement";
import { ServiceManagement } from "@/components/admin/ServiceManagement";
import { ResidenteAdmin, ServicioDisponible, Solicitud } from "@/lib/adminActions";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import NoticiasTable from "./admin/NoticiasTable";
import { NoticiaConResidente } from "@/lib/supabase";
import Eventos from "./admin/Eventos";

interface AdminClientLayoutProps {
    initialResidents: ResidenteAdmin[];
    initialError: string | null; 

    // PROPS DE SERVICIOS
    initialServices: ServicioDisponible[];
    serviceError: string | null;

    // PROPS DE SOLICITUDES
    initialRequests: Solicitud[];
    requestError: string | null;
    
    // PROPS DE NOTICIAS
    initialNoticias: NoticiaConResidente[];
}


export default function AdminClientLayout({ 
    initialResidents, 
    initialError, 
    initialServices, 
    serviceError,
    initialRequests, 
    requestError,
    initialNoticias 
}: AdminClientLayoutProps) { 

    const [tabIndex, setTabIndex] = useState(0);

    return (
        <>
            <Grid margin={1} overflow={"hidden"} paddingX={4} paddingTop={5}>
                <Grid>
                    <Typography variant="h4" fontWeight="fontWeightBold">
                        {"Administrador"}
                    </Typography>
                </Grid>
                <Grid>
                    <Box sx={{ width: "100%" }}>
                        <Box paddingTop={3} sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={tabIndex}
                                onChange={(e, newValue) => setTabIndex(newValue)}
                                aria-label="user management tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab label={"Usuarios"} />     
                                <Tab label={"Noticias"} />       
                                <Tab label={"Eventos"} />        
                                <Tab label={"Servicios"} />      
                            </Tabs>
                        </Box>
                        <Box sx={{ padding: 2 }} style={{ maxWidth: '-webkit-fill-available' }}>
                            {/* Usuarios */}
                            {tabIndex === 0 && (
                                <UserManagement
                                    initialResidents={initialResidents}
                                    initialError={initialError}
                                />
                            )}
                            
                            {/*  Noticias */}
                            {tabIndex === 1 && (
                                <NoticiasTable initialNoticias={initialNoticias} />
                            )}
                            
                            {/* Eventos */}
                            {tabIndex === 2 && <Eventos/>}
                            
                            {/* Servicios y Solicitudes */}
                            {tabIndex === 3 && (
                                <ServiceManagement
                                    initialServices={initialServices}
                                    initialServiceError={serviceError} 
                                    initialRequests={initialRequests}
                                    initialRequestError={requestError} 
                                />
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}