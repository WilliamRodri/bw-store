import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DeleteEmpty, EyeArrowRight, Plus, Printer, ViewArray } from "mdi-material-ui";
import { Fragment, useState } from "react";

const TableViewSales = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const colunasTabelaVendas: readonly any[] = [
        { id: 'id_venda', label: '#', minWidth: 66, align: "left" },
        { id: 'total_venda', label: 'TOTAL', minWidth: 100, align: 'left' },
        { id: 'produtos_venda', label: 'PRODUTOS(TOTAL)', minWidth: 130, align: 'left' },
        { id: 'data_venda', label: 'DATA', minWidth: 150, align: 'left' },
        { id: 'pagamento_venda', label: 'FORMA DE PAGAMENTO', minWidth: 150, align: 'left' },
        { id: 'actions', label: 'AÇÕES', minWidth: 170, align: "right" },
    ]

    const filteredRows = searchTerm.trim() === '' ? rows : rows.filter(row =>
        row.id_venda.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} >
                <TextField
                    label="PESQUISAR VENDA"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 20px' }}
                />
                <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }}>
                    GERAR NOVA VENDA
                </Button>
                <TableContainer sx={{ maxHeight: 440 }} >
                    <Table stickyHeader aria-label="sticky table" >
                        <TableHead>
                            <TableRow>
                                {colunasTabelaVendas.map((column) => (
                                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                                <strong>AINDA NÃO FOI REALIZADA NENHUMA VENDA!</strong>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {colunasTabelaVendas.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} >
                                                        {column.id === 'actions' ? (
                                                            <Fragment>
                                                                <IconButton>
                                                                    <EyeArrowRight />
                                                                </IconButton>
                                                                <IconButton>
                                                                    <Printer />
                                                                </IconButton>
                                                                <IconButton>
                                                                    <DeleteEmpty />
                                                                </IconButton>
                                                            </Fragment>
                                                        ): (
                                                            value
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Fragment>
    );
}

export default TableViewSales;