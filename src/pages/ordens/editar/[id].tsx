import { Card, CardHeader, Grid } from "@mui/material";
import { useRouter } from "next/router";
import withAuth from "src/lib/withAuth";
import TableEditarOrdem from "src/views/tables/TableEditarOrdem";

const Editar = () => {
    const { query } = useRouter();

    return (
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='EDITANDO ORDEM' titleTypographyProps={{ variant: 'h3' }} />
                    <TableEditarOrdem id={query.id} />
                </Card>
            </Grid>
        </>
    );
}

export default withAuth(Editar);