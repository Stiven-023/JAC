'use client'

import React from 'react';
import { Box, Typography, Alert, Paper, Tabs, Tab, useTheme, useMediaQuery, CircularProgress, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
    ServicioDisponible as ServiceAdmin,
    Solicitud,
    crearServicioDisponible,
    actualizarServicioDisponible,
    eliminarServicioDisponible
} from '@/lib/adminActions';

import { ServiceTable } from './serviceManagementComponents/ServiceTable';
import { ServiceCardList } from './serviceManagementComponents/ServiceCardList';
import { ServiceEditDialog } from './serviceManagementComponents/ServiceEditDialog';

interface ServiceEditFormData {
    titulo_servicio: string;
    descripcion_short: string;
    descripcion_full: string | null;
    is_activo: boolean;
}
const initialServiceFormData: ServiceEditFormData = {
    titulo_servicio: '',
    descripcion_short: '',
    descripcion_full: '',
    is_activo: true,
};
const getStatusColor = (isActive: boolean): 'success' | 'error' => isActive ? 'success' : 'error';
const getStatusString = (isActive: boolean): string => isActive ? 'Activo' : 'Inactivo';
//
const RequestListTab: React.FC<{ requests: Solicitud[], error: string | null }> = ({ requests, error }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Solicitudes de Residentes ({requests.length})</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {requests.length === 0 && !error ? (
                <Alert severity="info">No hay solicitudes nuevas en el sistema.</Alert>
            ) : (

                <Typography>Mostrando {requests.length} solicitudes.</Typography>
            )}
        </Box>
    );
};

interface ServiceManagementProps {
    initialServices: ServiceAdmin[] | null | undefined;
    initialServiceError: string | null;
    initialRequests: Solicitud[] | null | undefined;
    initialRequestError: string | null;
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({
    initialServices,
    initialServiceError,
    initialRequests,
    initialRequestError
}) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'), { noSsr: true });

    const [services, setServices] = React.useState<ServiceAdmin[]>(initialServices ?? []);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(initialServiceError);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

    // Estado del Diálogo de Edición/Creación
    const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
    const [currentEditingService, setCurrentEditingService] = React.useState<ServiceAdmin | null>(null);
    const [serviceFormData, setServiceFormData] = React.useState<ServiceEditFormData>(initialServiceFormData);

