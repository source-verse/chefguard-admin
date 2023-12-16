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




function Testimonials() {
  const navigate = useNavigate();
  let testimonialSchema ={
    id:'',
    message:'',

  }
  const { Formik } = formik;
  const schema = yup.object().shape({
    message: yup.string().required('message is required.'),
  });
  const [modalShow, setModalShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonials, setSelectedTestimonials] = useState(testimonialSchema);

  const handleEditTestimonial = (testimonial) => {
    if(!testimonial.id) return;
    setSelectedTestimonials(testimonial);
    setModalShow(true);
  };

  
  const testimonialsListFetch = async() => {
    const db = getFirestore(app)
    const test = await getDocs(collection(db, 'testimonials'));
    const testimonialList = test.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log({testimonialList})
  return testimonialList;
  };

  async function submitData(data) {
    if(data.message.length > 90 ) return;
    data.id = selectedTestimonials.id;
    setIsLoading(true);
    const db = getFirestore(app)
    try {
      const testimonialsRef = doc(db, "testimonials", data.id);
      await updateDoc(testimonialsRef,data);
    } catch (error) {
      console.error("update",error);
    }
      const updatedtestimonials =await testimonialsListFetch();
      setTestimonials(updatedtestimonials);
      setIsLoading(false);
      setModalShow(false);
      setSelectedTestimonials(testimonialSchema);
  }

  const closeMainModal = ()=>{
    setSelectedTestimonials(testimonialSchema)
    setModalShow(false)
  }


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      console.log("loggedin exists")
      navigate('/login')
      return;
    }
    testimonialsListFetch().then((data)=>{
      setTestimonials(data)
      console.log({data})
    })
  }, []);

  return (
    <div className="widget-content searchable-container list products">
      <Modal show={modalShow} size="md" aria-labelledby="contained-modal-title-vcenter" animation scrollable centered>
        <Modal.Header closeButton onClick={() => closeMainModal()}>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>{!selectedTestimonials.id ? 'Add Testimonials': 'Edit Testimonials' }</b>
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => { 
            console.log("entered submit")
            submitData(values) 
          }}
          initialValues={
            selectedTestimonials ? {
              message: selectedTestimonials.message || '',
            }
          : {
            message: '',
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
                  <Form.Group as={Col} md="12" controlId="validationFormik013" className='my-sm-2'>
                    <div style={{'display':'flex', 'justifyContent':'space-between'}}>
                        <div>
                        <Form.Label> Message </Form.Label>
                        </div>
                    {values.message.length < 90 ? 
                        <div style={{'color':'gray'}}>
                        ({100 - values.message.length} Characters left.)
                        </div> : 
                        <div style={{'color':'red'}}>
                        Character limit exceeded.
                        </div>  
                      }
                        
                    </div>
                    {/* </Form.Label> */}
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={handleChange}
                      isValid={touched.message && values.message.length < 90 && !errors.message}
                      isInvalid={touched.message && (values.message.length > 90 || !!errors.message) }
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-success' type="submit">Save</Button>
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
              <h4 className="fw-semibold mb-8">Testimonials</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a className="text-muted text-decoration-none" href="https://bootstrapdemos.adminmart.com/modernize/dist/main/index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">Testimonials</li>
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
       

        <div className="table-responsive">
          <table className="table search-table align-middle text-nowrap" style={{'tableLayout':'fixed','width':'100%'}}>
            <thead className="header-item">
              <tr>
                <th style={{'width':'90%'}}>Message</th>
                <th style={{'textAlign':'end'}}>Actions</th>
              </tr>
            </thead>
            {!testimonials.length ? (
              <tbody>
                <tr>
                <td colSpan={12}>
                <MutatingDots
                    height="100"
                    width="90"
                    radius={9}
                    color="green"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ /* additional wrapper styles */ }}
                    wrapperClass="additional-css-class"
                    />
                </td>              
               </tr>
              </tbody>
      ) : (
        <tbody>
        {testimonials.map((testimonial,i) => (
                <tr className="search-items" key={i}>
                 
                  <td>
                    <div className='text-truncate'>
                    {testimonial.message}
                    </div>
                    {/* Assuming contact has an 'email' property */}
                  </td>        
                  <td>
                    <div className="action-btn" style={{ 'display': 'flex','justifyContent':'end' }}>
                      <div className="text-info edit" onClick={() => handleEditTestimonial(testimonial)}>
                        {/* Assuming you have an SVG or icon for edit */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-edit" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
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

export default Testimonials;


