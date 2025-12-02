'use client';

import React from 'react';
import {TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ServicioDisponible as ServiceAdmin } from '@/lib/adminActions'; 

interface ServiceTableProps {
    services: ServiceAdmin[];
    loading: boolean;
    onEdit: (service: ServiceAdmin) => void;
    onDelete: (id: number, name: string) => Promise<void>;
    getStatusString: (isActive: boolean) => string;
    getStatusColor: (isActive: boolean) => 'success' | 'error';
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
    services,
    loading,
    onEdit,
    onDelete,
    getStatusString,
    getStatusColor,
}) => {
    return (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Título</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Descripción Corta</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Activo</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#000' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id_servicio} hover>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="bold">
                                        {service.titulo_servicio}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ID: {service.id_servicio}
                                    </Typography>
                                </TableCell>
                                <TableCell>{service.descripcion_short}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusString(service.is_activo)}
                                        color={getStatusColor(service.is_activo)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Editar Servicio">
                                        <IconButton size="small" onClick={() => onEdit(service)} disabled={loading}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar Servicio">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => onDelete(service.id_servicio, service.titulo_servicio)} 
                                            disabled={loading}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};