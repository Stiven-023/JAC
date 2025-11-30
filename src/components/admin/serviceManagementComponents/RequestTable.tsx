'use client';

import React from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Chip, Button, Box, Typography, CircularProgress 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Solicitud } from '@/lib/adminActions'; 
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestTableProps {
    requests: Solicitud[];
    loading: boolean;
    onUpdateStatus: (id: number, status: Solicitud['estado']) => void;
}

const getStatusColor = (estado: Solicitud['estado']): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' => {
    switch (estado) {
        case 'atendida': return 'success';
        case 'en_tramite': return 'warning';
        case 'cerrada': return 'error';
        default: return 'default';
    }
};

const getStatusLabel = (estado: Solicitud['estado']): string => {
    switch (estado) {
        case 'atendida': return 'Atendida';
        case 'en_tramite': return 'En Trámite';
        case 'cerrada': return 'Cerrada';
        default: return 'Desconocido';
    }
};

export const RequestTable: React.FC<RequestTableProps> = ({ requests, loading, onUpdateStatus }) => {
    
    const [updatingId, setUpdatingId] = React.useState<number | null>(null);

    const handleStatusClick = async (id: number, currentStatus: Solicitud['estado']) => {
        if (loading || updatingId === id) return;

        let newStatus: Solicitud['estado'];
        if (currentStatus === 'en_tramite') {
            newStatus = 'atendida';
        } else if (currentStatus === 'atendida') {
            newStatus = 'cerrada'; 
        } else {
            return;
        }

        setUpdatingId(id);
        try {
            await onUpdateStatus(id, newStatus);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table stickyHeader aria-label="tabla de solicitudes">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Residente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Servicio</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Descripción / Dirección</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request) => (
                        <TableRow 
                            key={request.id_solicitud} 
                            hover 
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {request.id_solicitud}
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2">{request.resident_name}</Typography>
                                <Typography variant="caption" color="textSecondary">{request.resident_id.substring(0, 8)}...</Typography>
                            </TableCell>
                            <TableCell>{request.titulo_servicio}</TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2" sx={{ maxHeight: '2em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {request.descripcion}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Dir: {request.direccion}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={getStatusLabel(request.estado)} 
                                    color={getStatusColor(request.estado)} 
                                    size="small" 
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell>
                                {format(new Date(request.fecha_creacion), 'dd MMM yy HH:mm', { locale: es })}
                            </TableCell>
                            <TableCell>
                                {request.estado !== 'cerrada' && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={request.estado === 'en_tramite' ? 'success' : 'primary'}
                                        startIcon={request.estado === 'en_tramite' ? <CheckCircleIcon /> : <EditIcon />}
                                        onClick={() => handleStatusClick(request.id_solicitud, request.estado)}
                                        disabled={loading || updatingId === request.id_solicitud}
                                    >
                                        {updatingId === request.id_solicitud ? 
                                            <CircularProgress size={20} /> :
                                            request.estado === 'en_tramite' ? 'Marcar Atendida' : 'Marcar Cerrada'
                                        }
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};