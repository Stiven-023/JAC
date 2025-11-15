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
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search"
import MoreVertIcon from "@mui/icons-material/MoreVert"

// Interfaz para el tipo de usuario
interface User {
    id: number;
    nombreCompleto: string;
    correo: string;
    rol: string;
    estado: string;
}

export const UserManagement: React.FC = () => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'), { noSsr: true });
    const [isClient, setIsClient] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const [searchName, setSearchName] = React.useState<string>('');
    const [filterRole, setFilterRole] = React.useState<string>('');
    const [filterStatus, setFilterStatus] = React.useState<string>('');

    const [users] = React.useState<User[]>([
        {
            id: 1,
            nombreCompleto: 'Ana Gomez',
            correo: 'ana616@gmail.com',
            rol: 'Residente',
            estado: 'Activo'
        },
        {
            id: 2,
            nombreCompleto: 'Carlos Martínez',
            correo: 'carlos.m@gmail.com',
            rol: 'Admin',
            estado: 'Activo'
        },
        {
            id: 3,
            nombreCompleto: 'María López',
            correo: 'maria.lopez@gmail.com',
            rol: 'Residente',
            estado: 'Inactivo'
        }
    ]);

    if (!isClient) {
        return (
            <>
                <p>Cargando</p>
            </>
        )
    }
    const filteredUsers = users.filter((user: User) => {
        const matchesName = user.nombreCompleto.toLowerCase().includes(searchName.toLowerCase());
        const matchesRole = !filterRole || user.rol === filterRole;
        const matchesStatus = !filterStatus || user.estado === filterStatus;
        return matchesName && matchesRole && matchesStatus;
    });

    const roles: string[] = ['Administrador', 'Residente', 'Invitado'];
    const estados: string[] = ['Activo', 'Inactivo'];

    const getStatusColor = (status: string): 'success' | 'default' => {
        return status === 'Activo' ? 'success' : 'default';
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    mb: 4,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    color: '#000'
                }}
            >
                Gestión de usuarios
            </Typography>

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
                    <MenuItem value="">Filtrar por rol</MenuItem>
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
                    <MenuItem value="">Filtrar por estado</MenuItem>
                    {estados.map((estado: string) => (
                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                    ))}
                </TextField>
            </Stack>

            {!isMobile ? (
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
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>
                                    Nombre completo
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>
                                    Correo electrónico
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>
                                    Rol
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>
                                    Estado
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#000' }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        '&:hover': { backgroundColor: '#fafafa' },
                                        '&:last-child td': { border: 0 }
                                    }}
                                >
                                    <TableCell>{user.nombreCompleto}</TableCell>
                                    <TableCell>{user.correo}</TableCell>
                                    <TableCell>{user.rol}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.estado}
                                            color={getStatusColor(user.estado)}
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small">
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
                    {filteredUsers.map((user: User) => (
                        <Card
                            key={user.id}
                            sx={{
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                borderRadius: 2
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {user.nombreCompleto}
                                    </Typography>
                                    <IconButton size="small">
                                        <MoreVertIcon sx={{ fontSize: '20px' }} />
                                    </IconButton>
                                </Box>
                                <Stack spacing={1}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Correo electrónico
                                        </Typography>
                                        <Typography variant="body2">{user.correo}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Rol
                                        </Typography>
                                        <Typography variant="body2">{user.rol}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Estado
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={user.estado}
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