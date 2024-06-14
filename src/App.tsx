import './App.css'
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import { useDropzone } from "react-dropzone";
import { LoadingButton } from "@mui/lab";
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { Files } from "./Files.tsx";
import { useUploadFile } from "./pinata.ts";

const IPFS = 'IPFS'
type UploadService = 'IPFS'

function App() {
  const [open, setOpen] = useState(false)
  const [uploadService, setUploadService] = useState<UploadService>(IPFS)
  const openModal = (uploadService: UploadService) => {
    setUploadService(uploadService)
    setOpen(true)
  }

  return (
    <Grid container spacing={10} justifyContent="center">
      <Grid item xs={12}>
        <ProvidersGroup size="large" variant="contained">
          <Button onClick={() => openModal(IPFS)}>Upload to IPFS</Button>
        </ProvidersGroup>
        <UploadDialog uploadService={uploadService} open={open} setOpen={setOpen}></UploadDialog>
      </Grid>
      <Grid item xs={12}>
        <Files/>
      </Grid>
    </Grid>
  )
}

interface UploadDialogProps {
  uploadService: UploadService
  open: boolean
  setOpen: (open: boolean) => void
}

const UploadDialog = ({ uploadService, open, setOpen }: UploadDialogProps) => {
  const handleClose = () => setOpen(false)
  const { mutateAsync, isLoading } = useUploadFile(handleClose)
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ maxFiles: 1 })
  const fileToUpload = acceptedFiles[0]

  const onFileUpload = () => mutateAsync(fileToUpload)

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center">Upload on {uploadService}</DialogTitle>
        <DialogContent>
          <DropzoneBox {...getRootProps()}>
            <input {...getInputProps()} />
            <DialogContentText align="center">
              Upload files using Pinata on IPFS
            </DialogContentText>
          </DropzoneBox>
          <List sx={{ bgcolor: 'background.paper' }}>
            {fileToUpload &&
              <ListItem key={fileToUpload.name}>
                <ListItemIcon>
                  < FileIcon color="primary"/>
                </ListItemIcon>
                <ListItemText
                  primary={fileToUpload.name}
                />
              </ListItem>
            }
          </List>
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={onFileUpload} color="primary" loading={isLoading}
                         disabled={acceptedFiles.length < 1}>Upload</LoadingButton>
          <Button onClick={handleClose} color="warning" disabled={isLoading}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ProvidersGroup = styled(ButtonGroup)(() => ({
  '& .MuiButtonGroup-grouped': {
    minWidth: '150px'
  }
}))

const DropzoneBox = styled(Box)(() => ({
  minHeight: 150,
  minWidth: 300,
  border: 'dashed',
  borderColor: '#9e9e9e',
  paddingRight: 20,
  paddingLeft: 20,
  cursor: "pointer",
  backgroundColor: "#eeeeee",
  borderRadius: 5,
  display: 'flex',
  flexDirection: "column",
  justifyContent: "center"
}))

export default App
