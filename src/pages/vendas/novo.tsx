import { Card, CardHeader, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableNovaVenda from "src/views/tables/TableNovaVenda";

const novo = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='GERANDO NOVA VENDA' titleTypographyProps={{ variant: 'h3' }} />
                    <TableNovaVenda />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(novo);