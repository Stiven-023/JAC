// src/components/UserTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, CircularProgress } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ResidenteAdmin } from '@/lib/adminActions';

interface UserTableProps {
    users: ResidenteAdmin[];
    loading: boolean;
    onEdit: (user: ResidenteAdmin) => void;
    onDelete: (userId: string, userName: string) => void;
    getRoleString: (isAdmin: boolean) => string;
    getStatusColor: (estado: boolean) => 'success' | 'default';
}

export const UserTable: React.FC<UserTableProps> = ({
    users, loading, onEdit, onDelete, getRoleString, getStatusColor
}) => (
    <TableContainer
        component={Paper}
        sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2, overflowX: 'auto' }}
    >
        <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                    {['Nombre completo', 'Número de contacto', 'Rol', 'Estado', 'Acciones'].map(header => (
                        <TableCell key={header} sx={{ fontWeight: 600, color: '#000' }}>{header}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id_residentes} sx={{ '&:hover': { backgroundColor: '#fafafa' }, '&:last-child td': { border: 0 } }}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.contact_info}</TableCell>
                        <TableCell>{getRoleString(user.is_admin)}</TableCell>
                        <TableCell>
                            <Chip
                                label={user.estado ? 'Activo' : 'Inactivo'}
                                color={getStatusColor(user.estado)}
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <IconButton size="small" onClick={() => onEdit(user)} disabled={loading} color="primary">
                                <EditIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(user.id_residentes, user.full_name)} disabled={loading} color="error">
                                <DeleteIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);