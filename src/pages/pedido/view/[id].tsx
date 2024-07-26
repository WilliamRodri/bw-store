import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableViewPedido from "src/views/tables/TableViewPedido";

const View = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Visualizando Pedido' titleTypographyProps={{ variant: 'h6' }} />
                    <TableViewPedido />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(View);