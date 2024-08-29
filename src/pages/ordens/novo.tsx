import { Card, CardHeader, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableNovaOrdem from "src/views/tables/TableNovaOrdem";

const novo = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='GERANDO NOVA ORDEM' titleTypographyProps={{ variant: 'h3' }} />
                    <TableNovaOrdem />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(novo);