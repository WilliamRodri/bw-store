import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableCriarModelo from "src/views/tables/TableCriarModelo";

const View = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Criando Modelo' titleTypographyProps={{ variant: 'h6' }} />
                    <TableCriarModelo />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(View);