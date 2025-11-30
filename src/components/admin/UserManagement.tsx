'use client'

import React from 'react';
import {Box, TextField, MenuItem, useTheme, useMediaQuery, Stack, InputAdornment, Alert, CircularProgress,} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { ResidenteAdmin, eliminarResidenteAdmin, actualizarResidenteAdmin, ActionResult } from '@/lib/adminActions';

import { UserTable } from './userManagementComponents/UserTable';
import { UserCardList } from './userManagementComponents/UserCardList';
import { UserEditDialog } from './userManagementComponents/UserEditDialog';

interface UserEditFormData { full_name: string; contact_info: string; is_admin: boolean; estado: boolean; }
interface UserManagementProps { initialResidents: ResidenteAdmin[] | null | undefined; initialError: string | null; }

const initialEditFormData: UserEditFormData = {
    full_name: '', contact_info: '', is_admin: false, estado: false,
};

const getStatusColor = (estado: boolean): 'success' | 'default' => estado ? 'success' : 'default';
const getRoleString = (isAdmin: boolean): string => isAdmin ? 'Administrador' : 'Residente';


export const UserManagement: React.FC<UserManagementProps> = ({ initialResidents, initialError }) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'), { noSsr: true });
    const [isClient, setIsClient] = React.useState<boolean>(false);

    const [residents, setResidents] = React.useState<ResidenteAdmin[]>(initialResidents ?? []);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(initialError);

    const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
    const [currentEditingUser, setCurrentEditingUser] = React.useState<ResidenteAdmin | null>(null);
    const [editFormData, setEditFormData] = React.useState<UserEditFormData>(initialEditFormData);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [searchName, setSearchName] = React.useState<string>('');
    const [filterRole, setFilterRole] = React.useState<string>('');
    const [filterStatus, setFilterStatus] = React.useState<string>('');

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const handleOpenEditDialog = (user: ResidenteAdmin) => {
        setCurrentEditingUser(user);
        setEditFormData({
            full_name: user.full_name,
            contact_info: user.contact_info,
            is_admin: user.is_admin,
            estado: user.estado,
        });
        setOpenEditDialog(true);
        setError(null); 
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentEditingUser(null);
        setEditFormData(initialEditFormData);
    };

    const handleFormChange = (data: Partial<UserEditFormData>) => {
        setEditFormData(prev => ({ ...prev, ...data }));
        setError(null);
    }

    const handleSaveEdit = async () => {
        if (!currentEditingUser || isSaving) return;
        if (!editFormData.full_name || !editFormData.contact_info) {
            setError("El nombre completo y el correo no pueden estar vacíos.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('id_residentes', currentEditingUser.id_residentes);
            formData.append('full_name', editFormData.full_name);
            formData.append('contact_info', editFormData.contact_info);
            formData.append('is_admin', String(editFormData.is_admin));
            formData.append('estado', String(editFormData.estado));

            const result: ActionResult = await actualizarResidenteAdmin(formData);

            if (result.success && result.data) {
                setResidents(prev => prev.map(r => r.id_residentes === currentEditingUser.id_residentes ? result.data! : r ));
                handleCloseEditDialog();
            } else {
                setError(result.message || "Error desconocido al actualizar el usuario.");
            }
        } catch (err) {
            console.error("[CLIENTE] Fallo crítico en la ejecución de la Server Action (Actualizar):", err);
            setError("Fallo crítico en la conexión al intentar guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (loading || isSaving) return;
        if (confirm(`¿Estás seguro de que quieres eliminar a ${userName}? Esta acción es irreversible y eliminará su cuenta de Auth.`)) {
            setLoading(true);

            try {
                const result: ActionResult = await eliminarResidenteAdmin(userId);

                if (result.success) {
                    setResidents(prev => prev.filter(r => r.id_residentes !== userId));
                    setError(null);
                } else {
                    setError(result.message || "Error desconocido al eliminar el usuario.");
                }
            } catch (_err) {
                console.error("[CLIENTE] Fallo crítico en la ejecución de la Server Action:", _err);
                setError("Fallo crítico en la conexión con el servidor.");
            } finally {
                setLoading(false);
            }
        }
    };
    const filteredUsers = residents.filter((user: ResidenteAdmin) => {
        const matchesName = user.full_name.toLowerCase().includes(searchName.toLowerCase());
        const matchesRole = !filterRole || getRoleString(user.is_admin) === filterRole;
        const matchesStatus = !filterStatus || (user.estado ? 'Activo' : 'Inactivo') === filterStatus;
        return matchesName && matchesRole && matchesStatus;
    });

    if (!isClient) return (<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>);

    if (error && residents.length === 0) {
        return (<Box sx={{ p: 4 }}><Alert severity="error">Error al cargar los usuarios: {error}</Alert></Box>);
    }


    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fafafa' }}>

            {error && !openEditDialog && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error de operación: {error}
                </Alert>
            )}

            {/* Barra de filtros y busqueda */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <TextField
                    placeholder="Buscar por nombre"
                    size="small"
                    value={searchName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#757575', fontSize: '20px' }} /></InputAdornment>)
                    }}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                />
                <TextField
                    select
                    label='Filtrar por rol'
                    size="small"
                    value={filterRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterRole(e.target.value)}
                    sx={{ minWidth: { xs: '100%', sm: 200 }, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                >
                    <MenuItem value="">Todos los roles</MenuItem>
                    {['Administrador', 'Residente'].map((role: string) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
                </TextField>
                <TextField
                    select
                    label='Filtrar por estado'
                    size="small"
                    value={filterStatus}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: { xs: '100%', sm: 200 }, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                >
                    <MenuItem value="">Todos los estados</MenuItem>
                    {['Activo', 'Inactivo'].map((estado: string) => (<MenuItem key={estado} value={estado}>{estado}</MenuItem>))}
                </TextField>
            </Stack>

            {/* Resultados */}
            {filteredUsers.length === 0 ? (
                <Alert severity="info">No se encontraron usuarios que coincidan con los filtros.</Alert>
            ) : isMobile ? (
                <UserCardList
                    users={filteredUsers}
                    loading={loading || isSaving}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleDelete}
                    getRoleString={getRoleString}
                    getStatusColor={getStatusColor}
                />
            ) : (
                <UserTable
                    users={filteredUsers}
                    loading={loading || isSaving}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleDelete}
                    getRoleString={getRoleString}
                    getStatusColor={getStatusColor}
                />
            )}
            
            <UserEditDialog
                open={openEditDialog}
                currentEditingUser={currentEditingUser}
                editFormData={editFormData}
                isSaving={isSaving}
                error={error}
                onClose={handleCloseEditDialog}
                onSave={handleSaveEdit}
                onFormChange={handleFormChange}
            />
        </Box>
    );
};