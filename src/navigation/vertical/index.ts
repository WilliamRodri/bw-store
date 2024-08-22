// ** Icon imports
import ShoppingBagIcon from 'mdi-material-ui/Shopping';
import DashboardIcon from 'mdi-material-ui/ViewDashboard';
import ShoppingCartIcon from 'mdi-material-ui/Cart';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AccountCircle, DoorClosed, Toolbox } from 'mdi-material-ui'

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
      path: '/vendas'
    },
    {
      title: 'OR. DE SERVIÇOS',
      icon: Toolbox,
      path: '/ordens'
    },
    {
      title: 'PRODUTOS',
      icon: ShoppingCartIcon,
      path: '/produtos'
    },
    {
      title: 'CLIENTES',
      icon: AccountCircle,
      path: '/clientes'
    },
    {
      title: 'DESCONECTAR',
      icon: DoorClosed,
      path: '/api/logout'
    }
  ]
}

export default navigation
