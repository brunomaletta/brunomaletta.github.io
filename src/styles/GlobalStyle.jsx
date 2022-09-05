import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        font-family: Montserrat,sans-serif;

        body {
            margin: 0;
        } 
        
        a {
            text-decoration: none;
            font-weight: 400;
            color: #0012af;
        }
    }
`;

export default GlobalStyle;