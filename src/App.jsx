// import './App.css';
import { Container, Paper } from '@material-ui/core';
import HeaderComponent from './components/Header.component';
import Profile from './sections/Profile.section';
import Footer from './sections/Footer.section';
import styled from 'styled-components';

const PaperMain = styled(Paper)`
    margin: -100px 30px 0px;
    padding: 10px 5vw 10px 5vw;
    position: relative;
`;

function App() {
  return (
    <>
      <HeaderComponent />

      <Container disableGutters>
        <PaperMain elevation={3}>
          <Profile/>
        </PaperMain>
      </Container>
      
      <Footer/>
    </>
  );
}

export default App;