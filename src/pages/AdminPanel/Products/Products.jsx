import React from 'react';
import { useState, useEffect } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Form, Modal } from 'react-bootstrap';
// import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { app , storage } from '../../../firebase';
import { getFirestore, collection, getDocs, serverTimestamp, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './Products.css'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { MutatingDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';



function Products() {
  const navigate = useNavigate();
  const productSchema = {
    id:'',
    name: '',
    modelNo: '',
    category: '',
    price: '',
    color: '',
    offer: '',
    stock: '',
    images: [],
    status: '',
  }
  const { Formik } = formik;
  const schema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    modelNo: yup.string(),
    // category: yup.string().required('Category is required.'),
    price: yup.number().required('Price is required.'),
    // // color: yup.string().required(),
    offer: yup.number(),
    stock: yup.number(),
    // images: yup.object().required("Please select 4 images."),
    // status: yup.string().required("Status is required."),
  });

  const [products, setProducts] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [additionalNames, setAdditionalNames] = useState(['']);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [show, setShow] = useState(false);
  const [deleteProduct,setDeleteProduct] = useState('')
  const [imagePreviews, setImagePreviews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');





  const handleClose = (productId) => {
    setDeleteProduct(productId)
    setShow(false);
  }
  const handleShow = (productId) => {
    console.log("first",productId)
    setDeleteProduct(productId)
    setShow(true);
  }
  const handleStatusChange = (e) => {
    console.log(e.target.value)
    setSelectedStatus(e.target.value);
  };

  const handleAddTextbox = () => {
    setAdditionalNames([...additionalNames, '']);
  };

  const handleDeleteTextbox = (index) => {
    const newNames = [...additionalNames];
    newNames.splice(index, 1);
    setAdditionalNames(newNames);
  };

  const handleEditTextbox = (index, event) => {
    const newNames = [...additionalNames];
    newNames[index] = event.target.value;
    setAdditionalNames(newNames);
  }
  // const [scrollableModal, setScrollableModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: '',
    modelNo: '',
    category: '',
    price: '',
    color: '',
    offer: '',
    stock: '',
    images: '',
    status: ''
  });


  const handleEditProduct = (productId) => {
    if(!productId) return;
    const index = products.findIndex(
      (product) => product.id.toString() === productId.toString()
    );
    // console.log(products[index].additionalNames)
    if(products[index].features) setAdditionalNames(products[index].features);
    setSelectedStatus(products[index].status)
    setSelectedCategory(products[index].categoryId)
    console.log(products[index])

    setSelectedProduct(products[index]);
    setModalShow(true);
  };

  const handleDeleteProduct = async() => {
    console.log({deleteProduct})
    if(!deleteProduct) return;
    const db = getFirestore(app);
    try{
      let data = await deleteDoc(doc(db, "products", deleteProduct ));
      console.log({data})
      const updatedProducts = await fetchProductsAndCategories();
      setProducts(updatedProducts);
      setDeleteProduct('')
      setShow(false);

    }catch(err){
      console.log(err)
    }
  };


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };





  const handleImageChange = (e) => {
    setImagesArray(e.target.files);
    const files = e.target.files;

    if (files.length > 0) {
      const newImagePreviews = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () => {
          // Add the image preview to the array
          newImagePreviews.push(reader.result);

          // If all images are processed, update the state
          if (newImagePreviews.length === files.length) {
            setImagePreviews(newImagePreviews);
          }
        };

        // Read the contents of the selected image file as a data URL
        reader.readAsDataURL(file);
      }
    } else {
      // Clear the image previews if no files are selected
      setImagePreviews([]);
    }
  };

  
const fetchProductsAndCategories = async() => {
  const db = getFirestore(app)
  const prod = await getDocs(collection(db, 'products'));
  const cat = await getDocs(collection(db, 'categories'));
  const productList = prod.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const categoryList = cat.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setCategories(categoryList);
  let products = [];

  for (const prodData of productList) {
    if (prodData.categoryId) {
      const categoryId = prodData.categoryId;
      const catData = categoryList.find((cat) =>{ 
        return cat.id && (cat.id.toString() == categoryId.toString())
      });
      if (catData) {
        products.push({ ...prodData, categoryName: catData.name });
      } else {
        products.push({ ...prodData, categoryName: '' });
      }
    }
  }
return products;
};





const handleSearchChange = (event) => {
  console.log("entered")
  setSearchTerm(event.target.value.toLowerCase());
};

