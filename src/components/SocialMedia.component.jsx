import { LinkedIn, GitHub, Instagram } from '@material-ui/icons';
import styled from 'styled-components';

const LinkedinURL = "https://www.linkedin.com/in/brunomont/"
// const InstagramURL = "https://www.instagram.com/"
const GithubURL = "https://github.com/brunomaletta"

const Wrapper = styled.div`
    padding: 25px 0px 10px 0px;
    > a {
        padding: 0 12px;
        color: #8d8d8d; 
        text-decoration: inherit;
        :hover {
            color: #000000;
        }
    }
`;

function SocialMediaComponent() {
    return (
        <Wrapper>
            <a href={LinkedinURL}><LinkedIn /></a>
            <a href={GithubURL}><GitHub /></a>
            {/*<a href={InstagramURL}><Instagram /></a>*/}
        </Wrapper>
    );
}

export default SocialMediaComponent;
