'use client'

import { useState, useTransition } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
} from '@mui/material'
import SearchIcon from "@mui/icons-material/Search";
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { createNoticia, updateNoticia, deleteNoticia } from '../../lib/admin/noticias'
import type { Noticia } from '@/lib/supabase'

interface NoticiasTableProps {
  initialNoticias: Noticia[]
}

interface FormData {
  resident_id: string
  titulo: string
  contenido: string
}

interface AlertState {
  show: boolean
  message: string
  severity: 'success' | 'error'
}

export default  function NoticiasTable({ initialNoticias }: NoticiasTableProps) {
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false)
  const [currentNoticia, setCurrentNoticia] = useState<Noticia | null>(null)
  const [formData, setFormData] = useState<FormData>({
    resident_id: '',
    titulo: '',
    contenido: '',
  })

  

  
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<AlertState>({ 
    show: false, 
    message: '', 
    severity: 'success' 
  })

  const showAlert = (message: string, severity: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const handleOpenDialog = (noticia: Noticia | null = null) => {
    if (noticia) {
      setFormData({
        resident_id: noticia.resident_id,
        titulo: noticia.titulo,
        contenido: noticia.contenido,
      })
      setCurrentNoticia(noticia)
    } else {
      setFormData({ resident_id: '', titulo: '', contenido: '' })
      setCurrentNoticia(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentNoticia(null)
    setFormData({ resident_id: '', titulo: '', contenido: '' })
  }

  const handleViewNoticia = (noticia: Noticia) => {
    setCurrentNoticia(noticia)
    setOpenViewDialog(true)
  }

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.contenido || !formData.resident_id) {
      showAlert('Por favor completa todos los campos', 'error')
      return
    }

    startTransition(async () => {
      try {
        if (currentNoticia) {
          const result = await updateNoticia(currentNoticia.id_noticia, formData)
          if (result.success && result.data) {
            setNoticias(noticias.map((n) => 
              n.id_noticia === currentNoticia.id_noticia 
                ? result.data as Noticia
                : n
            ))
            showAlert('Noticia actualizada exitosamente')
          } else {
            showAlert(result.error || 'Error al actualizar', 'error')
          }
        } else {
          const result = await createNoticia(formData)
          if (result.success && result.data) {
            setNoticias([result.data as Noticia, ...noticias])
            showAlert('Noticia creada exitosamente')
          } else {
            showAlert(result.error || 'Error al crear', 'error')
          }
        }
        handleCloseDialog()
      } catch (error) {
        showAlert('Error inesperado al guardar la noticia', 'error')
        console.error(error)
      }
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return

    startTransition(async () => {
      try {
        const result = await deleteNoticia(id)
        if (result.success) {
          setNoticias(noticias.filter((n) => n.id_noticia !== id))
          showAlert('Noticia eliminada exitosamente')
        } else {
          showAlert(result.error || 'Error al eliminar', 'error')
        }
      } catch (error) {
        showAlert('Error inesperado al eliminar la noticia', 'error')
        console.error(error)
      }
    })
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

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fafafa' }}>
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
          Nueva Noticia
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Título</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Residente</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No hay noticias registradas</Typography>
                </TableCell>
              </TableRow>
            ) : (
              noticias.map((noticia) => (
                <TableRow key={noticia.id_noticia} hover>
                  <TableCell>{noticia.id_noticia}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{noticia.titulo}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={noticia.resident_id.substring(0, 8) + '...'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(noticia.fecha_publicacion)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="info"
                      size="small"
                      onClick={() => handleViewNoticia(noticia)}
                      disabled={isPending}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(noticia)}
                      disabled={isPending}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(noticia.id_noticia)}
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

      {/* Dialog Crear/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentNoticia ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
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
              label="Contenido"
              fullWidth
              multiline
              rows={4}
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
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

      {/* Dialog Ver */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Noticia</DialogTitle>
        <DialogContent>
          {currentNoticia && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ID
                </Typography>
                <Typography variant="body1">{currentNoticia.id_noticia}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Título
                </Typography>
                <Typography variant="h6">{currentNoticia.titulo}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Contenido
                </Typography>
                <Typography variant="body1">{currentNoticia.contenido}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  UUID del Residente
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {currentNoticia.resident_id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha de Publicación
                </Typography>
                <Typography variant="body1">
                  {formatDate(currentNoticia.fecha_publicacion)}
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
  )
}
