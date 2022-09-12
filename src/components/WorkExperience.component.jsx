import { Typography, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { Work } from '@material-ui/icons';
import styled from 'styled-components';

const WorkExp = styled.div`
    text-align: justify;
    font-weight: 300;
`;
  

function WorkComponent() {
    return (
        <WorkExp>
            <Typography variant="h6" component="h3">Work Experience</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <Work/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Software Engineer [August 2022 - Currently]"
                    secondary='Google'
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Work/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Strategist Intern [May 2021 - August 2021]"
                    secondary='Goldman Sachs'
                  />
                </ListItem>
            </List>
        </WorkExp>
    );
}

export default WorkComponent;
