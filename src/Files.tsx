import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFiles } from "./pinata.ts";

export const Files = () => {
  const { data, isLoading } = useFiles()

  if (isLoading) {
    return <LoadingButton loading size="large">Loading...</LoadingButton>
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Create Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.rows.map((row) => (
            <TableRow
              key={row.ipfs_pin_hash}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="left">
                {row.metadata.name}
              </TableCell>
              <TableCell align="left">{row.ipfs_pin_hash}</TableCell>
              <TableCell align="left">{row.date_pinned.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
