import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableViewModelo from "src/views/tables/TableViewModelo";

const View = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Visualizando Modelo' titleTypographyProps={{ variant: 'h6' }} />
                    <TableViewModelo />
                </Card>
            </Grid>
        </>
    )
}

export default withAuth(View);