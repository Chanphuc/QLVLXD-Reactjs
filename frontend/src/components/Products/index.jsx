
import { MenuItem, Select, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';
import { getAllCategories } from '../../services/category';
import { getAllProducts, getProductsByCategory, searchProduct } from '../../services/product';
import Product from '../Product';
import './style.scss';


function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);

    const elementRef = useRef(null);

    const getAllProductsFn = async () => {
        const response = await getAllProducts();
        if(response.data) setProducts(response.data);
        if(elementRef.current) elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); // sroll xuong danh sach san pham
    }

    const getProductsByCategoryFn = async (categoryId) => {
        const response = await getProductsByCategory(categoryId);
        setProducts(response.data);
        elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); // dung o tren
    }

    async function fetchDataView () {
        const response = await getAllCategories();
        const categories = response.data;
        categories.unshift({ _id: 'all', name: 'All' });
        
        setCategories(categories);
        getAllProductsFn();        
    }
    // khi vào render lần đầu nó sẽ nhảy vào effect
    useEffect(() => {
        fetchDataView()
    }, []);

    useEffect(() => {
        if(products.length && loading) setLoading(false)
    },[products])

    const onSelectedCategoryChange = async (value) => {
        setSelectedCategory(value);
        setLoading(true)
        if (value === 'all') {
            getAllProductsFn();
        } else {
            getProductsByCategoryFn(value);
        }
    }

    const onSearchChange = async (event) => {
        const searchValue = event.target.value;
        setSearchValue(searchValue);

        if (searchValue) {
            const response = await searchProduct(searchValue);
            setProducts(response.data);
        } else {
            getAllProductsFn();
        } 
    }

    // return : render view
    if(!products.length) return null

    return ( 
        <div className="products container" ref={elementRef}>
            {
                !loading ? (
                    <>
                        <h2 className="products__heading">SẢN PHẨM TẠI SHOP</h2>
                        <div className='products__top'>
                            <div className='products__search'>
                                <TextField name='search' placeholder='Tìm kiếm...' value={searchValue} 
                                    onChange={onSearchChange}
                                />
                                <p>Có tất cả <b>{products.length}</b> sản phẩm</p>
                            </div>
                            <Select value={selectedCategory} onChange={(e) => onSelectedCategoryChange(e.target.value)}>
                                {
                                    categories.map(category => (
                                        <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='products__list'>
                            {
                                products.map(item => (
                                    <Product key={item._id} product={item} />
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <CircularProgress />
                )
            }

        </div>
     );
}

export default Products;