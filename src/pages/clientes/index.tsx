import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableClientes from "src/views/tables/TableClientes";

const Clientes = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='LISTA DE CLIENTES' titleTypographyProps={{ variant: 'h6' }} />
                    <TableClientes />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Clientes);