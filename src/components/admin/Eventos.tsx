import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState, useTransition } from 'react'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import SearchIcon from "@mui/icons-material/Search";

interface FormData {
  resident_id: string
  titulo: string
  descripcion?:string,

}

interface AlertState {
  show: boolean
  message: string
  severity: 'success' | 'error'
}

interface Evento {
    id_avento:number,
    resident_id: string,
    titulo:string,
    descripcion:string,
    fecha_publicacion: string,
    fecha_evento:string,
    rango_horario:string,
    lugar:string
}

const Eventos = () => {

 const [openDialog, setOpenDialog] = useState<boolean>(false)
 const [currentEvento, setCurrentEvento] = useState<Evento | null >(null)
 const [formData, setFormData] = useState<FormData>({
     resident_id: '',
     titulo: '',
     descripcion: '',
   })
const [isPending, startTransition] = useTransition()

  const handleOpenDialog = (evento: Evento | null = null) => {
    if (evento) {
      setFormData({
        resident_id: evento.resident_id,
        titulo: evento.titulo
      })
      setCurrentEvento(evento)
    } else {
      setFormData({ resident_id: '', titulo: '', descripcion: '' })
      setCurrentEvento(null)
    }
    setOpenDialog(true)
  }

const handleCloseDialog = () => {
    setOpenDialog(false)
}

 const eventos = [
    {
        id_avento:1,
        resident_id: 'a1fe0bbd-3396-41af-9315-ce3a54369e5b',
        titulo:'Fiesta de navidad',
        descripcion:'Fiesta de navidad ',
        fecha_publicacion:'30-11-2025',
        fecha_evento:'24-12-2025',
        rango_horario:'10:00 p.m',
        lugar:'Salon comunal'
    }
];

 const [alert, setAlert] = useState<AlertState>({ 
    show: false, 
    message: '', 
    severity: 'success' 
  })

const showAlert = (message: string, severity: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, severity })
  }

const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion || !formData.resident_id) {
      showAlert('Por favor completa todos los campos', 'error')
      return
    }

    startTransition(async () => {
      try {
        handleCloseDialog()
      } catch (error) {
        showAlert('Error inesperado al guardar la noticia', 'error')
        console.error(error)
      }
    })
  }
  return (
    <>
      <Box sx={{ p: {}, maxWidth:'1400px',margin: '0 auto', backgroundColor: '#fafafa'}}>
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
        //   disabled={isPending}
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
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No hay noticias registradas</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventos.map((evento) => (
                      <TableRow key={evento.id_avento} hover>
                        <TableCell>{evento.id_avento}</TableCell>
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
                        <TableCell>{(evento.fecha_publicacion)}</TableCell>
                        <TableCell>{(evento.fecha_evento)}</TableCell>
                        <TableCell>{(evento.rango_horario)}</TableCell>
                        <TableCell>{(evento.lugar)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => {}}
                            // disabled={isPending}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {}}
                            // disabled={isPending}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {}}
                            // disabled={isPending}
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
            //   disabled={isPending}
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

      </Box>
    </>
  )
}

export default Eventos
