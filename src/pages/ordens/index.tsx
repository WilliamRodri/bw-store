import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableViewOrdens from "src/views/tables/TableViewOrdens";

const Ordem = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='ORDENS DE SERVIÇOS' titleTypographyProps={{ variant: 'h6' }} />
                    <TableViewOrdens />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Ordem);