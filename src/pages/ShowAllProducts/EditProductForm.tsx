import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  SelectChangeEvent,
  Box
} from '@mui/material';
import { updateProduct, getProductById } from '../../api/productApi';
import { Category } from '../../types/product';

interface EditProductFormProps {
  open: boolean;
  productId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EditProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  quantity: number;
  'category._id': string;
  'status.active': boolean;
  'status.featured': boolean;
  'discount.regular.percentage': number;
  'discount.regular.active': boolean;
  'discount.subscription.percentage': number; // <-- Add this
  'discount.subscription.active': boolean;    // <-- Add this

}

// Define the UpdateProductData interface to match the expected type
interface UpdateProductData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  quantity: number;
  category: string; // Changed from object to string to match API expectations
  status: {
    active: boolean;
    featured: boolean;
  };
  discount: {
    regular: {
      percentage: number;
      active: boolean;
    };
    subscription: {
      percentage: number;
      active: boolean;
    };
  };
}

const EditProductForm: React.FC<EditProductFormProps> = ({ open, productId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories] = useState<Category[]>([]); // Removed unused setCategories
  const [formData, setFormData] = useState<EditProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    quantity: 0,
    'category._id': '',
    'status.active': true,
    'status.featured': false,
    'discount.regular.percentage': 0,
    'discount.regular.active': false,
    'discount.subscription.percentage': 0,
    'discount.subscription.active': false
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (open && productId) {
      fetchProductData();
    }
  }, [open, productId]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      // Fetch product details
      const response = await getProductById(productId);
      // If your API returns { success, product }
      const product = response.product || response; // fallback if not wrapped


      // Flatten the product object for form data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || 0,
        quantity: product.quantity || 0,
        'category._id': product.category?._id || '',
        'status.active': product.status?.active || false,
        'status.featured': product.status?.featured || false,
        'discount.regular.percentage': product.discount?.regular?.percentage || 0,
        'discount.regular.active': product.discount?.regular?.active || false,

        'discount.subscription.percentage': product.discount?.subscription?.percentage || 0, // <-- Add this
        'discount.subscription.active': product.discount?.subscription?.active ?? false      // <-- Add this
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData({
      ...formData,
      [name as keyof EditProductFormData]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as keyof EditProductFormData]: value === '' ? '' : Number(value)
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken') || '';

      // Transform form data back into the expected structure
      const productData: UpdateProductData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        quantity: formData.quantity,
        category: formData['category._id'],
        status: {
          active: formData['status.active'],
          featured: formData['status.featured']
        },
        discount: {
          regular: {
            percentage: formData['discount.regular.percentage'],
            active: formData['discount.regular.active']
          },
          subscription: {
            percentage: formData['discount.subscription.percentage'],
            active: formData['discount.subscription.active']
          }
        }
      };

      await updateProduct(productId, productData, token);

      // Call the success callback to refresh the product list
      if (onSuccess) {
        onSuccess();
      }

      // Close the dialog
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ...existing code...
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#181c24',
          color: '#e0e7ef',
          borderRadius: 3,
          boxShadow: 8,
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: '#23272f', color: '#90caf9', fontWeight: 700 }}>
        Edit Product
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ bgcolor: '#181c24' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" padding={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {error && (
                <Box mb={2}>
                  <Typography color="error">{error}</Typography>
                </Box>
              )}
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1 1 45%" minWidth="200px">
                  <TextField
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{ style: { color: '#b0b8c1' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#23272f',
                        color: '#e0e7ef',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#374151',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90caf9',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#b0b8c1',
                      },
                    }}
                  />
                </Box>
                <Box flex="1 1 45%" minWidth="200px">
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleNumberChange}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                    }}
                    InputLabelProps={{ style: { color: '#b0b8c1' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#23272f',
                        color: '#e0e7ef',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#374151',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90caf9',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#b0b8c1',
                      },
                    }}
                  />
                </Box>
                <Box flex="1 1 45%" minWidth="200px">
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleNumberChange}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{ style: { color: '#b0b8c1' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#23272f',
                        color: '#e0e7ef',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#374151',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90caf9',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#b0b8c1',
                      },
                    }}
                  />
                </Box>
                {categories.length > 0 && (
                  <Box flex="1 1 45%" minWidth="200px">
                    <FormControl fullWidth margin="normal"
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: '#23272f',
                          color: '#e0e7ef',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#374151',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#90caf9',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#b0b8c1',
                        },
                      }}
                    >
                      <InputLabel sx={{ color: '#b0b8c1' }}>Category</InputLabel>
                      <Select
                        name="category._id"
                        value={formData['category._id']}
                        onChange={handleChange}
                        label="Category"
                        required
                        sx={{
                          bgcolor: '#23272f',
                          color: '#e0e7ef',
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>
              <Box mt={2}>
                <TextField
                  label="Short Description"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  InputLabelProps={{ style: { color: '#b0b8c1' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#23272f',
                      color: '#e0e7ef',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#374151',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#90caf9',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b8c1',
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  label="Full Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  multiline
                  rows={4}
                  InputLabelProps={{ style: { color: '#b0b8c1' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#23272f',
                      color: '#e0e7ef',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#374151',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#90caf9',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b8c1',
                    },
                  }}
                />
              </Box>
              <Box display="flex" flexWrap="wrap" mt={2} gap={3}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData['discount.subscription.active']}
                        onChange={handleChange}
                        name="discount.subscription.active"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#1976d2',
                          },
                        }}
                      />
                    }
                    label={<span style={{ color: '#b0b8c1' }}>Subscription Discount Active</span>}
                  />
                </Box>


                <Box mt={2} maxWidth="50%">
                  <TextField
                    label="Subscription Discount Percentage"
                    name="discount.subscription.percentage"
                    type="number"
                    value={formData['discount.subscription.percentage']}
                    onChange={handleNumberChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    disabled={!formData['discount.subscription.active']}
                    InputLabelProps={{ style: { color: '#b0b8c1' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#23272f',
                        color: '#e0e7ef',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#374151',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90caf9',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#b0b8c1',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData['status.active']}
                        onChange={handleChange}
                        name="status.active"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#1976d2',
                          },
                        }}
                      />
                    }
                    label={<span style={{ color: '#b0b8c1' }}>Active</span>}
                  />
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData['status.featured']}
                        onChange={handleChange}
                        name="status.featured"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#1976d2',
                          },
                        }}
                      />
                    }
                    label={<span style={{ color: '#b0b8c1' }}>Featured</span>}
                  />
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData['discount.regular.active']}
                        onChange={handleChange}
                        name="discount.regular.active"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#1976d2',
                          },
                        }}
                      />
                    }
                    label={<span style={{ color: '#b0b8c1' }}>Discount Active</span>}
                  />
                </Box>
              </Box>
              <Box mt={2} maxWidth="50%">
                <TextField
                  label="Discount Percentage"
                  name="discount.regular.percentage"
                  type="number"
                  value={formData['discount.regular.percentage']}
                  onChange={handleNumberChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  disabled={!formData['discount.regular.active']}
                  InputLabelProps={{ style: { color: '#b0b8c1' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#23272f',
                      color: '#e0e7ef',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#374151',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#90caf9',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b8c1',
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#23272f' }}>
          <Button onClick={onClose} color="secondary" sx={{ color: '#b0b8c1' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading || saving}
            sx={{
              bgcolor: '#1976d2',
              color: '#fff',
              '&:hover': { bgcolor: '#1565c0' },
              boxShadow: 3,
            }}
          >
            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
  // ...existing code...
};

export default EditProductForm;