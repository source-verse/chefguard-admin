import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'


function Sidebar() {

  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (index) => {
    localStorage.setItem('activeLink', JSON.stringify(index));
    setActiveLink(index);
  };

  const links = [
    { to: '/admin/dashboard', icon: 'ti ti-dashboard', text: 'Dashboard' },
    { to: '/admin/products', icon: 'ti ti-shopping-cart', text: 'Products' },
    { to: '/admin/categories', icon: 'ti ti-category-2', text: 'Categories' },
    { to: '/admin/banners', icon: 'ti ti-layout-collage', text: 'Banners' },
    { to: '/admin/testimonials', icon: 'ti ti-blockquote', text: 'Testimonials' },
    { to: '/admin/employees', icon: 'ti ti-user', text: 'Employees' },
  ];

  useEffect(() => {
    // Retrieve the active link from localStorage on component mount
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink !== null) {
      setActiveLink(JSON.parse(storedActiveLink));
    }else{
      setActiveLink(0)
    }
  }, []);

  const logoText = {'color':'#237804', 'fontWeight':'800', 'marginLeft':'10px'}
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <div className="text-nowrap logo-img">
            <img src="https://firebasestorage.googleapis.com/v0/b/chefguard-5ca00.appspot.com/o/images%2Flogo.png?alt=media&token=e0d2877a-2920-4c6b-84f3-4ec89219885b" width={35} height={30} alt="" />
            <span style={logoText}>CHEFGUARD</span>
          </div>
          <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
            <i className="ti ti-x fs-8"></i>
          </div>
        </div>
        {/* <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">Home</span>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/dashboard" aria-expanded="false">
                <span>
                  <i className="ti ti-dashboard"></i>
                </span>
                <span className="hide-menu">Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/products">
                <span>
                  <i className="ti ti-shopping-cart"></i>
                </span>
                <span className="hide-menu">Products</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/categories">
                <span>
                  <i className="ti ti-category-2"></i>
                </span>
                <span className="hide-menu">Categories</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/banners">
                <span>
                  <i className="ti ti-layout-collage"></i>
                </span>
                <span className="hide-menu">Banners</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/testimonials">
                <span>
                  <i className="ti ti-blockquote"></i>
                </span>
                <span className="hide-menu">Testimonials</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/admin/employees">
                <span>
                  <i className="ti ti-user"></i>
                </span>
                <span className="hide-menu">Employees</span>
              </Link>
            </li>
            
          </ul>
          
        </nav> */}

        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                  <ul id="sidebarnav">
                  <li className="nav-small-cap">
                    <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                    <span className="hide-menu">Home</span>
                  </li>
                    {links.map((link, index) => (
                      <li key={index} className="sidebar-item">
                        <Link
                          className={`sidebar-link ${index === activeLink ? 'active' : ''}`}
                          to={link.to}
                          onClick={() => handleLinkClick(index)}
                        >
                          <span>
                            <i className={link.icon}></i>
                          </span>
                          <span className="hide-menu">{link.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
      </div>
    </aside>
  )
}

export default Sidebar