const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchTerm)
);



  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log({isLoggedIn})
    if (!isLoggedIn) {
      console.log("user not loggedin")
      navigate('/login')
      return;
    }
    fetchProductsAndCategories().then((data)=>{
      setProducts(data)
      // console.log({data})
    })
  }, []);


  async function submitData(data) {
    console.log({data},selectedProduct.images)
    if(imagesArray['length'] !== 4 && selectedProduct.images.length !==4 ) {
      console.log("returning")
      return;
    }
    console.log("first")
    if(!selectedCategory) return;
    if(!selectedStatus) return;
    setIsLoading(true);
    data.features = additionalNames;
    data.categoryId = selectedCategory;
    data.status = selectedStatus;
  
    // data.images = [];
    const uploadPromises = [];
    if(imagePreviews?.length){
      for (let i = 0; i < imagesArray.length; i++) {
        const file = imagesArray[i];
        const fileRef = ref(storage, `images/product-${file.name}`);
        const uploadTask = uploadBytes(fileRef, file);
        uploadPromises.push(uploadTask);
      }
      const uploadResults = await Promise.all(uploadPromises);
      let downloadUrls = await Promise.all(
        uploadResults.map(result => getDownloadURL(result.ref))
      );
      console.log("All images are uploaded:", downloadUrls);
      // Here you can handle the array of download URLs as needed
      while (downloadUrls.length < 4) {
        // Add the first element of the array to itself until it reaches a length of 4
        downloadUrls = [...downloadUrls, downloadUrls[0]];
      }
      data.images = downloadUrls;
    }else{
      data.images = selectedProduct.images;
    }
    
    const db = getFirestore(app)
    try {
      if(!data.id){
        delete data.id;
        data.timestamp = serverTimestamp();
        console.log({...data})

        const docRef = await addDoc(collection(db, 'products'), data);
        // await setProducts(fetchProductsAndCategories())
        toast.success('Product created Successfully!');
        console.log({docRef})
        
      }else{
        const productRef = doc(db, "products", data.id);
        // console.log({productRef})
        await updateDoc(productRef,data);
        toast.success('Product updated Successfully!');
      }
      setSelectedCategory('');
      setAdditionalNames([''])
      setImagePreviews([])
      const updatedProducts = await fetchProductsAndCategories();
        setProducts(updatedProducts);
        setModalShow(false);
        setSelectedProduct(productSchema);
        setIsLoading(false);
        
    } catch (error) {
      toast.error('Something went wrong while uploading the images!');
        setIsLoading(false);
        console.error("Error while uploading images", error);
    }
    
  }

  const closeMainModal = ()=>{
    setSelectedProduct(productSchema)
    setSelectedCategory('');
    setAdditionalNames([''])
    setImagePreviews([])
    setModalShow(false)
  }



  return (

    <div className="widget-content searchable-container list products">
      {/* Add Contact Modal */}

      <Modal show={modalShow} size="md" aria-labelledby="contained-modal-title-vcenter" animation scrollable centered>
        <Modal.Header closeButton onClick={() => closeMainModal()}>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>Add Product</b>
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => { 
            console.log("entered submit")
            submitData(values) 
          }}
          initialValues={
            selectedProduct ? {
              // If selectedProduct is available, use its values
              id:selectedProduct.id || '',
              name: selectedProduct.name || '',
              modelNo: selectedProduct.modelNo || '',
              category: selectedProduct.category || '',
              price: selectedProduct.price || '',
              color: selectedProduct.color || '',
              offer: selectedProduct.offer || '',
              stock: selectedProduct.stock || '',
              images: selectedProduct.images || [],
              status: selectedProduct.status || '',
            }
          : {
              // Otherwise, use default values
              id:selectedProduct.id || '',
              name: '',
              modelNo: '',
              category: '',
              price: '',
              color: '',
              offer: '',
              stock: '',
              images: [],
              status: '',
            }
        }
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
              {isLoading ? (
              <MutatingDots
              height="200"
              width="80"
              radius={9}
              color="green"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ /* additional wrapper styles */ }}
              wrapperClass="additional-css-class"
              />
             ) : (
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationFormik01">
                    <span className='importantStar'>* </span>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                      isInvalid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group as={Col} md="6" controlId="validationFormik013" className='my-sm-2'>
                    <Form.Label> Model No.</Form.Label>
                    <Form.Control
                      type="text"
                      name="modelNo"
                      value={values.modelNo}
                      onChange={handleChange}
                      isValid={touched.modelNo && !errors.modelNo}
                      isInvalid={touched.modelNo && !!errors.modelNo}
                    />
                    <Form.Control.Feedback type="invalid">{errors.modelNo}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="6" controlId="validationFormik02" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isValid={touched.category && !errors.category}
                      isInvalid={touched.category && !selectedCategory}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option value={category.id} key={`${category.id}`}>{category.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                  </Form.Group>




                  <Form.Group as={Col} md="6" controlId="validationFormik03" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Price   ( ₹ )</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      isValid={touched.price && !errors.price}
                      isInvalid={touched.price && !!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="6" controlId="validationFormik04" className='my-sm-2'>
                    <Form.Label>Offer   (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="offer"
                      value={values.offer}
                      onChange={handleChange}
                      isValid={touched.offer && !errors.offer}
                      isInvalid={touched.offer && !!errors.offer}
                    />
                    <Form.Control.Feedback type="invalid">{errors.offer}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="12" controlId="validationFormik01" className='my-sm-2'>
                    <Form.Label>Features</Form.Label>
                    {additionalNames.map((additionalName, index) => (
                      <div key={index} style={{ 'display': 'flex', 'margin': '5px' }}>
                        <Form.Control
                          type="text"
                          value={additionalName}
                          onChange={(e) => handleEditTextbox(index, e)}
                        />

                        {additionalNames.length > 1 && (
                          <button type='button' className="btn btn-red text-white delete ms-2" onClick={() => handleDeleteTextbox(index)}><i className="ti ti-trash fs-5"></i></button>
                        )}
                      </div>
                    ))}
                    <div>
                      <button type='button' className='btn' style={{ 'backgroundColor': "#e2e2e2", 'width': '80px', 'marginLeft': '5px' }} onClick={handleAddTextbox}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width={20} height={15} viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 5l0 14" />
                          <path d="M5 12l14 0" />
                        </svg>Add</button>
                    </div>

                    {additionalNames.map((additionalName, index) => (
                      <Form.Control.Feedback key={`error-${index}`} type="invalid">{errors.additionalName}</Form.Control.Feedback>
                    ))}
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="6" controlId="validationFormik05" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={values.stock}
                      onChange={handleChange}
                      isValid={touched.stock && !errors.stock}
                      isInvalid={touched.stock && !!errors.stock}
                    />
                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                  </Form.Group>


                  {/* <Form.Group as={Col} md="6" controlId="validationFormik018" className='my-sm-2'>
                  <span className='importantStar'>* </span>
                    <Form.Label> Status</Form.Label>
                    <Form.Control
                      type="text"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      isValid={touched.status && !errors.status}
                      isInvalid={touched.status && !!errors.status}
                    />
                    <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                  </Form.Group> */}

                  <Form.Group as={Col} md="6" controlId="validationFormik018" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      isValid={touched.status && !errors.status}
                      isInvalid={touched.status && !selectedStatus}
                    >
                      <option value="" disabled>Select</option>
                        <option value='active' key='active'>Active</option>
                        <option value='inactive' key='inactive'>Inactive</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="12" controlId="validationFormikFile" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Upload Images (4 no.s)</Form.Label>
                    <Form.Control
                      type="file"
                      name="images"
                      onChange={
                        handleImageChange
                      }
                      isValid={touched.images && ( imagePreviews || selectedProduct.images.length) && !errors.images}
                      isInvalid={touched.images && !( imagePreviews || selectedProduct.images.length) }
                      multiple // Allow multiple file selection
                      max={4}
                      accept=".png, .jpeg, .jpg"
                    />
                    <Form.Control.Feedback type="invalid">Please select 4 images.</Form.Control.Feedback>
                  </Form.Group>
            
                  {  imagePreviews?.length > 0? (
                    <div>
                      {imagePreviews.map((image, index) => (
                        <img key={index} src={image} width={100} height={100} alt={`Image ${index + 1}`} />
                      ))}
                    </div>
                  ) : selectedProduct.images?.length > 0 ? (
                    <div>
                      {selectedProduct.images.map((preview, index) => (
                        <img key={index} src={preview} width={100} height={100} alt={`Preview ${index + 1}`} />
                      ))}
                    </div>
                  ) : (
                    <div>Please select images for preview.</div>
                  )}


                </Row>
             )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-success' type="submit">{ !selectedProduct.id ?'Create': 'Save'}</Button>
                <Button className='btn-danger' onClick={() => closeMainModal()}>Close</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>



      </Modal>

      <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-4">
        <div className="card-body px-4 py-3">
          <div className="row align-items-center">
            <div className="col-9">
              <h4 className="fw-semibold mb-8">Products</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a className="text-muted text-decoration-none" href="https://bootstrapdemos.adminmart.com/modernize/dist/main/index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">Products</li>
                </ol>
              </nav>
            </div>
            <div className="col-3">
              <div className="text-center mb-n5">
                <img
                  src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/breadcrumb/ChatBc.png"
                  alt=""
                  className="img-fluid mb-n4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-body">
        <div className="row mb-12">
          <div className="col-md-4 col-xl-3">
            <form className="position-relative">
              <input
                type="text"
                className="form-control product-search ps-5"
                id="input-search"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e) }
              />
              <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
            </form>
          </div>
          <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            <div className="action-btn show-btn" style={{ display: 'none' }}>
              {/* <a
                href=""
                className="delete-multiple bg-danger-subtle btn me-2 text-danger d-flex align-items-center font-medium"
              >
                <i className="ti ti-trash text-danger me-1 fs-5"></i> Delete All
              </a> */}
            </div>
            <button id="btn-add-contact" className="btn btn-info d-flex align-items-center" onClick={() => setModalShow(true)} >
              <i className="ti ti-shopping-cart text-white me-1 fs-5"></i> Add Product
            </button>
          </div>
        </div>


        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Delete Product</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the product ? </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteProduct()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


        <div className="table-responsive">
          <table className="table search-table align-middle text-nowrap">
            <thead className="header-item">
              <tr>
                <th style={{ 'width': '20px' }}>
                  <div className="n-chk align-self-center text-center">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input primary" id="contact-check-all" />
                      <label className="form-check-label" htmlFor="contact-check-all"></label>
                      <span className="new-control-indicator"></span>
                    </div>
                  </div>
                </th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Offer (%) </th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {!filteredProducts.length ? (
              <tbody>
                <tr>
                <td colSpan={12}>
                <MutatingDots
                    height="100"
                    width="90"
                    radius={9}
                    color="#125c21"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ /* additional wrapper styles */ }}
                    wrapperClass="additional-css-class"
                    />
                </td>              
               </tr>
              </tbody>
      ) : (
            <tbody>
              {filteredProducts.map((product,i) => (
                <tr className="search-items" key={i}>
                  <td>
                    <div className="n-chk align-self-center text-center">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input contact-chkbox primary" id={product.name} />
                        <label className="form-check-label" htmlFor={product.name}></label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={product.images[0]} alt="IMG" width="35" />
                      <div className="ms-3">
                        <div className="user-meta-info">
                          <h6 className="user-name mb-0" data-name={product.name}>{product.name}</h6>
                          {/* <span className="user-work fs-3" data-occupation="Web Developer">Web Developer</span> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* <td>
                        <div className="d-flex align-items-center">
                          {product.name}
                        </div>
                      </td> */}
                  <td>
                    {/* Assuming contact has an 'email' property */}
                    {product.categoryName || '-'}
                  </td>
                  <td>
                    {/* Assuming contact has a 'location' property */}
                    {product.price || '-'}
                  </td>
                  <td>
                    {/* Assuming contact has a 'phone' property */}
                    {product.offer? product.offer+' %' : '-'}
                  </td>
                  <td>
                    {/* Assuming contact has a 'phone' property */}
                    {product.stock}
                  </td>
                  <td className={product.status === 'active' ? 'badge bg-primary-subtle rounded-3 py-8 text-primary fw-semibold fs-2' : 'badge bg-danger rounded-3 py-8 text-white fw-semibold fs-2'}>
                    {product.status || '-'}
                  </td>
                  <td>
                    <div className="action-btn" style={{ 'display': 'flex' }}>
                      <div className="text-info edit" onClick={() => handleEditProduct(product.id)}>
                        {/* Assuming you have an SVG or icon for edit */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-edit" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
                      </div>
                      {/* </a> */}
                      <div style={{ 'paddingTop': '2px' }} className="text-dark delete ms-2" onClick={() => handleShow(product.id)}>
                        {/* Assuming you have an icon for delete */}
                        <i className="ti ti-trash fs-5"></i>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
      )}

            
          </table>
        </div>
      </div>
    </div>

  );

}

export default Products;


