'use client';

import { UserManagement } from "@/components/admin/UserManagement";
import { ServiceManagement } from "@/components/admin/ServiceManagement";
import { ResidenteAdmin, ServicioDisponible, Solicitud } from "@/lib/adminActions";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import NoticiasTable from "./admin/NoticiasTable";
import { Noticia } from "@/lib/supabase";

// --- 1. INTERFAZ DE PROPS ÚNICA Y COMPLETA ---
interface AdminClientLayoutProps {
    // PROPS DE USUARIOS
    initialResidents: ResidenteAdmin[];
    initialError: string | null;      // Error de la carga de Residentes/Noticias

    // PROPS DE SERVICIOS
    initialServices: ServicioDisponible[];
    serviceError: string | null;

    // PROPS DE SOLICITUDES
    initialRequests: Solicitud[];
    requestError: string | null;
    
    // PROPS DE NOTICIAS (Añadida, ya que se usa)
    initialNoticias: Noticia[];
}
// --------------------------------------------------

export default function AdminClientLayout({ 
    // Desestructuración de TODAS las props definidas en la interfaz
    initialResidents, 
    initialError, 
    initialServices, 
    serviceError,
    initialRequests, 
    requestError,
    initialNoticias // Propiedad de Noticias desestructurada
}: AdminClientLayoutProps) { // Aplicación del tipo al componente

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
                                <Tab label={"Usuarios"} />        {/* tabIndex = 0 */}
                                <Tab label={"Noticias"} />        {/* tabIndex = 1 */}
                                <Tab label={"Eventos"} />         {/* tabIndex = 2 */}
                                <Tab label={"Servicios"} />       {/* tabIndex = 3 */}
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
                            {tabIndex === 1 && (
                                <NoticiasTable initialNoticias={initialNoticias} />
                            )}
                            
                            {/* Pestaña 2: Gestión de Eventos */}
                            {tabIndex === 2 && <Typography>Gestion de eventos</Typography>}
                            
                            {/* Pestaña 3: Servicios y Solicitudes */}
                            {tabIndex === 3 && (
                                <ServiceManagement
                                    initialServices={initialServices}
                                    initialServiceError={serviceError} // Nota: Renombrar a 'initialServiceError' si el componente ServiceManagement lo requiere
                                    initialRequests={initialRequests}
                                    initialRequestError={requestError} // Nota: Renombrar a 'initialRequestError' si el componente ServiceManagement lo requiere
                                />
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}