import { CardHeader, Card, Grid } from "@mui/material";
import withAuth from "src/lib/withAuth";
import TableUsuarios from "src/views/tables/TableUsuarios";

const Usuarios = () => {
    return(
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Usuários' titleTypographyProps={{ variant: 'h6' }} />
                    <TableUsuarios />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Usuarios);