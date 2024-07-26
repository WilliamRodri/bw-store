// ** Icon imports
import ShoppingBagIcon from 'mdi-material-ui/Shopping';
import DashboardIcon from 'mdi-material-ui/ViewDashboard';
import ShoppingCartIcon from 'mdi-material-ui/Cart';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AccountCircle, DoorClosed } from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'DASHBOARD',
      icon: DashboardIcon,
      path: '/dash'
    },
    {
      title: 'VENDAS',
      icon: ShoppingBagIcon,
      path: '/sales'
    },
    {
      title: 'PRODUTOS',
      icon: ShoppingCartIcon,
      path: '/material'
    },
    {
      title: 'CLIENTES',
      icon: AccountCircle,
      path: '/usuarios'
    },
    {
      title: 'DESCONECTAR',
      icon: DoorClosed,
      path: '/api/logout'
    }
  ]
}

export default navigation
