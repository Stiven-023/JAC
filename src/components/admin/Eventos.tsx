import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState, useTransition } from 'react'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import SearchIcon from "@mui/icons-material/Search";
import { createEvento, deleteEvento, Evento as TypeEvento, updateEvento} from '../../lib/admin/eventos';

interface FormData {
  resident_id: string
  titulo: string
  descripcion?:string,
  fecha_publicacion: string,
  fecha_evento:string,
  rango_horario:string,
  lugar:string

}

interface AlertState {
  show: boolean
  message: string
  severity: 'success' | 'error'
}

interface Evento {
    id_evento:number,
    resident_id: string,
    titulo:string,
    descripcion?:string,
    fecha_publicacion: string,
    fecha_evento:string,
    rango_horario:string,
    lugar:string
}

const Eventos = ({initialEventos}:{initialEventos : TypeEvento[]}) => {

 const [openDialog, setOpenDialog] = useState<boolean>(false)
 const [currentEvento, setCurrentEvento] = useState<Evento | null >(null)
 const [openViewDialog, setOpenViewDialog] = useState<boolean>(false)
 const [formData, setFormData] = useState<FormData>({
      resident_id: '',
      titulo: '',
      descripcion: '',
      fecha_publicacion: '',
      fecha_evento: '',
      rango_horario: '',
      lugar: ''
   })
const [isPending, startTransition] = useTransition()

const handleOpenDialog = (evento: Evento | null = null) => {
    if (evento) {
      setFormData({
        ...evento,
        fecha_publicacion: evento.fecha_publicacion
      })
      setCurrentEvento(evento)
    } else {
      setFormData({ 
      resident_id: '',
      titulo: '',
      descripcion: '',
      fecha_publicacion: '',
      fecha_evento: '',
      rango_horario: '',
      lugar: ''})
      setCurrentEvento(null)
    }
    setOpenDialog(true)
  }

const handleCloseDialog = () => {
    setOpenDialog(false)
}

 const eventos = initialEventos ?? [];

 const [alert, setAlert] = useState<AlertState>({ 
    show: false, 
    message: '', 
    severity: 'success' 
  })

const showAlert = (message: string, severity: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, severity })
  }

const handleSubmit = async () => {
if (!formData.titulo || !formData.descripcion || !formData.resident_id || !formData.fecha_publicacion || !formData.fecha_evento || !formData.rango_horario || !formData.lugar) {
showAlert('Por favor completa todos los campos', 'error')
return
}


startTransition(async () => {
try {
let res


if (currentEvento) {
res = await updateEvento(currentEvento.id_evento, formData)

} else { 
res = await createEvento(formData)
}


if (!res.success) {
showAlert(res.error || 'Ocurrió un error en el servidor', 'error')
return
}


showAlert("Evento guardado correctamente")
handleCloseDialog()
} catch (err) {
console.error(err)
showAlert('Error inesperado al guardar el evento', 'error')
}
})
}

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const handleViewEvento = (evento: Evento) => {
      setCurrentEvento(evento)
      setOpenViewDialog(true)
    }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }


const handleDelete = async (evento: Evento) => {
if (!confirm('¿Seguro que deseas eliminar este evento?')) return;


startTransition(async () => {
const res = await deleteEvento(evento.id_evento)
if (!res.success) {
showAlert(res.error || 'Error eliminando evento', 'error')
return
}
showAlert('Evento eliminado')
})
}

  
  return (
    <>
      <Box sx={{ p: {}, maxWidth:'1400px',margin: '0 auto', backgroundColor: '#fafafa'}}>
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

         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap:4}}>
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
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        }
                    }}
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
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Título</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Residente</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Fecha publicacion</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Fecha de evento</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Rango horario</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Lugar</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }} align="center">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No hay eventos registrados</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventos.map((evento) => (
                      <TableRow key={evento.id_evento} hover>
                        <TableCell>{evento.id_evento}</TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">{evento.titulo}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={evento.resident_id.substring(0, 8) + '...'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{formatDate(evento.fecha_publicacion)}</TableCell>
                        <TableCell>{(evento.fecha_evento)}</TableCell>
                        <TableCell>{(evento.rango_horario)}</TableCell>
                        <TableCell>{(evento.lugar)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleViewEvento(evento)}
                            disabled={isPending}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDialog(evento)}
                            disabled={isPending}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(evento)}
                            disabled={isPending}
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


        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentEvento ? 'Editar Evento' : 'Crear evento'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="UUID del Residente"
              fullWidth
              value={formData.resident_id}
              onChange={(e) => setFormData({ ...formData, resident_id: e.target.value })}
              placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
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
              label="Descripcion"
              fullWidth
              multiline
              rows={4}
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
                disabled={currentEvento ? true : false}
            />

            <TextField
                    label="Fecha del evento"
                    type="date"
                    value={formData.fecha_evento}
                    onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
              />

              <TextField
                    label="Rango horario (ejemplo: 2pm - 6pm)"
                    value={formData.rango_horario}
                    onChange={(e) => setFormData({ ...formData, rango_horario: e.target.value })}
                    fullWidth
                />

                <TextField
                    label="Lugar del evento"
                    value={formData.lugar}
                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    fullWidth
                />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} /> : null}
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
        </Dialog>

        {/* Dialog Ver */}
          <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Detalles del evento</DialogTitle>
            <DialogContent>
              {currentEvento && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1">{currentEvento.id_evento}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Título
                    </Typography>
                    <Typography variant="h6">{currentEvento.titulo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripcion
                    </Typography>
                    <Typography variant="body1">{currentEvento.descripcion}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      UUID del Residente
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {currentEvento.resident_id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha de Publicación
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(currentEvento.fecha_publicacion)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha del evento
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(currentEvento.fecha_evento)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Horario 
                    </Typography>
                    <Typography variant="body1">{currentEvento.rango_horario}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Lugar del evento
                    </Typography>
                    <Typography variant="body1">
                      {(currentEvento.lugar)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>

      </Box>
    </>
  )
}

export default Eventos
