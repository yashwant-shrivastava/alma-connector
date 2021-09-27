import React from 'react';
import {MDBContainer, MDBNavbar, MDBNavbarBrand} from 'mdb-react-ui-kit';

const Navbar = ()  => {
    return (
        <MDBNavbar dark bgColor='dark'>
            <MDBContainer fluid>
                <MDBNavbarBrand tag="span" className='mb-0 h1'>Alma - Connector</MDBNavbarBrand>
            </MDBContainer>
        </MDBNavbar>
    );
}

export default Navbar;