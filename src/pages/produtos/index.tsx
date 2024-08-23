import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableStickyHeader from "src/views/tables/TableStickyHeader";

const Produtos = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='LISTA DE PRODUTOS' titleTypographyProps={{ variant: 'h6' }} />
                    <TableStickyHeader />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(Produtos);