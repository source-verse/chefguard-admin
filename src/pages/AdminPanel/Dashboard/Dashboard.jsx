import React, { useState } from 'react';
// import DashboardCard from '../../../components/DashboardCard/DashboardCard';
// import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
// import { Person as PersonIcon } from '@mui/icons-material';
import ApexCharts from 'react-apexcharts';
function Dashboard() {
 const [productCount,setproductCount] = useState(0)
    const chartProductOptions = {
        series: [38, 40, 25,10,15],
        options: {
        chart: {
            type: 'donut',
        },
        labels: ['Series 1', 'Series 2', 'Series 3','Series 4', 'Series 5'],
        // colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
        },
    }
    const chartEquityOptions = {
        series: [38, 40, 25],
        options: {
        chart: {
            type: 'donut',
        },
        labels: ['Series 1', 'Series 2', 'Series 3'],
        // colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
        },
    }

  return(
    <div className='d-flex gap-5 col-lg-12 col-md-12 col-sm-6'>
    <div className='col-lg-6 col-md-12 col-sm-12 card card-body'>
    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-1idn90j-MuiGrid-root">
    <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation9 MuiCard-root css-ydfexc-MuiPaper-root-MuiCard-root">
      <div className="MuiCardContent-root css-16iq3h-MuiCardContent-root">
        <div className="MuiStack-root css-1s09o1t-MuiStack-root">
          <div className="MuiBox-root css-0">
            <h5 className="MuiTypography-root MuiTypography-h5 css-76dl6-MuiTypography-root" style={{"color": "#2A3547",
    "fontWeight": "600"}}>Products</h5>
          </div>
        </div>
        <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-zow5z4-MuiGrid-root d-flex" style={{"justifyContent":"space-between"}}>
          <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-7 MuiGrid-grid-sm-7 css-uqwprf-MuiGrid-root">
            <h3 className="MuiTypography-root MuiTypography-h3 css-ai2yoq-MuiTypography-root">{productCount || '-'}</h3>
            <div className="MuiStack-root css-8pheja-MuiStack-root">
              <div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-fh2vss-MuiAvatar-root">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-up-left" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#39B69A" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <line x1="7" y1="7" x2="17" y2="17"></line>
                  <polyline points="16 7 7 7 7 16"></polyline>
                </svg>
              <span className="MuiTypography-root MuiTypography-subtitle2 css-o2z8bd-MuiTypography-root" style={{'marginRight':"10px"}}>+{' -'}</span>
              <span className="MuiTypography-root MuiTypography-subtitle2 css-u9bpq6-MuiTypography-root">last year</span>
              </div>

              {/* <h6 ></h6> */}
            </div>
            
          </div>
          <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-5 MuiGrid-grid-sm-5 css-k3f0g4-MuiGrid-root">
            {/* Donut Chart Code Goes Here */}
            <ApexCharts
            options={chartProductOptions.options}
            series={chartProductOptions.series}
            type={chartProductOptions.options.chart.type}
            height="150"
            width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
    <div className='col-lg-6 col-md-12 col-sm-12 card card-body'>
    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-1idn90j-MuiGrid-root">
    <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation9 MuiCard-root css-ydfexc-MuiPaper-root-MuiCard-root">
      <div className="MuiCardContent-root css-16iq3h-MuiCardContent-root">
        <div className="MuiStack-root css-1s09o1t-MuiStack-root">
          <div className="MuiBox-root css-0">
            <h5 className="MuiTypography-root MuiTypography-h5 css-76dl6-MuiTypography-root" style={{"color": "#2A3547",
    "fontWeight": "600"}}>Equity</h5>
          </div>
        </div>
        <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3 css-zow5z4-MuiGrid-root d-flex" style={{"justifyContent":"space-between"}}>
          <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-7 MuiGrid-grid-sm-7 css-uqwprf-MuiGrid-root">
            <h3 className="MuiTypography-root MuiTypography-h3 css-ai2yoq-MuiTypography-root">-</h3>
            <div className="MuiStack-root css-8pheja-MuiStack-root">
              <div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-fh2vss-MuiAvatar-root">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-up-left" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#39B69A" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <line x1="7" y1="7" x2="17" y2="17"></line>
                  <polyline points="16 7 7 7 7 16"></polyline>
                </svg>
              <span className="MuiTypography-root MuiTypography-subtitle2 css-o2z8bd-MuiTypography-root" style={{'marginRight':"10px"}}>+0%</span>
              <span className="MuiTypography-root MuiTypography-subtitle2 css-u9bpq6-MuiTypography-root">last year</span>
              </div>

              {/* <h6 ></h6> */}
            </div>
            
          </div>
          <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-5 MuiGrid-grid-sm-5 css-k3f0g4-MuiGrid-root">
            {/* Donut Chart Code Goes Here */}
            <ApexCharts
            options={chartEquityOptions.options}
            series={chartEquityOptions.series}
            type={chartEquityOptions.options.chart.type}
            height="150"
            width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>

    </div>
  )
}

