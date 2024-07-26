import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableGerarPedido from "src/views/tables/TableGerarPedido";

const Add = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Gerando Pedido' titleTypographyProps={{ variant: 'h6' }} />
                    <TableGerarPedido />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(Add);