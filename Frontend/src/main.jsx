import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import { CartContext } from './assets/components/CartContext.jsx'
import {  CartProvider } from './assets/context/CartContext.jsx'
import { ProductProvider } from './assets/context/ProductContext.jsx'
import { OrderContext, OrderProvider } from './assets/context/OrderContext.jsx'
createRoot(document.getElementById('root')).render(
 <ProductProvider>
  <OrderProvider>
 <CartProvider>
    <App />
  </CartProvider>
  </OrderProvider>
  </ProductProvider>
)
