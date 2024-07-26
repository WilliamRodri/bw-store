import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TablePedidos from "src/views/tables/TablePedidos";

const Pedidos = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Pedidos' titleTypographyProps={{ variant: 'h6' }} />
                    <TablePedidos />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Pedidos);