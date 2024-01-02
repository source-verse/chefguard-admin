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




function BannerPage() {
    const navigate = useNavigate();
  let bannerSchema ={
    id:'',
    name:'',
    description: '',
    image: '',
    status: '',
    type: '',
  }
  const { Formik } = formik;
  const schema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    description: yup.string(),
  });
  const [modalShow, setModalShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(bannerSchema);
  const [imagePreviews, setImagePreviews] = useState(null);
  const [show, setShow] = useState(false);
  const [deleteBanner,setDeleteBanner] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditBanner = (bannerId) => {
    console.log("banner id",{bannerId})
    if(!bannerId) return;
    const index = banners.findIndex(
      (banner) => banner.id.toString() === bannerId.toString()
    );
    setSelectedStatus(banners[index].status)
    setSelectedType(banners[index].type)
    setSelectedBanner(banners[index]);
    setModalShow(true);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSearchChange = (event) => {
    console.log("entered")
    setSearchTerm(event.target.value.toLowerCase());
  };
  
  const filteredBanners = banners.filter(banner =>
    banner.name.toLowerCase().includes(searchTerm)
  );
  
const bannersListFetch = async() => {
  const db = getFirestore(app)
  const ban = await getDocs(collection(db, 'banners'));
  const bannerList = ban.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log({bannerList})
return bannerList;
};

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      console.log("loggedin exists")
      navigate('/login')
      return;
    }
    bannersListFetch().then((data)=>{
      setBanners(data)
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
          newImagePreviews.push(reader.result);
          if (newImagePreviews.length === files.length) {
            setImagePreviews(newImagePreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreviews([]);
    }
  };


  const handleClose = (bannerId) => {
    setDeleteBanner(bannerId)
    setShow(false);
  }
  const handleShow = (bannerId) => {
    setDeleteBanner(bannerId)
    setShow(true);
  }

  const handleDeleteBanner = async() => {
    console.log({deleteBanner})

    if(!deleteBanner) return;
    const db = getFirestore(app)
    try{
       await deleteDoc(doc(db, "banners", deleteBanner ));
        const updatedbanners = await bannersListFetch();
        setBanners(updatedbanners);
        setShow(false);
    }catch(err){
      console.log(err)
    }
  };

  async function submitData(data) {
    if(imagesArray['length'] !== 1 && !selectedBanner.image ) return;
    if(!selectedStatus) return;
    setIsLoading(true);
    
    data.status = selectedStatus;
    data.type = selectedType;
    if(imagePreviews?.length){
      const file = imagesArray[0];
      const fileRef = ref(storage, `banners/${file.name}`);
      const uploadTask = uploadBytes(fileRef, file);
      const uploadResults = await uploadTask;
      const downloadUrls = await getDownloadURL(uploadResults.ref);
      data.image = downloadUrls;
    }else{
      data.image = selectedBanner.image
    }
    try {
      const db = getFirestore(app)
      if(!data.id){
        delete data.id
        data.timestamp = serverTimestamp();
        await addDoc(collection(db, 'banners'), data);
        toast.success('Banner created Successfully!');
      }else{
        const bannersRef = doc(db, "banners", data.id);
        console.log({bannersRef})
        await updateDoc(bannersRef,data);
        toast.success('Banner updated Successfully!');
      }
      const updatedbanners =await bannersListFetch();
      setBanners(updatedbanners);
      setIsLoading(false);
      setModalShow(false);
      setImagePreviews([])
      setSelectedBanner(bannerSchema);
      
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong! Please try again later.');
      console.error("Error while uploading images", error);
    }
  }

  const closeMainModal = ()=>{
    setSelectedBanner(bannerSchema)
    setImagePreviews([])
    setModalShow(false)
  }

  return (
    <div className="widget-content searchable-container list products">
      <Modal show={modalShow} size="md" aria-labelledby="contained-modal-title-vcenter" animation scrollable centered>
        <Modal.Header closeButton onClick={() => closeMainModal()}>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>{!selectedBanner.id ? 'Add Banner': 'Edit Banner' }</b>
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => { 
            console.log("entered submit")
            submitData(values) 
          }}
          initialValues={
            selectedBanner ? {
              id:selectedBanner.id || '',
              name: selectedBanner.name || '',
              description: selectedBanner.description || '',
              image: selectedBanner.image || [],
              status: selectedBanner.status || '',
              type: selectedBanner.type || '',
            }
          : {
              id:selectedBanner.id || '',
              name: '',
              description: '',
              image: [],
              status: '',
              type: '',
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


                  <Form.Group as={Col} md="6" controlId="validationFormik09" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedType}
                      onChange={handleTypeChange}
                      isValid={touched.type && !errors.type}
                      isInvalid={touched.type && !selectedType}
                    >
                      <option value="" disabled>Select</option>
                        <option value='main' key='active'>Main</option>
                        <option value='sub' key='inactive'>Sub</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="validationFormikFile" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Upload a Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={
                        handleImageChange
                      }
                      isValid={touched.image && ( imagePreviews || selectedBanner.image.length) && !errors.image}
                      isInvalid={touched.image && !( imagePreviews || selectedBanner.image.length) }
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
                  ) : selectedBanner.image ? (
                    <div>
                        <img key={1} src={selectedBanner.image} width={100} height={100} alt={`Preview ${0 + 1}`} />
                    </div>
                  ) : (
                    <div>Please select a image for preview.</div>
                  )}
                </Row>
              )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-success' type="submit">{ !selectedBanner.id ?'Create': 'Save'}</Button>
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
              <h4 className="fw-semibold mb-8">Banners</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a className="text-muted text-decoration-none" href="https://bootstrapdemos.adminmart.com/modernize/dist/main/index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">Banners</li>
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
                placeholder="Search Banners..."
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
              <i className="ti ti-shopping-cart text-white me-1 fs-5"></i> Add Banner
            </button>
          </div>
        </div>



        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Delete Banner</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the Banner ? </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteBanner()}>
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
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            {!filteredBanners.length ? (
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
        {filteredBanners.map((banner,i) => (
                <tr className="search-items" key={i}>
                  <td>
                    <div className="n-chk align-self-center text-center">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input contact-chkbox primary" id={banner.name} />
                        <label className="form-check-label" htmlFor={banner.name}></label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={banner.image} alt="avatar" width="35" />
                      <div className="ms-3">
                        <div className="user-meta-info">
                          <h6 className="user-name mb-0 capitalize" data-name={banner.name}>{banner.name}</h6>
                          {/* <span className="user-work fs-3" data-occupation="Web Developer">Web Developer</span> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='ellipse'>
                    {/* Assuming contact has an 'email' property */}
                    {banner.description}
                  </td>        
                  <td style={{'paddingTop':"8px",'paddingBottom':"8px"}} className={banner.status === 'active' ? 'badge bg-primary-subtle rounded-3 text-primary fw-semibold fs-2' : 'badge bg-danger rounded-3 text-white fw-semibold fs-2'}>
                    {banner.status || '-'}
                  </td>

                  <td className='capitalize' >
                    {banner.type || '-'}
                  </td>

                  <td>
                    <div className="action-btn" style={{ 'display': 'flex' }}>
                      <div className="text-info edit" onClick={() => handleEditBanner(banner.id)}>
                        {/* Assuming you have an SVG or icon for edit */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-edit" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
                      </div>
                      <div style={{ 'paddingTop': '2px' }} className="text-dark delete ms-2" onClick={() => handleShow(banner.id)}>
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

export default BannerPage;


