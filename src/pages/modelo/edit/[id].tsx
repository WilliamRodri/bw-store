import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableEditarModelo from "src/views/tables/TableEditarModelo";

const Edit = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Editando Modelo' titleTypographyProps={{ variant: 'h6' }} />
                    <TableEditarModelo />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(Edit);