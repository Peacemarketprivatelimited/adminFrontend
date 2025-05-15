
import AddProductForm from '../../Components/AddProductForm'
import { token } from '../../services/token'
const ProductPage = () => {
  return (
    <div>
    <AddProductForm token={token || ''}/>  
    </div>

  )
}

export default ProductPage
