import styled from 'styled-components';

const Footer = styled.footer`
    text-align: center;
    margin-top: 10px;
    padding: 25px;
    font-weight: 300;
`;

function FooterSection() {
    return (	
        <Footer>
            Bruno Monteiro &nbsp;•&nbsp;2022 <br/>
            <small>Theme inspired by <a href="https://thais-damasio.github.io/">this</a> project</small>
        </Footer>
    );
}

export default FooterSection;
