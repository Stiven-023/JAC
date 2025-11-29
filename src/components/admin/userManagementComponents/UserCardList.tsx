// src/components/UserCardList.tsx
import React from 'react';
import { Box, Card, CardContent, Stack, Typography, Chip, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ResidenteAdmin } from '@/lib/adminActions';

interface UserCardListProps {
    users: ResidenteAdmin[];
    loading: boolean;
    onEdit: (user: ResidenteAdmin) => void;
    onDelete: (userId: string, userName: string) => void;
    getRoleString: (isAdmin: boolean) => string;
    getStatusColor: (estado: boolean) => 'success' | 'default';
}

export const UserCardList: React.FC<UserCardListProps> = ({
    users, loading, onEdit, onDelete, getRoleString, getStatusColor
}) => (
    <Stack spacing={2}>
        {users.map((user) => (
            <Card key={user.id_residentes} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{user.full_name}</Typography>
                        <Box>
                            <IconButton size="small" onClick={() => onEdit(user)} disabled={loading} color="primary">
                                <EditIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(user.id_residentes, user.full_name)} disabled={loading} color="error">
                                <DeleteIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary">Número de contacto</Typography>
                        <Typography variant="body2">{user.contact_info}</Typography>
                        <Typography variant="caption" color="text.secondary">Rol</Typography>
                        <Typography variant="body2">{getRoleString(user.is_admin)}</Typography>
                        <Typography variant="caption" color="text.secondary">Estado</Typography>
                        <Box sx={{ mt: 0.5 }}>
                            <Chip
                                label={user.estado ? 'Activo' : 'Inactivo'}
                                color={getStatusColor(user.estado)}
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        ))}
    </Stack>
);