'use client'

import React from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Chip,
    Stack,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { ResidenteAdmin, eliminarResidenteAdmin } from '@/lib/adminActions';


interface UserManagementProps {
    initialResidents: ResidenteAdmin[] | null | undefined;
    initialError: string | null;
}

export const UserManagement: React.FC<UserManagementProps> = ({ initialResidents, initialError }) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'), { noSsr: true });
    const [isClient, setIsClient] = React.useState<boolean>(false);


    const [residents, setResidents] = React.useState<ResidenteAdmin[]>(initialResidents ?? []);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(initialError);


    const [searchName, setSearchName] = React.useState<string>('');
    const [filterRole, setFilterRole] = React.useState<string>('');
    const [filterStatus, setFilterStatus] = React.useState<string>('');

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const handleDelete = async (userId: string, userName: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar a ${userName}? Esta acción es irreversible y eliminará su cuenta de Auth.`)) {
            setLoading(true);


            console.log(`[CLIENTE] Intentando eliminar usuario: ${userName} (ID: ${userId})`);

            try {
                const result = await eliminarResidenteAdmin(userId);


                console.log("[CLIENTE] Respuesta de Server Action:", result);

                if (result.success) {
                    console.log(`[CLIENTE] Eliminación exitosa. Filtrando estado local.`);

                    setResidents(prev => prev.filter(r => r.id_residentes !== userId));
                } else {
                    console.error("[CLIENTE] Error reportado por Server Action:", result.message);
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

        const userRole = user.is_admin ? 'Administrador' : 'Residente';
        const userStatus = user.estado ? 'Activo' : 'Inactivo';

        const matchesName = user.full_name.toLowerCase().includes(searchName.toLowerCase());
        const matchesRole = !filterRole || userRole === filterRole;
        const matchesStatus = !filterStatus || userStatus === filterStatus;

        return matchesName && matchesRole && matchesStatus;
    });

    const roles: string[] = ['Administrador', 'Residente'];
    const estados: string[] = ['Activo', 'Inactivo'];

    const getStatusColor = (estado: boolean): 'success' | 'default' => {
        return estado ? 'success' : 'default';
    };

    const getRoleString = (isAdmin: boolean): string => {
        return isAdmin ? 'Administrador' : 'Residente';
    }


    if (!isClient) {
        return (
            <>
                <CircularProgress />
            </>
        )
    }

    if (error && (initialResidents?.length === 0 || !initialResidents)) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">
                    Error al cargar los usuarios: {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fafafa' }}>

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
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#757575', fontSize: '20px' }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        }
                    }}
                />
                <TextField
                    select
                    label='Filtrar por rol'
                    size="small"
                    value={filterRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterRole(e.target.value)}
                    sx={{
                        minWidth: { xs: '100%', sm: 200 },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        }
                    }}
                >
                    <MenuItem value="">Todos los roles</MenuItem>
                    {roles.map((role: string) => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label='Filtrar por estado'
                    size="small"
                    value={filterStatus}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStatus(e.target.value)}
                    sx={{
                        minWidth: { xs: '100%', sm: 200 },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        }
                    }}
                >
                    <MenuItem value="">Todos los estados</MenuItem>
                    {estados.map((estado: string) => (
                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                    ))}
                </TextField>
            </Stack>

            {/* Si no hay usuarios */}
            {filteredUsers.length === 0 && (
                <Alert severity="info">
                    No se encontraron usuarios que coincidan con los filtros.
                </Alert>
            )}


            {!isMobile && filteredUsers.length > 0 ? (

                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        borderRadius: 2
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>Nombre completo</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>Correo electrónico</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>Rol</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user: ResidenteAdmin) => (
                                <TableRow
                                    key={user.id_residentes}
                                    sx={{
                                        '&:hover': { backgroundColor: '#fafafa' },
                                        '&:last-child td': { border: 0 }
                                    }}
                                >
                                    {/* Mapeo de datos */}
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
                                    <TableCell>
                                        <IconButton size="small"
                                            onClick={() => handleDelete(user.id_residentes, user.full_name)}
                                            disabled={loading}
                                            color="error"
                                        >
                                            <DeleteIcon sx={{ fontSize: '20px' }} />
                                        </IconButton>
                                        <IconButton size="small" >
                                            <MoreVertIcon sx={{ fontSize: '20px' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (

                <Stack spacing={2}>
                    {filteredUsers.map((user: ResidenteAdmin) => (
                        <Card
                            key={user.id_residentes}
                            sx={{
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                borderRadius: 2
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {user.full_name}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(user.id_residentes, user.full_name)}
                                        disabled={loading}
                                        color="error"
                                    >
                                        <DeleteIcon sx={{ fontSize: '20px' }} />
                                    </IconButton>
                                </Box>
                                <Stack spacing={1}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Correo electrónico</Typography>
                                        <Typography variant="body2">{user.contact_info}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Rol</Typography>
                                        <Typography variant="body2">{getRoleString(user.is_admin)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Estado</Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={user.estado ? 'Activo' : 'Inactivo'}
                                                color={getStatusColor(user.estado)}
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
};