export default Dashboard


// import React from 'react'

// function Dashboard() {
//   return (
//     <>
//     <div className="row">
              
//               <div className="col-lg-12">
//                 <div className="row">
//                   <div className="col-lg-12 col-md-6">
//                     <div className="card">
//                       <div className="card-body">
//                         <div className="row align-items-center">
//                           <div className="col-8">
//                             <h5 className="card-title mb-9 fw-semibold">
//                               Yearly Breakup
//                             </h5>
//                             <h4 className="fw-semibold mb-3">$36,358</h4>
//                             <div className="d-flex align-items-center mb-3">
//                               <span className="me-1 rounded-circle bg-success-subtle round-20 d-flex align-items-center justify-content-center">
//                                 <i className="ti ti-arrow-up-left text-success"></i>
//                               </span>
//                               <p className="text-dark me-1 fs-3 mb-0">+9%</p>
//                               <p className="fs-3 mb-0">last year</p>
//                             </div>
//                             <div className="d-flex align-items-center">
//                               <div className="me-4">
//                                 <span className="round-8 text-bg-primary rounded-circle me-2 d-inline-block"></span>
//                                 <span className="fs-2">2023</span>
//                               </div>
//                               <div>
//                                 <span className="round-8 bg-primary-subtle rounded-circle me-2 d-inline-block"></span>
//                                 <span className="fs-2">2023</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-4">
//                             <div className="d-flex justify-content-center">
//                               <div id="breakup" style={{"minHeight": "128.7px"}}><div id="apexchartsc7yri619g" className="apexcharts-canvas apexchartsc7yri619g apexcharts-theme-light" style={{"width": "180px", "height": "128.7px"}}>
//                                 <svg id="SvgjsSvg2744" width="180" height="128.7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" className="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style={{"background": "transparent"}}><foreignObject x="0" y="0" width="180" height="128.7"><div className="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG2746" className="apexcharts-inner apexcharts-graphical" transform="translate(28, 0)"><defs id="SvgjsDefs2745"><clipPath id="gridRectMaskc7yri619g"><rect id="SvgjsRect2747" width="132" height="160" x="-4" y="-6" rx="0" ry="0" opacity="1" strokeWidth="0" stroke="none" strokeDasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskc7yri619g"></clipPath><clipPath id="nonForecastMaskc7yri619g"></clipPath><clipPath id="gridRectMarkerMaskc7yri619g"><rect id="SvgjsRect2748" width="130" height="152" x="-2" y="-2" rx="0" ry="0" opacity="1" strokeWidth="0" stroke="none" strokeDasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG2749" className="apexcharts-pie"><g id="SvgjsG2750" transform="translate(0, 0) scale(1)"><circle id="SvgjsCircle2751" r="41.59756097560976" cx="63" cy="63" fill="transparent"></circle><g id="SvgjsG2752" className="apexcharts-slices"><g id="SvgjsG2753" className="apexcharts-series apexcharts-pie-series" seriesname="2022" rel="1" data:realindex="0"><path id="SvgjsPath2754" d="M 63 7.536585365853654 A 55.463414634146346 55.463414634146346 0 0 1 103.6849453198706 100.69516662913668 L 93.51370898990294 91.27137497185251 A 41.59756097560976 41.59756097560976 0 0 0 63 21.40243902439024 L 63 7.536585365853654 z" fill="var(--bs-primary)" fillOpacity="1" strokeOpacity="1" strokeLinecap="butt" strokeWidth="0" strokeDasharray="0" className="apexcharts-pie-area apexcharts-donut-slice-0" index="0" j="0" data:angle="132.81553398058253" data:startangle="0" data:strokewidth="0" data:value="38" data:pathorig="M 63 7.536585365853654 A 55.463414634146346 55.463414634146346 0 0 1 103.6849453198706 100.69516662913668 L 93.51370898990294 91.27137497185251 A 41.59756097560976 41.59756097560976 0 0 0 63 21.40243902439024 L 63 7.536585365853654 z"></path></g><g id="SvgjsG2755" className="apexcharts-series apexcharts-pie-series" seriesname="2021" rel="2" data:realindex="1"><path id="SvgjsPath2756" d="M 103.6849453198706 100.69516662913668 A 55.463414634146346 55.463414634146346 0 0 1 7.594622861729029 60.463359102040855 L 21.445967146296773 61.097519326530644 A 41.59756097560976 41.59756097560976 0 0 0 93.51370898990294 91.27137497185251 L 103.6849453198706 100.69516662913668 z" fill="rgba(236,242,255,1)" fillOpacity="1" strokeOpacity="1" strokeLinecap="butt" strokeWidth="0" strokeDasharray="0" className="apexcharts-pie-area apexcharts-donut-slice-1" index="0" j="1" data:angle="139.8058252427184" data:startangle="132.81553398058253" data:strokewidth="0" data:value="40" data:pathorig="M 103.6849453198706 100.69516662913668 A 55.463414634146346 55.463414634146346 0 0 1 7.594622861729029 60.463359102040855 L 21.445967146296773 61.097519326530644 A 41.59756097560976 41.59756097560976 0 0 0 93.51370898990294 91.27137497185251 L 103.6849453198706 100.69516662913668 z"></path></g><g id="SvgjsG2757" className="apexcharts-series apexcharts-pie-series" seriesname="2020" rel="3" data:realindex="2"><path id="SvgjsPath2758" d="M 7.594622861729029 60.463359102040855 A 55.463414634146346 55.463414634146346 0 0 1 62.99031980805149 7.536586210609762 L 62.99273985603862 21.402439657957324 A 41.59756097560976 41.59756097560976 0 0 0 21.445967146296773 61.097519326530644 L 7.594622861729029 60.463359102040855 z" fill="var(--bs-card-bg)" fillOpacity="1" strokeOpacity="1" strokeLinecap="butt" strokeWidth="0" strokeDasharray="0" className="apexcharts-pie-area apexcharts-donut-slice-2" index="0" j="2" data:angle="87.37864077669906" data:startangle="272.62135922330094" data:strokewidth="0" data:value="25" data:pathorig="M 7.594622861729029 60.463359102040855 A 55.463414634146346 55.463414634146346 0 0 1 62.99031980805149 7.536586210609762 L 62.99273985603862 21.402439657957324 A 41.59756097560976 41.59756097560976 0 0 0 21.445967146296773 61.097519326530644 L 7.594622861729029 60.463359102040855 z"></path></g></g></g></g><line id="SvgjsLine2759" x1="0" y1="0" x2="126" y2="0" stroke="#b6b6b6" strokeDasharray="0" strokeWidth="1" strokeLinecap="butt" className="apexcharts-ycrosshairs"></line><line id="SvgjsLine2760" x1="0" y1="0" x2="126" y2="0" strokeDasharray="0" strokeWidth="0" strokeLinecap="butt" className="apexcharts-ycrosshairs-hidden"></line></g>
//                                 </svg>
//                                 <div className="apexcharts-tooltip apexcharts-theme-dark" style={{"left": "90.7125px", "top": "-15.05px"}}><div className="apexcharts-tooltip-series-group apexcharts-active" style={{"order": "1", "display": "flex"}}><span className="apexcharts-tooltip-marker" style={{"backgroundColor": "var(--bs-primary)"}}></span><div className="apexcharts-tooltip-text" style={{"fontSize": "12px"}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label">2022: </span><span className="apexcharts-tooltip-text-y-value">38</span></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label"></span><span className="apexcharts-tooltip-text-goals-value"></span></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label"></span><span className="apexcharts-tooltip-text-z-value"></span></div></div></div><div className="apexcharts-tooltip-series-group" style={{"order": "2", "display": "none"}}><span className="apexcharts-tooltip-marker" style={{"backgroundColor": "var(--bs-primary)"}}></span><div className="apexcharts-tooltip-text" style={{"fontSize": "12px"}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label">2022: </span><span className="apexcharts-tooltip-text-y-value">38</span></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label"></span><span className="apexcharts-tooltip-text-goals-value"></span></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label"></span><span className="apexcharts-tooltip-text-z-value"></span></div></div></div><div className="apexcharts-tooltip-series-group" style={{"order": "3", "display": "none"}}><span className="apexcharts-tooltip-marker" style={{"backgroundColor": "var(--bs-primary)"}}></span><div className="apexcharts-tooltip-text" style={{"fontSize": "12px"}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label">2022: </span><span className="apexcharts-tooltip-text-y-value">38</span></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label"></span><span className="apexcharts-tooltip-text-goals-value"></span></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label"></span><span className="apexcharts-tooltip-text-z-value"></span></div></div></div></div></div></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-lg-12 col-md-6">
//                     <div className="card">
//                       <div className="card-body">
//                         <div className="row align-items-start">
//                           <div className="col-8">
//                             <h5 className="card-title mb-9 fw-semibold">
//                               Monthly Earnings
//                             </h5>
//                             <h4 className="fw-semibold mb-3">$6,820</h4>
//                             <div className="d-flex align-items-center pb-1">
//                               <span className="me-2 rounded-circle bg-danger-subtle round-20 d-flex align-items-center justify-content-center">
//                                 <i className="ti ti-arrow-down-right text-danger"></i>
//                               </span>
//                               <p className="text-dark me-1 fs-3 mb-0">+9%</p>
//                               <p className="fs-3 mb-0">last year</p>
//                             </div>
//                           </div>
//                           <div className="col-4">
//                             <div className="d-flex justify-content-end">
//                               <div className="text-white text-bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
//                                 <i className="ti ti-currency-dollar fs-6"></i>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div id="earning" style={{"minHeight": "60px"}}><div id="apexchartssparkline3" className="apexcharts-canvas apexchartssparkline3 apexcharts-theme-light" style={{"width": "1152px", "height": "60px"}}><svg id="SvgjsSvg2762" width="1152" height="60" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" className="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style={{"background": "transparent"}}><foreignObject x="0" y="0" width="1152" height="60"><div className="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml" style={{"maxHeight": "30px"}}></div></foreignObject><rect id="SvgjsRect2766" width="0" height="0" x="0" y="0" rx="0" ry="0" opacity="1" strokeWidth="0" stroke="none" strokeDasharray="0" fill="#fefefe"></rect><g id="SvgjsG2805" className="apexcharts-yaxis" rel="0" transform="translate(-18, 0)"></g><g id="SvgjsG2764" className="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)"><defs id="SvgjsDefs2763"><clipPath id="gridRectMask8zyyr67v"><rect id="SvgjsRect2768" width="1158" height="70" x="-4" y="-6" rx="0" ry="0" opacity="1" strokeWidth="0" stroke="none" strokeDasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask8zyyr67v"></clipPath><clipPath id="nonForecastMask8zyyr67v"></clipPath><clipPath id="gridRectMarkerMask8zyyr67v"><rect id="SvgjsRect2769" width="1156" height="62" x="-2" y="-2" rx="0" ry="0" opacity="1" strokeWidth="0" stroke="none" strokeDasharray="0" fill="#fff"></rect></clipPath><linearGradient id="SvgjsLinearGradient2774" x1="0" y1="0" x2="0" y2="1"><stop id="SvgjsStop2775" stopOpacity="0.15" stopColor="var(--bs-secondary)" offset="0.2"></stop><stop id="SvgjsStop2776" stopOpacity="0" stopColor="" offset="1.8"></stop><stop id="SvgjsStop2777" stopOpacity="0" stopColor="" offset="1"></stop></linearGradient></defs><line id="SvgjsLine2767" x1="0" y1="0" x2="0" y2="58" stroke="#b6b6b6" strokeDasharray="3" strokeLinecap="butt" className="apexcharts-xcrosshairs" x="0" y="0" width="1" height="58" fill="#b1b9c4" filter="none" fillOpacity="0.9" strokeWidth="1"></line><g id="SvgjsG2780" className="apexcharts-grid"><g id="SvgjsG2781" className="apexcharts-gridlines-horizontal" style={{"display": "none"}}><line id="SvgjsLine2784" x1="0" y1="0" x2="1152" y2="0" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2785" x1="0" y1="8.285714285714286" x2="1152" y2="8.285714285714286" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2786" x1="0" y1="16.571428571428573" x2="1152" y2="16.571428571428573" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2787" x1="0" y1="24.85714285714286" x2="1152" y2="24.85714285714286" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2788" x1="0" y1="33.142857142857146" x2="1152" y2="33.142857142857146" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2789" x1="0" y1="41.42857142857143" x2="1152" y2="41.42857142857143" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2790" x1="0" y1="49.714285714285715" x2="1152" y2="49.714285714285715" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line><line id="SvgjsLine2791" x1="0" y1="58" x2="1152" y2="58" stroke="#e0e0e0" strokeDasharray="0" strokeLinecap="butt" className="apexcharts-gridline"></line></g><g id="SvgjsG2782" className="apexcharts-gridlines-vertical" style={{"display": "none"}}></g><line id="SvgjsLine2793" x1="0" y1="58" x2="1152" y2="58" stroke="transparent" strokeDasharray="0" strokeLinecap="butt"></line><line id="SvgjsLine2792" x1="0" y1="1" x2="0" y2="58" stroke="transparent" strokeDasharray="0" strokeLinecap="butt"></line></g><g id="SvgjsG2783" className="apexcharts-grid-borders" style={{"display": "none"}}></g><g id="SvgjsG2770" className="apexcharts-area-series apexcharts-plot-series"><g id="SvgjsG2771" className="apexcharts-series" zindex="0" seriesname="Earnings" data:longestseries="true" rel="1" data:realindex="0"><path id="SvgjsPath2778" d="M 0 58 L 0 37.285714285714285C31.02862332595932, 31.795679593070588, 128.00744846692965, 2.623889883013744, 192, 3.3142857142857096S320.2007980083411, 37.84936024540843, 384, 41.42857142857143S512.0190646140376, 23.752710043932787, 576, 24.857142857142854S704.0963979519893, 50.53911311525756, 768, 48.05714285714286S896.0190646140376, 11.047289956067209, 960, 9.942857142857143S1120.8380111756883, 36.31837623744173, 1152, 41.42857142857143 L 1152 58 L 0 58M 0 37.285714285714285z" fill="url(#SvgjsLinearGradient2774)" fillOpacity="1" strokeOpacity="1" strokeLinecap="butt" strokeWidth="0" strokeDasharray="0" className="apexcharts-area" index="0" clipPath="url(#gridRectMask8zyyr67v)" pathto="M 0 58 L 0 37.285714285714285C31.02862332595932, 31.795679593070588, 128.00744846692965, 2.623889883013744, 192, 3.3142857142857096S320.2007980083411, 37.84936024540843, 384, 41.42857142857143S512.0190646140376, 23.752710043932787, 576, 24.857142857142854S704.0963979519893, 50.53911311525756, 768, 48.05714285714286S896.0190646140376, 11.047289956067209, 960, 9.942857142857143S1120.8380111756883, 36.31837623744173, 1152, 41.42857142857143 L 1152 58 L 0 58M 0 37.285714285714285z" pathfrom="M -1 58 L -1 58 L 192 58 L 384 58 L 576 58 L 768 58 L 960 58 L 1152 58"></path><path id="SvgjsPath2779" d="M 0 37.285714285714285C31.02862332595932, 31.795679593070588, 128.00744846692965, 2.623889883013744, 192, 3.3142857142857096S320.2007980083411, 37.84936024540843, 384, 41.42857142857143S512.0190646140376, 23.752710043932787, 576, 24.857142857142854S704.0963979519893, 50.53911311525756, 768, 48.05714285714286S896.0190646140376, 11.047289956067209, 960, 9.942857142857143S1120.8380111756883, 36.31837623744173, 1152, 41.42857142857143" fill="none" fillOpacity="1" stroke="var(--bs-secondary)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="2" strokeDasharray="0" className="apexcharts-area" index="0" clipPath="url(#gridRectMask8zyyr67v)" pathto="M 0 37.285714285714285C31.02862332595932, 31.795679593070588, 128.00744846692965, 2.623889883013744, 192, 3.3142857142857096S320.2007980083411, 37.84936024540843, 384, 41.42857142857143S512.0190646140376, 23.752710043932787, 576, 24.857142857142854S704.0963979519893, 50.53911311525756, 768, 48.05714285714286S896.0190646140376, 11.047289956067209, 960, 9.942857142857143S1120.8380111756883, 36.31837623744173, 1152, 41.42857142857143" pathfrom="M -1 58 L -1 58 L 192 58 L 384 58 L 576 58 L 768 58 L 960 58 L 1152 58" fillRule="evenodd"></path><g id="SvgjsG2772" className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown" data:realindex="0"><g className="apexcharts-series-markers"><circle id="SvgjsCircle2809" r="0" cx="0" cy="0" className="apexcharts-marker w5v4gl0ya no-pointer-events" stroke="#ffffff" fill="var(--bs-secondary)" fillOpacity="1" strokeWidth="2" strokeOpacity="0.9" default-marker-size="0"></circle></g></g></g><g id="SvgjsG2773" className="apexcharts-datalabels" data:realindex="0"></g></g><line id="SvgjsLine2794" x1="0" y1="0" x2="1152" y2="0" stroke="#b6b6b6" strokeDasharray="0" strokeWidth="1" strokeLinecap="butt" className="apexcharts-ycrosshairs"></line><line id="SvgjsLine2795" x1="0" y1="0" x2="1152" y2="0" strokeDasharray="0" strokeWidth="0" strokeLinecap="butt" className="apexcharts-ycrosshairs-hidden"></line><g id="SvgjsG2796" className="apexcharts-xaxis" transform="translate(0, 0)"><g id="SvgjsG2797" className="apexcharts-xaxis-texts-g" transform="translate(0, -4)"></g></g><g id="SvgjsG2806" className="apexcharts-yaxis-annotations"></g><g id="SvgjsG2807" className="apexcharts-xaxis-annotations"></g><g id="SvgjsG2808" className="apexcharts-point-annotations"></g></g></svg><div className="apexcharts-tooltip apexcharts-theme-dark"><div className="apexcharts-tooltip-series-group" style={{"order": "1"}}><span className="apexcharts-tooltip-marker" style={{"backgroundColor": "var(--bs-secondary)"}}></span><div className="apexcharts-tooltip-text" style={{"fontSize": "12px"}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label"></span><span className="apexcharts-tooltip-text-y-value"></span></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label"></span><span className="apexcharts-tooltip-text-goals-value"></span></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label"></span><span className="apexcharts-tooltip-text-z-value"></span></div></div></div></div><div className="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-dark"><div className="apexcharts-yaxistooltip-text"></div></div></div></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//     </>
//   )
// }

// export default Dashboard