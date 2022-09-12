import { Typography, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { School } from '@material-ui/icons';
import styled from 'styled-components';

const Education = styled.div`
    text-align: justify;
    font-weight: 300;
`;
  

function EducationComponent() {
    return (
        <Education>
            <Typography variant="h6" component="h3">Education</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Master’s Degree in Computer Science [2021 - Currently]"
                    secondary='Federal University of Minas Gerais (UFMG) with the supervision of Vinicius Fernandes dos Santos'
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bachelor’s Degree in Computer Science [2017 - 2021]"
                    secondary='Federal University of Minas Gerais (UFMG)'
                  />
                </ListItem>
            </List>
        </Education>
    );
}

export default EducationComponent;
