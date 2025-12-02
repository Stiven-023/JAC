'use client'

import React, { useState, useTransition } from 'react'
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, InputAdornment, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Tabs, Tab
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

// Importamos acciones y tipos
import {
  createEvento,
  deleteEvento,
  updateEvento,
  eliminarInscripcion,
  Evento as TypeEvento,
  Inscripcion,
  ActionResultEvento // 👈 AGREGA ESTO
} from '../../lib/admin/eventos';

// --- Interfaces Locales ---
interface FormData {
  resident_id: string
  titulo: string
  descripcion?: string,
  fecha_publicacion: string,
  fecha_evento: string,
  rango_horario: string,
  lugar: string
}

interface AlertState {
  show: boolean
  message: string
  severity: 'success' | 'error'
}

// --- Props del Componente Principal ---
interface EventosProps {
  initialEventos: TypeEvento[];
  initialInscripciones?: Inscripcion[]; // Nueva prop opcional
}

const Eventos = ({ initialEventos, initialInscripciones = [] }: EventosProps) => {

  // --- ESTADOS ---
  const [tabIndex, setTabIndex] = useState(0);
  const [eventos, setEventos] = useState<TypeEvento[]>(initialEventos ?? []);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>(initialInscripciones ?? []);

  // Estados de UI
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [currentEvento, setCurrentEvento] = useState<TypeEvento | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false)
  const [alert, setAlert] = useState<AlertState>({ show: false, message: '', severity: 'success' })
  const [isPending, startTransition] = useTransition()

  // Formulario
  const [formData, setFormData] = useState<FormData>({
    resident_id: '',
    titulo: '',
    descripcion: '',
    fecha_publicacion: '',
    fecha_evento: '',
    rango_horario: '',
    lugar: ''
  })

  // --- HANDLERS GENERALES ---
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const showAlert = (message: string, severity: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // --- LÓGICA DE EVENTOS (TAB 0) ---

  const handleOpenDialog = (evento: TypeEvento | null = null) => {
    if (evento) {
      setFormData({ ...evento })
      setCurrentEvento(evento)
    } else {
      setFormData({
        resident_id: '', titulo: '', descripcion: '',
        fecha_publicacion: '', fecha_evento: '',
        rango_horario: '', lugar: ''
      })
      setCurrentEvento(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => setOpenDialog(false);

  const handleViewEvento = (evento: TypeEvento) => {
    setCurrentEvento(evento)
    setOpenViewDialog(true)
  }

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.fecha_evento || !formData.lugar) {
      showAlert('Por favor completa los campos obligatorios', 'error')
      return
    }

    startTransition(async () => {
      try {
        let res: ActionResultEvento<TypeEvento>;

        if (currentEvento) {
          res = await updateEvento(currentEvento.id_evento, formData)
          if (res.success && res.data) {
            setEventos(prev => prev.map(e =>
              e.id_evento === (res.data as TypeEvento).id_evento ? (res.data as TypeEvento) : e
            ))
          }
        } else {
          res = await createEvento(formData)

          if (res.success && res.data) {
            setEventos(prev => [res.data as TypeEvento, ...prev])
          }
        }

        if (!res.success) {
          showAlert(res.error || 'Error en el servidor', 'error')
          return
        }

        showAlert("Evento guardado correctamente")
        handleCloseDialog()
      } catch (err) {
        console.error(err)
        showAlert('Error inesperado', 'error')
      }
    })
  }

  const handleDeleteEvento = async (evento: TypeEvento) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;

    startTransition(async () => {
      const res = await deleteEvento(evento.id_evento)
      if (!res.success) {
        showAlert(res.error || 'Error eliminando evento', 'error')
        return
      }
      setEventos(prev => prev.filter(e => e.id_evento !== evento.id_evento))
      showAlert('Evento eliminado')
    })
  }

  // --- LÓGICA DE INSCRIPCIONES (TAB 1) ---

  const handleDeleteInscripcion = async (id_inscripcion: number) => {
    if (!confirm('¿Deseas eliminar esta inscripción?')) return;

    startTransition(async () => {
      const res = await eliminarInscripcion(id_inscripcion);
      if (res.success) {
        setInscripciones(prev => prev.filter(i => i.id_inscripcion !== id_inscripcion));
        showAlert('Inscripción eliminada', 'success');
      } else {
        showAlert(res.error || 'Error al eliminar', 'error');
      }
    });
  }

  // --- RENDERIZADO ---

  return (
    <Paper elevation={1} sx={{ maxWidth: '1400px', margin: '0 auto', overflow: 'hidden', borderRadius: 2 }}>
      <Snackbar
        open={alert.show}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Cabecera con Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs gestion eventos">
          <Tab label="Gestión de Eventos" icon={<EventAvailableIcon />} iconPosition="start" />
          <Tab label={`Inscripciones (${inscripciones.length})`} icon={<PersonRemoveIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* TAB 0: TABLA DE EVENTOS */}
      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 4 }}>
            <TextField
              placeholder="Buscar por titulo"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#757575', fontSize: '20px' }} />
                  </InputAdornment>
                )
              }}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              size="large"
              disabled={isPending}
              color={'error'}
            >
              Nuevo evento
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Evento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Horario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Lugar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No hay eventos registrados</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  eventos.map((evento) => (
                    <TableRow key={evento.id_evento} hover>
                      <TableCell>{evento.id_evento}</TableCell>
                      <TableCell><Typography fontWeight="medium">{evento.titulo}</Typography></TableCell>
                      <TableCell>{formatDate(evento.fecha_evento)}</TableCell>
                      <TableCell>{evento.rango_horario}</TableCell>
                      <TableCell>{evento.lugar}</TableCell>
                      <TableCell align="center">
                        <IconButton color="info" size="small" onClick={() => handleViewEvento(evento)} disabled={isPending}>
                          <Visibility />
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => handleOpenDialog(evento)} disabled={isPending}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDeleteEvento(evento)} disabled={isPending}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* TAB 1: TABLA DE INSCRIPCIONES (NUEVO) */}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Residentes Inscritos</Typography>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID Inscripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Evento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Residente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inscripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscripciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No hay inscripciones registradas.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  inscripciones.map((insc) => (
                    <TableRow key={insc.id_inscripcion} hover>
                      <TableCell>{insc.id_inscripcion}</TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="primary">{insc.titulo_evento}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{insc.resident_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{insc.resident_id.substring(0, 8)}...</Typography>
                      </TableCell>
                      <TableCell>{formatDate(insc.fecha_inscripcion)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteInscripcion(insc.id_inscripcion)}
                          disabled={isPending}
                          title="Eliminar inscripción"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* DIALOGOS (CREAR/EDITAR) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentEvento ? 'Editar Evento' : 'Crear evento'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="UUID del Residente (Creador)"
              fullWidth
              value={formData.resident_id}
              onChange={(e) => setFormData({ ...formData, resident_id: e.target.value })}
              placeholder="Ej: a1b2c3d4..."
              disabled={isPending}
            />
            <TextField
              label="Título"
              fullWidth
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              disabled={isPending}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              disabled={isPending}
            />
            <TextField
              label="Fecha de publicación"
              type={currentEvento ? "text" : "date"}
              value={formData.fecha_publicacion}
              onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={!!currentEvento} // No editable si ya existe
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Fecha del evento"
                type="date"
                value={formData.fecha_evento}
                onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Horario (Ej: 2pm - 6pm)"
                value={formData.rango_horario}
                onChange={(e) => setFormData({ ...formData, rango_horario: e.target.value })}
                fullWidth
              />
            </Box>
            <TextField
              label="Lugar"
              value={formData.lugar}
              onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isPending}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isPending} startIcon={isPending ? <CircularProgress size={20} /> : null}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOGO VER DETALLES */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del evento</DialogTitle>
        <DialogContent>
          {currentEvento && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="h5" color="primary">{currentEvento.titulo}</Typography>
              <Typography variant="body1">{currentEvento.descripcion}</Typography>
              <Box display="flex" gap={4} mt={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Fecha Evento</Typography>
                  <Typography variant="body1">{formatDate(currentEvento.fecha_evento)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Horario</Typography>
                  <Typography variant="body1">{currentEvento.rango_horario}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Lugar</Typography>
                  <Typography variant="body1">{currentEvento.lugar}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default Eventos