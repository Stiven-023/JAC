// serviceManagementComponents/ServiceEditDialog.tsx
'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Alert, Box, CircularProgress} from '@mui/material';

// Asegúrate de usar los tipos correctos para el Servicio
import { ServicioDisponible as ServiceAdmin } from '@/lib/adminActions'; 

interface ServiceEditFormData {
    titulo_servicio: string;
    descripcion_short: string;
    descripcion_full: string | null;
    icono_nombre: string | null;
    is_activo: boolean;
}

interface ServiceEditDialogProps {
    open: boolean;
    isNew: boolean;
    serviceToEdit: ServiceAdmin | null;
    formData: ServiceEditFormData;
    isSaving: boolean;
    error: string | null;
    onClose: () => void;
    onSave: () => void;
    onFormChange: (data: Partial<ServiceEditFormData>) => void;
}

export const ServiceEditDialog: React.FC<ServiceEditDialogProps> = ({
    open,
    isNew,
    formData,
    isSaving,
    error,
    onClose,
    onSave,
    onFormChange,
}) => {
    const title = isNew ? 'Crear Nuevo Servicio' : `Editar Servicio: ${formData.titulo_servicio}`;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    <TextField
                        label="Título del Servicio"
                        value={formData.titulo_servicio}
                        onChange={(e) => onFormChange({ titulo_servicio: e.target.value })}
                        fullWidth
                        required
                        disabled={isSaving}
                    />
                    
                    <TextField
                        label="Descripción Corta (Máx. 100 caracteres)"
                        value={formData.descripcion_short}
                        onChange={(e) => onFormChange({ descripcion_short: e.target.value })}
                        fullWidth
                        multiline
                        rows={2}
                        required
                        disabled={isSaving}
                    />

                    <TextField
                        label="Descripción Completa (Opcional)"
                        value={formData.descripcion_full || ''}
                        onChange={(e) => onFormChange({ descripcion_full: e.target.value })}
                        fullWidth
                        multiline
                        rows={4}
                        disabled={isSaving}
                    />
                    
                    <TextField
                        label="Icono (Nombre del icono de Material UI - Opcional)"
                        value={formData.icono_nombre || ''}
                        onChange={(e) => onFormChange({ icono_nombre: e.target.value })}
                        fullWidth
                        disabled={isSaving}
                        helperText="Ej: 'LocalLaundry' o 'FitnessCenter'"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_activo}
                                onChange={(e) => onFormChange({ is_activo: e.target.checked })}
                                disabled={isSaving}
                            />
                        }
                        label={formData.is_activo ? 'Servicio Activo' : 'Servicio Inactivo'}
                        sx={{ mt: 1 }}
                    />
                </Box>
                
                {isSaving && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving} color="inherit">Cancelar</Button>
                <Button onClick={onSave} disabled={isSaving} color="primary" variant="contained">
                    {isSaving ? 'Guardando...' : (isNew ? 'Crear' : 'Guardar Cambios')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};