import BackgroundPhoto from '../assets/background.jpg';
import styled from 'styled-components';

const HeaderComponent = styled.div`
    background-image: url(${BackgroundPhoto});
    transform: translate3d(0px, 0px, 0px);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 45vh;
`;

export default HeaderComponent;
