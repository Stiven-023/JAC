'use client';

import React from 'react';
import { Box, Stack, Card, CardContent, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ServicioDisponible as ServiceAdmin } from '@/lib/adminActions'; 

interface ServiceCardListProps {
    services: ServiceAdmin[];
    loading: boolean;
    onEdit: (service: ServiceAdmin) => void;
    onDelete: (id: number, name: string) => Promise<void>;
    getStatusString: (isActive: boolean) => string;
    getStatusColor: (isActive: boolean) => 'success' | 'error';
}

export const ServiceCardList: React.FC<ServiceCardListProps> = ({
    services,
    loading,
    onEdit,
    onDelete,
    getStatusString,
    getStatusColor,
}) => {
    return (
        <Stack spacing={2}>
            {services.map((service) => (
                <Card key={service.id_servicio} elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                {service.titulo_servicio} (ID: {service.id_servicio})
                            </Typography>
                            <Box>
                                <Tooltip title="Editar">
                                    <IconButton size="small" onClick={() => onEdit(service)} disabled={loading}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onDelete(service.id_servicio, service.titulo_servicio)} 
                                        disabled={loading}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        
                        <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">Descripción:</Typography>
                            <Typography variant="body2">{service.descripcion_short}</Typography>
                        </Box>

                        <Box mt={1}>
                            <Typography variant="caption" color="text.secondary" mr={1}>Estado:</Typography>
                            <Chip
                                label={getStatusString(service.is_activo)}
                                color={getStatusColor(service.is_activo)}
                                size="small"
                            />
                        </Box>

                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
};