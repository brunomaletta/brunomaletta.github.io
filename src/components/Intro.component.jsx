import SocialMedia from '../components/SocialMedia.component';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const IntroComponent = styled.div`
    color: #3a3a3a;
`;

function ProfileSection() {
    return (
        <IntroComponent>
            <Typography variant="h4" component="h1">Bruno Maletta</Typography>
            <Typography variant="h6" component="h2">MSc Student</Typography>

            <SocialMedia />
        </IntroComponent>
    );
}

export default ProfileSection;
