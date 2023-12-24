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
import QRCode from 'qrcode.react';




function EmployeePage() {
    const navigate = useNavigate();
  let employeeSchema ={
    id:'',
    name: '',
    email:'',
    phone:'',
    dept:'',
    designation: '',
    employeeId: '',
    gender: '',
    address:'',
    image: '',
  }
  const { Formik } = formik;
  const schema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    email: yup.string().required('Email is required.'),
    phone: yup.number().required('Phone no. is required.'),
    dept: yup.string().required('Department is required.'),
    employeeId: yup.string().required('EmployeeId is required.'),
    designation: yup.string().required('Designation is required.'),
    address: yup.string(),
  });
  const [modalShow, setModalShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(employeeSchema);
  const [imagePreviews, setImagePreviews] = useState(null);
  const [show, setShow] = useState(false);
  const [deleteBanner,setDeleteBanner] = useState('')
  const [qrCodeModalShow, setQRCodeModalShow] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');




  const handleEditEmployee = (employeeId) => {
    console.log("emp id",{employeeId})
    if(!employeeId) return;
    const index = employees.findIndex(
      (employee) => employee.id.toString() === employeeId.toString()
    );
    setSelectedEmployee(employees[index]);
    setModalShow(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on search
};

const handleGenderChange = (e)=>{
  setSelectedGender(e.target.value)
}

  

  
const employeesListFetch = async() => {
  const db = getFirestore(app)
  const ban = await getDocs(collection(db, 'employees'));
  const empList = ban.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log({empList})
return empList;
};

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      console.log("loggedin exists")
      navigate('/login')
      return;
    }
    employeesListFetch().then((data)=>{
      setEmployees(data)
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


  const handleClose = (employeeId) => {
    setDeleteBanner(employeeId)
    setShow(false);
  }
  const handleShow = (employeeId) => {
    setDeleteBanner(employeeId)
    setShow(true);
  }

  const handleDeleteBanner = async() => {
    console.log({deleteBanner})

    if(!deleteBanner) return;
    const db = getFirestore(app)
    try{
       await deleteDoc(doc(db, "employees", deleteBanner ));
        const updatedemployees = await employeesListFetch();
        setEmployees(updatedemployees);
        setShow(false);
    }catch(err){
      console.log(err)
    }
  };

  const handleQREmployee = (employeeId) => {
    setQRCodeValue(`https://chefguard.vercel.app/employee/${employeeId}`); // Set the URL you want to encode in the QR code
    setQRCodeModalShow(true);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrCodeCanvas');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `Employee-${qrCodeValue}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setQRCodeModalShow(false);
  };

  async function submitData(data) {
    if(!selectedGender) return;
    if(imagesArray['length'] !== 1 && !selectedEmployee.image ) return;
    setIsLoading(true);
    
    if(imagePreviews?.length){
      const file = imagesArray[0];
      const fileRef = ref(storage, `employees/${file.name}`);
      const uploadTask = uploadBytes(fileRef, file);
      const uploadResults = await uploadTask;
      const downloadUrls = await getDownloadURL(uploadResults.ref);
      data.image = downloadUrls;
    }else{
      data.image = selectedEmployee.image
    }
    try {
      const db = getFirestore(app)
      if(!data.id){
        delete data.id
        data.timestamp = serverTimestamp();
        await addDoc(collection(db, 'employees'), data);
      }else{
        const employeesRef = doc(db, "employees", data.id);
        console.log({employeesRef})
        await updateDoc(employeesRef,data);
      }
      const updatedemployees =await employeesListFetch();
      setEmployees(updatedemployees);
      setIsLoading(false);
      setModalShow(false);
      setSelectedEmployee(employeeSchema);
      
    } catch (error) {
      console.error("Error while uploading images", error);
    }
  }

  const closeMainModal = ()=>{
    setSelectedEmployee(employeeSchema)
    setImagePreviews([])
    setModalShow(false)
  }


  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm)
);

const indexOfLastEmployee = currentPage * employeesPerPage;
const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Pagination Component
const Pagination = ({ employeesPerPage, totalEmployees, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalEmployees / employeesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item' style={{'cursor':'pointer'}}>
                        <a onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
    }

  return (
    <div className="widget-content searchable-container list products">
      <Modal show={modalShow} size="md" aria-labelledby="contained-modal-title-vcenter" animation scrollable centered>
        <Modal.Header closeButton onClick={() => closeMainModal()}>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>{!selectedEmployee.id ? 'Add Employee': 'Edit Employee' }</b>
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => { 
            console.log("entered submit")
            submitData(values) 
          }}
          initialValues={
            selectedEmployee ? {
              id:selectedEmployee.id || '',
              name: selectedEmployee.name || '',
              email: selectedEmployee.email || '',
              phone: selectedEmployee.phone || '',
              dept: selectedEmployee.dept || '',
              designation: selectedEmployee.designation || '',
              employeeId: selectedEmployee.employeeId || '',
              gender: selectedEmployee.gender || '',
              address: selectedEmployee.address || '',
              image: selectedEmployee.image || '',
            }
          : {
              id: '',
              name: '',
              email:'',
              phone:'',
              dept:'',
              designation: '',
              employeeId: '',
              gender: '',
              address:'',
              image: '',
              
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

                  <Form.Group as={Col} md="6" controlId="validationFormik31" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isValid={touched.email && !errors.email}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationFormik32" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Phone no.</Form.Label>
                    <Form.Control
                      type="number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      isValid={touched.phone && !errors.phone}
                      isInvalid={touched.phone && !!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>

               


                  <Form.Group as={Col} md="6" controlId="validationFormik01" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="dept"
                      value={values.dept}
                      onChange={handleChange}
                      isValid={touched.dept && !errors.dept}
                      isInvalid={touched.dept && !!errors.dept}
                    />
                    <Form.Control.Feedback type="invalid">{errors.dept}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationFormik01" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={values.designation}
                      onChange={handleChange}
                      isValid={touched.designation && !errors.designation}
                      isInvalid={touched.designation && !!errors.designation}
                    />
                    <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationFormik01" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Employee Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="employeeId"
                      value={values.employeeId}
                      onChange={handleChange}
                      isValid={touched.employeeId && !errors.employeeId}
                      isInvalid={touched.employeeId && !!errors.employeeId}
                    />
                    <Form.Control.Feedback type="invalid">{errors.employeeId}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationFormik33" className='my-sm-2'>
                    <span className='importantStar'>* </span>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="category"
                      value={selectedGender}
                      onChange={handleGenderChange}
                      isValid={touched.gender && !errors.gender}
                      isInvalid={touched.gender && !selectedGender}
                    >
                      <option value="" disabled>Select a gender</option>
                      <option value='male' key='male'>Male</option>
                      <option value='female' key='female'>female</option>
                      <option value='others' key='others'>others</option>
                      <option value='prefer not to say' key='prefer not to say'>Prefer not to say</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group as={Col} md="12" controlId="validationFormik013" className='my-sm-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      isValid={touched.address && !errors.address}
                      isInvalid={touched.address && !!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
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
                      isValid={touched.image && ( imagePreviews || selectedEmployee.image.length) && !errors.image}
                      isInvalid={touched.image && !( imagePreviews || selectedEmployee.image.length) }
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
                  ) : selectedEmployee.image ? (
                    <div>
                        <img key={1} src={selectedEmployee.image} width={100} height={100} alt={`Preview ${0 + 1}`} />
                    </div>
                  ) : (
                    <div>Please select a image for preview.</div>
                  )}
                </Row>
              )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-success' type="submit">{ !selectedEmployee.id ?'Create': 'Save'}</Button>
                <Button className='btn-danger' onClick={() =>  closeMainModal()}>Close</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>



      </Modal>


      <Modal show={qrCodeModalShow} onHide={() => setQRCodeModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <QRCode id="qrCodeCanvas" value={qrCodeValue} size={256} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setQRCodeModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={downloadQRCode}>
            Download QR Code
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-4">
        <div className="card-body px-4 py-3">
          <div className="row align-items-center">
            <div className="col-9">
              <h4 className="fw-semibold mb-8">Employees</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a className="text-muted text-decoration-none" href="https://bootstrapdemos.adminmart.com/modernize/dist/main/index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">Employees</li>
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
                placeholder="Search employee..."
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
              <i className="ti ti-shopping-cart text-white me-1 fs-5"></i> Add Employee
            </button>
          </div>
        </div>



        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Delete Employee</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the Employee ? </Modal.Body>
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
                <th>Employee Id</th>
                <th>Designation</th>
                <th>address</th>
                <th style={{'textAlign':'center'}}>Actions</th>
              </tr>
            </thead>
            {!currentEmployees.length ? (
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
        {currentEmployees.map((employee,i) => (
                <tr className="search-items" key={i}>
                  <td>
                    <div className="n-chk align-self-center text-center">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input contact-chkbox primary" id={employee.name} />
                        <label className="form-check-label" htmlFor={employee.name}></label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={employee.image} alt="avatar" width="35" />
                      <div className="ms-3">
                        <div className="user-meta-info">
                          <h6 className="user-name mb-0 capitalize" data-name={employee.name}>{employee.name}</h6>
                          {/* <span className="user-work fs-3" data-occupation="Web Developer">Web Developer</span> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='ellipse'>
                    {/* Assuming contact has an 'email' property */}
                    {employee.employeeId}
                  </td>        
                  {/* <td style={{'paddingTop':"8px",'paddingBottom':"8px"}} className={employee.status === 'active' ? 'badge bg-primary-subtle rounded-3 text-primary fw-semibold fs-2' : 'badge bg-danger rounded-3 text-white fw-semibold fs-2'}>
                    {employee.status || '-'}
                  </td> */}

                  <td className='capitalize' >
                    {employee.designation || '-'}
                  </td>
                  <td className='capitalize' >
                    {employee.address || '-'}
                  </td>

                  <td>
                    <div className="action-btn" style={{ 'display': 'flex', 'justifyContent':'end','gap':'7px' }}>
                      <div className="edit" onClick={() => handleQREmployee(employee.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-qrcode" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                            <path d="M7 17l0 .01" />
                            <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                            <path d="M7 7l0 .01" />
                            <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                            <path d="M17 7l0 .01" />
                            <path d="M14 14l3 0" />
                            <path d="M20 14l0 .01" />
                            <path d="M14 14l0 3" />
                            <path d="M14 20l3 0" />
                            <path d="M17 17l3 0" />
                            <path d="M20 17l0 3" />
                            </svg>
                      </div>
                      <div className="text-info edit" onClick={() => handleEditEmployee(employee.id)}>
                        {/* Assuming you have an SVG or icon for edit */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-edit" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
                      </div>
                      <div style={{ 'paddingTop': '2px' }} className="text-dark delete ms-2" onClick={() => handleShow(employee.id)}>
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
          <Pagination
                employeesPerPage={employeesPerPage}
                totalEmployees={filteredEmployees.length}
                paginate={paginate}
            />
        </div>
      </div>
    </div>

  );

}

export default EmployeePage;


