import { Typography, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { Computer } from '@material-ui/icons';
import styled from 'styled-components';

const Teaching = styled.div`
    text-align: justify;
    font-weight: 300;
`;
  

function TeachingComponent() {
    return (
        <Teaching>
            <Typography variant="h6" component="h3">Teaching</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <Computer/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Advanced Algorithms [August 2022 - Currently]"
                    secondary="Federal University of Minas Gerais (UFMG)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Computer/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Semana Olímpica - Seletiva IOI 2022 [May 2022]"
                    secondary="UNICAMP"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Computer/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Samsung Software Development Training [December 2021 - February 2022]"
                    secondary="Remote"
                  />
                </ListItem>
            </List>
        </Teaching>
    );
}

export default TeachingComponent;
