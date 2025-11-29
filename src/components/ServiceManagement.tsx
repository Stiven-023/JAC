// components/ServiceManagement.tsx
'use client';

import React from 'react';
import { ServicioDisponible, Solicitud } from '@/lib/adminActions'; 
import { Box, Typography, Alert, Paper, Tabs, Tab, CircularProgress } from '@mui/material';

// 1. Componente para la lista de Servicios Disponibles (CRUD)
const ServiceListTab: React.FC<{ services: ServicioDisponible[], error: string | null }> = ({ services, error }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Servicios Disponibles (CRUD)</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {services.length === 0 && !error ? (
                <Alert severity="info">No hay servicios maestros registrados. Utilizar un boton de crear.</Alert>
            ) : (
                // 🛑 AQUÍ VA LA TABLA DE SERVICIOS DISPONIBLES CON BOTONES DE EDITAR/ELIMINAR
                <Typography>Total de Servicios: {services.length}</Typography>
            )}
        </Box>
    );
};

// 2. Componente para la lista de Solicitudes de Residentes
const RequestListTab: React.FC<{ requests: Solicitud[], error: string | null }> = ({ requests, error }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Solicitudes de Residentes ({requests.length})</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {requests.length === 0 && !error ? (
                <Alert severity="info">No hay solicitudes nuevas en el sistema.</Alert>
            ) : (
                // 🛑 AQUÍ VA LA TABLA DE SOLICITUDES CON EL SEGUIMIENTO DE ESTADO
                <Typography>Mostrando {requests.length} solicitudes.</Typography>
            )}
        </Box>
    );
};


// 3. Componente Padre: ServiceManagement
interface ServiceManagementProps {
    initialServices: ServicioDisponible[] | null | undefined;
    initialServiceError: string | null;
    initialRequests: Solicitud[] | null | undefined; // ⬅️ Nuevo
    initialRequestError: string | null;  // ⬅️ Nuevo
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({ 
    initialServices, 
    initialServiceError,
    initialRequests,
    initialRequestError
}) => {
    
    const [services, setServices] = React.useState<ServicioDisponible[]>(initialServices ?? []);
    const [requests, setRequests] = React.useState<Solicitud[]>(initialRequests ?? []);
    
    // Pestañas internas: 0 = Servicios (CRUD), 1 = Solicitudes (Listado)
    const [internalTabIndex, setInternalTabIndex] = React.useState(0);

    const handleInternalTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setInternalTabIndex(newValue);
    };

    const hasCriticalError = initialServiceError && initialRequests?.length === 0 && initialServices?.length === 0;

    if (hasCriticalError) {
        return (
            <Box sx={{ p: 4 }}><Alert severity="error">Error de carga crítico: {initialServiceError}</Alert></Box>
        );
    }

    return (
        <Paper elevation={1} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            {/* Cabecera de Pestañas Internas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
                <Tabs value={internalTabIndex} onChange={handleInternalTabChange} aria-label="internal service management tabs">
                    <Tab label="Servicios Disponibles" />
                    <Tab label="Solicitudes Entrantes" />
                </Tabs>
            </Box>

            {/* Contenido de Pestañas Internas */}
            {internalTabIndex === 0 && (
                <ServiceListTab 
                    services={services} 
                    error={initialServiceError} 
                />
            )}
            {internalTabIndex === 1 && (
                <RequestListTab 
                    requests={requests} 
                    error={initialRequestError} 
                />
            )}
        </Paper>
    );
};