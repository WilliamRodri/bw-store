import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableEditarPedido from "src/views/tables/TableEditarPedido";

const Edit = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Editando Pedido' titleTypographyProps={{ variant: 'h6' }} />
                    <TableEditarPedido />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(Edit);