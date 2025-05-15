import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getproducts, deleteProduct } from '../../api/productApi';
import EditProductForm from './EditProductForm';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  status: {
    active: boolean;
    inStock: boolean;
    featured: boolean;
  };
  category: {
    name: string;
  };
}

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      const response = await getproducts(page + 1, rowsPerPage) as {
        products: Product[];
        pagination: { total: number }
      };
      setProducts(response.products);
      setTotalProducts(response.pagination.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const DeleteConfirmationDialog = ({ open, onClose, onConfirm }: DeleteDialogProps) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

  const handleEdit = (productId: string) => {
    setCurrentProductId(productId);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentProductId(null);
  };

  const handleEditSuccess = () => {
    // Refresh the product list after a successful edit
    fetchProducts();
  };
  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the product list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      // Add better error handling
      // If you're using a notification system like notistack:
      // enqueueSnackbar(errorMessage, { variant: 'error' });

      // If the error is 401, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h1" color="primary.contrastText">
          Manage Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'primary.dark',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.main' },
            boxShadow: 3,
          }}
        >
          Add New Product
        </Button>
      </Box>
  
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: '#181c24',
          color: '#e0e7ef',
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#23272f' }}>
              <TableCell sx={{ color: '#90caf9', fontWeight: 600 }}>Product Name</TableCell>
              <TableCell sx={{ color: '#90caf9', fontWeight: 600 }}>Category</TableCell>
              <TableCell align="right" sx={{ color: '#90caf9', fontWeight: 600 }}>Price</TableCell>
              <TableCell align="right" sx={{ color: '#90caf9', fontWeight: 600 }}>Quantity</TableCell>
              <TableCell align="center" sx={{ color: '#90caf9', fontWeight: 600 }}>Status</TableCell>
              <TableCell align="center" sx={{ color: '#90caf9', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                sx={{
                  bgcolor: '#23272f',
                  '&:hover': { bgcolor: '#283046' },
                  transition: 'background 0.2s',
                }}
              >
                <TableCell sx={{ color: '#e0e7ef' }}>{product.name}</TableCell>
                <TableCell sx={{ color: '#e0e7ef' }}>{product.category.name}</TableCell>
                <TableCell align="right" sx={{ color: '#e0e7ef' }}>
                  PKR{product.price.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: '#e0e7ef' }}>
                  {product.quantity}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" flexDirection="column" gap={1} alignItems="center">
                    <Chip
                      label={product.status.active ? "Active" : "Inactive"}
                      color={product.status.active ? "success" : "default"}
                      size="small"
                      sx={{
                        bgcolor: product.status.active ? '#388e3c' : '#616161',
                        color: '#fff',
                        fontWeight: 500,
                      }}
                    />
                    {product.status.featured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 500 }}
                      />
                    )}
                    {!product.status.inStock && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 500 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Edit Product">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(product._id)}
                        sx={{
                          bgcolor: '#23272f',
                          color: '#90caf9',
                          '&:hover': { bgcolor: '#1976d2', color: '#fff' },
                          borderRadius: 2,
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(product._id)}
                        sx={{
                          bgcolor: '#23272f',
                          color: '#f87171',
                          '&:hover': { bgcolor: '#d32f2f', color: '#fff' },
                          borderRadius: 2,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            bgcolor: '#181c24',
            color: '#e0e7ef',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: '#b0b8c1',
            },
            '.MuiTablePagination-actions': {
              color: '#90caf9',
            },
          }}
        />
      </TableContainer>
  
      {/* Edit Product Dialog */}
      {editDialogOpen && currentProductId && (
        <EditProductForm
          open={editDialogOpen}
          productId={currentProductId}
          onClose={handleCloseEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}
  
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default AdminProducts;