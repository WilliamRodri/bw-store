import { CardHeader, Grid, Card } from "@mui/material";
import { parseCookies } from "nookies";
import withAuth from "src/lib/withAuth";
import TableViewSales from "src/views/tables/TableViewSales";

const Sales = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='LISTA DE VENDAS' titleTypographyProps={{ variant: 'h3' }} />
                    <TableViewSales />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Sales);