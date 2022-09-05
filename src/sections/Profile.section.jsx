import AvatarComponent from '../components/Avatar.component';
import IntroComponent from '../components/Intro.component';
import styled from 'styled-components';
import SummaryComponent from '../components/Summary.component';
import EducationComponent from '../components/Education.component';
import WorkComponent from '../components/WorkExperience.component';
import TeachingComponent from '../components/Teaching.component';
import RandomComponent from '../components/Random.component';

const Description = styled.div`
    text-align: center;
    padding: 120px 0px 10px 0px;
`;

function ProfileSection() {
    return (
        <>
            <AvatarComponent />

            <Description>
                <IntroComponent/>

                <SummaryComponent/>

                <EducationComponent/>

                <WorkComponent/>

                <TeachingComponent/>

                <RandomComponent/>

            </Description>
        </>
    );
}

export default ProfileSection;
