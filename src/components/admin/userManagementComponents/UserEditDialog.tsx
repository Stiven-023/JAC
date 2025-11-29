// src/components/UserEditDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Typography, Alert, CircularProgress } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import { ResidenteAdmin } from '@/lib/adminActions';

interface UserEditFormData {
    full_name: string;
    contact_info: string;
    is_admin: boolean;
    estado: boolean;
}

interface UserEditDialogProps {
    open: boolean;
    currentEditingUser: ResidenteAdmin | null;
    editFormData: UserEditFormData;
    isSaving: boolean;
    error: string | null;
    onClose: () => void;
    onSave: () => void;
    onFormChange: (data: Partial<UserEditFormData>) => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
    open, currentEditingUser, editFormData, isSaving, error, onClose, onSave, onFormChange
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{currentEditingUser ? `Editar Usuario: ${currentEditingUser.full_name}` : 'Editar Usuario'}</DialogTitle>
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">ID del Usuario (Inmutable): {currentEditingUser?.id_residentes}</Typography>
                <TextField
                    label="Nombre Completo"
                    fullWidth
                    value={editFormData.full_name}
                    onChange={(e) => onFormChange({ full_name: e.target.value })}
                    disabled={isSaving}
                />
                <TextField
                    label="Número de contacto"
                    fullWidth
                    value={editFormData.contact_info}
                    onChange={(e) => onFormChange({ contact_info: e.target.value })}
                    disabled={isSaving}
                />
                <TextField
                    select
                    label="Rol"
                    fullWidth
                    value={editFormData.is_admin ? 'Administrador' : 'Residente'}
                    onChange={(e) => onFormChange({ is_admin: e.target.value === 'Administrador' })}
                    disabled={isSaving}
                >
                    <MenuItem value={'Administrador'}>Administrador</MenuItem>
                    <MenuItem value={'Residente'}>Residente</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Estado de la Cuenta"
                    fullWidth
                    value={editFormData.estado ? 'Activo' : 'Inactivo'}
                    onChange={(e) => onFormChange({ estado: e.target.value === 'Activo' })}
                    disabled={isSaving}
                >
                    <MenuItem value={'Activo'}>Activo</MenuItem>
                    <MenuItem value={'Inactivo'}>Inactivo</MenuItem>
                </TextField>
            </Stack>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button
                onClick={onSave}
                variant="contained"
                color="primary"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
            >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </DialogActions>
    </Dialog>
);