    // Pestañas internas
    const [internalTabIndex, setInternalTabIndex] = React.useState(0);
    const handleInternalTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setInternalTabIndex(newValue);
        setError(null);
        setSuccessMessage(null);
    };

    const handleOpenCreateDialog = () => {
        setCurrentEditingService(null);
        setServiceFormData(initialServiceFormData);
        setOpenEditDialog(true);
        setError(null);
    };

    const handleOpenEditDialog = (service: ServiceAdmin) => {
        setCurrentEditingService(service);
        setServiceFormData({
            titulo_servicio: service.titulo_servicio,
            descripcion_short: service.descripcion_short,
            descripcion_full: service.descripcion_full,
            is_activo: service.is_activo,
        });
        setOpenEditDialog(true);
        setError(null);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentEditingService(null);
        setServiceFormData(initialServiceFormData);
    };

    const handleFormChange = (data: Partial<ServiceEditFormData>) => {
        setServiceFormData(prev => ({ ...prev, ...data }));
        setError(null);
    }

    // --- ACCIONES CRUD ---

    const handleSaveService = async () => {
        if (isSaving) return;

        // Validación
        if (!serviceFormData.titulo_servicio || !serviceFormData.descripcion_short) {
            setError("El título y la descripción corta no pueden estar vacíos.");
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const formData = new FormData();
            formData.append('titulo_servicio', serviceFormData.titulo_servicio);
            formData.append('descripcion_short', serviceFormData.descripcion_short);
            formData.append('descripcion_full', serviceFormData.descripcion_full || '');
            formData.append('is_activo', String(serviceFormData.is_activo));

            let result: { success: boolean, message?: string };

            if (currentEditingService) {
                // Actualizar
                formData.append('id_servicio', String(currentEditingService.id_servicio));
                result = await actualizarServicioDisponible(formData);
            } else {
                // Crear
                result = await crearServicioDisponible(formData);
            }

            if (result.success) {
                setSuccessMessage(result.message || (currentEditingService ? "Servicio actualizado." : "Servicio creado."));
                handleCloseEditDialog();
            } else {
                setError(result.message || "Error desconocido al guardar el servicio.");
            }
        } catch (err) {
            console.error("[CLIENTE] Fallo crítico al guardar el servicio:", err);
            setError("Fallo crítico en la conexión al intentar guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (serviceId: number, serviceName: string) => {
        if (loading || isSaving) return;
        if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${serviceName}"? Esta acción es irreversible.`)) {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            try {
                const result: { success: boolean, message?: string } = await eliminarServicioDisponible(serviceId);

                if (result.success) {
                    setServices(prev => prev.filter(s => s.id_servicio !== serviceId));
                    setSuccessMessage(result.message || "Servicio eliminado exitosamente.");
                } else {
                    setError(result.message || "Error desconocido al eliminar el servicio.");
                }
            } catch (err) {
                console.error("[CLIENTE] Fallo crítico al eliminar el servicio:", err);
                setError("Fallo crítico en la conexión con el servidor.");
            } finally {
                setLoading(false);
            }
        }
    };


    // Renderizado inicial (carga o error crítico)
    if (loading && services.length === 0) return (<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>);

    const serviceListTabContent = (
        <Box sx={{ p: 3, position: 'relative' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>Operación fallida: {error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            {/* BARRA DE TÍTULO Y BOTÓN DE ACCIÓN (NUEVO BLOQUE) */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

                {/* TÍTULO DE LA LISTA */}
                <Typography variant="h6">Servicios Disponibles ({services.length})</Typography>

                {/* BOTÓN ESTÁNDAR DE CREACIÓN */}
                <Button
                    variant="contained"
                    color={'error'}
                    onClick={handleOpenCreateDialog} // Misma lógica
                    disabled={loading || isSaving} // Misma lógica
                    startIcon={<AddIcon />} // Icono
                    sx={{ textTransform: 'none' }}
                >
                    Crear Nuevo Servicio
                </Button>
            </Box>

            {/* LISTA DE RESULTADOS (SIN CAMBIOS) */}
            {services.length === 0 ? (
                <Alert severity="info">No hay servicios maestros registrados.</Alert>
            ) : isMobile ? (
                <ServiceCardList
                    services={services}
                    loading={loading || isSaving}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleDelete}
                    getStatusString={getStatusString}
                    getStatusColor={getStatusColor}
                />
            ) : (
                <ServiceTable
                    services={services}
                    loading={loading || isSaving}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleDelete}
                    getStatusString={getStatusString}
                    getStatusColor={getStatusColor}
                />
            )}
        </Box>
    );

    return (
        <Paper elevation={1} sx={{ p: 0, borderRadius: 2, maxWidth: '1400px', margin: '0 auto', overflow: 'hidden' }}>
            {/* Cabecera de Pestañas Internas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
                <Tabs value={internalTabIndex} onChange={handleInternalTabChange} aria-label="internal service management tabs">
                    <Tab label="Servicios Disponibles" />
                    <Tab label="Solicitudes Entrantes" />
                </Tabs>
            </Box>

            {/* Contenido de Pestañas Internas */}
            {internalTabIndex === 0 && serviceListTabContent}

            {internalTabIndex === 1 && (
                <RequestListTab
                    requests={initialRequests ?? []}
                    error={initialRequestError}
                />
            )}

            {/* DIÁLOGO DE EDICIÓN/CREACIÓN */}
            <ServiceEditDialog
                open={openEditDialog}
                isNew={!currentEditingService}
                serviceToEdit={currentEditingService}
                formData={serviceFormData}
                isSaving={isSaving}
                error={error}
                onClose={handleCloseEditDialog}
                onSave={handleSaveService}
                onFormChange={handleFormChange}
            />
        </Paper>
    );
};