import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Sidebar from './Components/Sidebar';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AddCategoryPage from './pages/Category/AddCategoryPage';
import ProductPage from './pages/product/ProductPage';
import UserPage from './pages/User/UserPage';
import AdminProducts from './pages/ShowAllProducts/AdminProducts';
import WithDrawls from './pages/WithDrawls/WithDrawls';
import Orders from './pages/Orders/Orders';
import BlogListPage from './pages/Blog/BlogListPage';
import BlogFormPage from './pages/Blog/BlogFormPage';
import EarnPage from './pages/EarnPage/EarnPage';
import Tasks from './pages/Taskspage/Tasks';


function App() {




  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/categories" element={<AddCategoryPage />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/users" element={<UserPage />} />
                    <Route path="/adminProducts" element={<AdminProducts />} />
                    <Route path="/withDrawls" element={<WithDrawls />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="//Watch&Earn" element={<EarnPage />} />


                    <Route path="/blogs" element={<BlogListPage />} />
                    <Route path="/blogs/create" element={<BlogFormPage />} />
                    <Route path="/blogs/edit/:id" element={<BlogFormPage />} />

                     <Route path="/tasks" element={<Tasks />} />




                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;