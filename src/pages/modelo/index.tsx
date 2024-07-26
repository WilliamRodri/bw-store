import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableCustoModelos from "src/views/tables/TableCustoModelos";

const Modelo = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Custo de Modelos' titleTypographyProps={{ variant: 'h6' }} />
                    <TableCustoModelos />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Modelo);