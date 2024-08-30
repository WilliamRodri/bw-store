import { CardHeader, Grid, Card } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableViewRelatorioPrincipal from "src/views/tables/TableViewRelatorioPrincipal";

const dash = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='VISÃO GERAL' titleTypographyProps={{ variant: 'h3' }} />
                    <TableViewRelatorioPrincipal />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(dash);