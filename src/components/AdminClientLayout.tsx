'use client';

import { UserManagement } from "@/components/UserManagement";
import { ServiceManagement } from "@/components/ServiceManagement"; // Asegúrate de que este import exista
import { ResidenteAdmin, ServicioDisponible, Solicitud } from "@/lib/adminActions"; // Importamos los nuevos tipos
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

// 1. ACTUALIZACIÓN DE LA INTERFAZ DE PROPS
interface AdminClientLayoutProps {
    // PROPS DE USUARIOS (Nombres originales respetados)
    initialResidents: ResidenteAdmin[];
    initialError: string | null;       // Este será el error de la carga de Residentes

    // PROPS DE SERVICIOS
    initialServices: ServicioDisponible[];
    serviceError: string | null;

    // PROPS DE SOLICITUDES
    initialRequests: Solicitud[];
    requestError: string | null;
}

export default function AdminClientLayout({ 
    // Desestructuración de todas las props
    initialResidents, 
    initialError,    // Error de Residentes
    initialServices, 
    serviceError,
    initialRequests, 
    requestError 
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
                            {/* Pestaña 0: Gestión de Usuarios */}
                            {tabIndex === 0 && (
                                <UserManagement
                                    initialResidents={initialResidents}
                                    initialError={initialError} // Error de Residentes
                                />
                            )}
                            {/* Pestaña 1: Gestión de Noticias */}
                            {tabIndex === 1 && <Typography>Gestion de Noticias</Typography>}
                            
                            {/* Pestaña 2: Gestión de Eventos */}
                            {tabIndex === 2 && <Typography>Gestion de eventos</Typography>}
                            
                            {/* Pestaña 3: Servicios y Solicitudes */}
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