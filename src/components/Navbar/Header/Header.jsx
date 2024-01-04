import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const remove = function(){
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activeLink');
    navigate('/login');
  }
  return (
    <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item d-block d-xl-none">
              <div className="nav-link sidebartoggler nav-icon-hover" style={{'cursor':'pointer'}} id="headerCollapse">
                <i className="ti ti-menu-2"></i>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-icon-hover">
                <i className="ti ti-bell-ringing"></i>
                <div className="notification bg-primary rounded-circle"></div>
              </a>
            </li>
          </ul>
          <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
            <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
              {/* <a href="https://adminmart.com/product/modernize-free-bootstrap-admin-dashboard/" target="_blank" className="btn btn-primary">Download Free</a> */}
              <li className="nav-item dropdown">
                <a className="nav-link nav-icon-hover" id="drop2" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg" alt="" width="35" height="35" className="rounded-circle" />
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                  <div className="message-body">
                    <div className="btn btn-danger mx-3 mt-2 d-block" onClick={remove}>Logout</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </header>
  )
}

export default Header