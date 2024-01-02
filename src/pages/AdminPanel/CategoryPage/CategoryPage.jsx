import React from 'react';
import { useState, useEffect } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Form, Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { app , storage } from '../../../firebase';
import { getFirestore, collection, getDocs, serverTimestamp, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../Products/Products.css'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MutatingDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




function CategoryPage() {
  const navigate = useNavigate();
  let categorySchema ={
    id:'',
    name:'',
    description: '',
    image: '',
    status: ''
  }
  const { Formik } = formik;
  const schema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    description: yup.string(),
  });
  const [modalShow, setModalShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categorySchema);
  const [imagePreviews, setImagePreviews] = useState(null);
  const [show, setShow] = useState(false);
  const [deleteCategory,setDeleteCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('');


  const handleEditCategory = (categoryId) => {
    console.log("category id",{categoryId})
    if(!categoryId) return;
    const index = categories.findIndex(
      (category) => category.id.toString() === categoryId.toString()
    );
    setSelectedStatus(categories[index].status)
    console.log(categories[index])

    setSelectedCategory(categories[index]);
    setModalShow(true);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };


  
const categoriesListFetch = async() => {
  const db = getFirestore(app)
  const cat = await getDocs(collection(db, 'categories'));
  const categoryList = cat.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log({categoryList})
return categoryList;
};

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      console.log("loggedin exists")
      navigate('/login')
      return;
    }
    categoriesListFetch().then((data)=>{
      setCategories(data)
      console.log({data})
    })
  }, []);

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


  const handleClose = (categoryId) => {
    setDeleteCategory(categoryId)
    setShow(false);
  }
  const handleShow = (categoryId) => {
    setDeleteCategory(categoryId)
    setShow(true);
  }

  const handleDeleteCategory = async() => {
    console.log({deleteCategory})

    if(!deleteCategory) return;
    const db = getFirestore(app)
    try{
       await deleteDoc(doc(db, "categories", deleteCategory ));
      const updatedCategories = await categoriesListFetch();
      setCategories(updatedCategories);
      setShow(false);
    }catch(err){
      console.log(err)
    }
  };

  const handleSearchChange = (event) => {
    console.log("entered")
    setSearchTerm(event.target.value.toLowerCase());
  };
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm)
  );

  async function submitData(data) {
    if(imagesArray['length'] !== 1 && !selectedCategory.image ) return;
    if(!selectedStatus) return;
    setIsLoading(true);
    
    data.status = selectedStatus;
    if(imagePreviews?.length){
      const file = imagesArray[0];
      const fileRef = ref(storage, `categories/${file.name}`);
      const uploadTask = uploadBytes(fileRef, file);
      const uploadResults = await uploadTask;
      const downloadUrls = await getDownloadURL(uploadResults.ref);
      data.image = downloadUrls;
    }else{
      data.image = selectedCategory.image
    }
    try {
      const db = getFirestore(app)
      if(!data.id){
        delete data.id
        data.timestamp = serverTimestamp();
        await addDoc(collection(db, 'categories'), data);
        toast.success('Category created Successfully!');
      }else{
        const categoriesRef = doc(db, "categories", data.id);
        console.log({categoriesRef})
        await updateDoc(categoriesRef,data);
        toast.success('Category updated Successfully!');
      }
      setImagePreviews([])
      setSelectedCategory(categorySchema);
      const updatedCategories =await categoriesListFetch();
      setCategories(updatedCategories);
      setModalShow(false);
      setIsLoading(false);
      
    } catch (error) {
      setImagePreviews([])
      toast.error('Something went wrong! Please try again later.');
      setIsLoading(false);
      console.error("Error while uploading images", error);
    }
  }

  const closeMainModal = ()=>{
    setSelectedCategory(categorySchema)
    setImagePreviews([])
    setModalShow(false)
  }

  return (
    <div className="widget-content searchable-container list products">
      <Modal show={modalShow} size="md" aria-labelledby="contained-modal-title-vcenter" animation scrollable centered>
        <Modal.Header closeButton onClick={() => closeMainModal()}>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>{!selectedCategory.id ? 'Add Category': 'Edit Category' }</b>
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => { 
            console.log("entered submit")
            submitData(values) 
          }}
          initialValues={
            selectedCategory ? {
              id:selectedCategory.id || '',
              name: selectedCategory.name || '',
              description: selectedCategory.description || '',
              image: selectedCategory.image || [],
              status: selectedCategory.status || '',
            }
          : {
              id:selectedCategory.id || '',
              name: '',
              description: '',
              image: [],
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

                  <Form.Group as={Col} md="12" controlId="validationFormik013" className='my-sm-2'>
                    <Form.Label> Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isValid={touched.description && !errors.description}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group as={Col} md="6" controlId="validationFormik02" className='my-sm-2'>
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
                    <Form.Label>Upload a Logo</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={
                        handleImageChange
                      }
                      isValid={touched.image && ( imagePreviews || selectedCategory.image.length) && !errors.image}
                      isInvalid={touched.image && !( imagePreviews || selectedCategory.image.length) }
                      // multiple // Allow multiple file selection
                      accept=".png, .jpeg, .jpg"
                    />
                    <Form.Control.Feedback type="invalid">Please select a image.</Form.Control.Feedback>
                  </Form.Group>
                  {  imagePreviews?.length > 0? (
                    <div>
                      {imagePreviews.map((image, index) => (
                        <img key={index} src={image} width={100} height={100} alt={`Image ${index + 1}`} />
                      ))}
                    </div>
                  ) : selectedCategory.image ? (
                    <div>
                        <img key={1} src={selectedCategory.image} width={100} height={100} alt={`Preview ${0 + 1}`} />
                    </div>
                  ) : (
                    <div>Please select a image for preview.</div>
                  )}
                </Row>
              )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-success' type="submit">{ !selectedCategory.id ?'Create': 'Save'}</Button>
                <Button className='btn-danger' onClick={() =>  closeMainModal()}>Close</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>



      </Modal>

      <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-4">
        <div className="card-body px-4 py-3">
          <div className="row align-items-center">
            <div className="col-9">
              <h4 className="fw-semibold mb-8">Categories</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a className="text-muted text-decoration-none" href="https://bootstrapdemos.adminmart.com/modernize/dist/main/index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">categories</li>
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
                placeholder="Search Categories..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e) }
              />
              <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
            </form>
          </div>
          <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            <div className="action-btn show-btn" style={{ display: 'none' }}>
              <a
                href=""
                className="delete-multiple bg-danger-subtle btn me-2 text-danger d-flex align-items-center font-medium"
              >
                <i className="ti ti-trash text-danger me-1 fs-5"></i> Delete All
              </a>
            </div>
            <button id="btn-add-contact" className="btn btn-info d-flex align-items-center" onClick={() => setModalShow(true)} >
              <i className="ti ti-shopping-cart text-white me-1 fs-5"></i> Add Category
            </button>
          </div>
        </div>



        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Delete Category</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the Category ? </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCategory()}>
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
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {!filteredCategories.length ? (
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
        {filteredCategories.map((category,i) => (
                <tr className="search-items" key={i}>
                  <td>
                    <div className="n-chk align-self-center text-center">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input contact-chkbox primary" id={category.name} />
                        <label className="form-check-label" htmlFor={category.name}></label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={category.image} alt="avatar" width="35" />
                      <div className="ms-3">
                        <div className="user-meta-info">
                          <h6 className="user-name mb-0" data-name={category.name}>{category.name}</h6>
                          {/* <span className="user-work fs-3" data-occupation="Web Developer">Web Developer</span> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* Assuming contact has an 'email' property */}
                    {category.description}
                  </td>        
                  <td className={category.status === 'active' ? 'badge bg-primary-subtle rounded-3 py-8 text-primary fw-semibold fs-2' : 'badge bg-danger rounded-3 py-8 text-white fw-semibold fs-2'}>
                    {category.status || '-'}
                  </td>

                  <td>
                    <div className="action-btn" style={{ 'display': 'flex' }}>
                      <div className="text-info edit" onClick={() => handleEditCategory(category.id)}>
                        {/* Assuming you have an SVG or icon for edit */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-edit" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
                      </div>
                      <div style={{ 'paddingTop': '2px' }} className="text-dark delete ms-2" onClick={() => handleShow(category.id)}>
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

export default CategoryPage;


