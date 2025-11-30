'use client';

import React, { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Chip, Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';

// Iconos
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Solicitud } from '@/lib/adminActions'; 
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestTableProps {
    requests: Solicitud[];
    loading: boolean;
    onUpdateStatus: (id: number, status: Solicitud['estado']) => void;
    onDelete: (id: number) => void;
}

const getStatusColor = (estado: Solicitud['estado']) => {
    switch (estado) {
        case 'atendida': return 'success';
        case 'en_tramite': return 'warning';
        case 'cerrada': return 'error';
        default: return 'default';
    }
};

const getStatusLabel = (estado: Solicitud['estado']) => {
    switch (estado) {
        case 'atendida': return 'Atendida';
        case 'en_tramite': return 'En Trámite';
        case 'cerrada': return 'Cerrada';
        default: return 'Desconocido';
    }
};

export const RequestTable: React.FC<RequestTableProps> = ({ requests, loading, onUpdateStatus, onDelete }) => {
    
    // Estado para el menú desplegable
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRequest, setSelectedRequest] = useState<Solicitud | null>(null);
    const open = Boolean(anchorEl);

    // Abrir menú
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, request: Solicitud) => {
        setAnchorEl(event.currentTarget);
        setSelectedRequest(request);
    };

    // Cerrar menú
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRequest(null);
    };

    // Lógica para cambiar estado
    const handleChangeStatus = (newStatus: Solicitud['estado']) => {
        if (selectedRequest) {
            onUpdateStatus(selectedRequest.id_solicitud, newStatus);
        }
        handleMenuClose();
    };

    // Lógica para eliminar
    const handleDeleteClick = () => {
        if (selectedRequest) {
            onDelete(selectedRequest.id_solicitud);
        }
        handleMenuClose();
    };

    return (
        <>
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
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow 
                                key={request.id_solicitud} 
                                hover 
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{request.id_solicitud}</TableCell>
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
                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) => handleMenuClick(e, request)}
                                        disabled={loading}
                                        size="small"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*Acciones */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 200 }
                }}
            >
                {/* Opción para "En tramite"*/}
                {selectedRequest?.estado === 'en_tramite' && (
                    <MenuItem onClick={() => handleChangeStatus('atendida')}>
                        <ListItemIcon><ArrowForwardIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="Marcar como Atendida" />
                    </MenuItem>
                )}

                {/*Opción para "Atentida" */}
                {selectedRequest?.estado === 'atendida' && [
                    <MenuItem key="cerrar" onClick={() => handleChangeStatus('cerrada')}>
                        <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                        <ListItemText primary="Cerrar Solicitud" />
                    </MenuItem>,
                    <MenuItem key="regresar" onClick={() => handleChangeStatus('en_tramite')}>
                        <ListItemIcon><UndoIcon fontSize="small" color="warning" /></ListItemIcon>
                        <ListItemText primary="Regresar a En Trámite" />
                    </MenuItem>
                ]}

                {/* Opción "cerrada"*/}
                {selectedRequest?.estado === 'cerrada' && (
                    <MenuItem onClick={() => handleChangeStatus('atendida')}>
                        <ListItemIcon><UndoIcon fontSize="small" color="warning" /></ListItemIcon>
                        <ListItemText primary="Reabrir (A Atendida)" />
                    </MenuItem>
                )}

                {/* Opción de elimiar */}
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText primary="Eliminar Solicitud" />
                </MenuItem>
            </Menu>
        </>
    );
};