import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import withAuth from 'src/lib/withAuth'

const Dashboard = () => {

  const router = useRouter();
  useEffect(() => {
    router.push('/pedido');
  }, [router]);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
        <Typography>Redirecionando Você!</Typography>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default withAuth(Dashboard);
