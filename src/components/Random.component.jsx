import { Typography, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import styled from 'styled-components';

const Random = styled.div`
    text-align: justify;
    font-weight: 300;
`;
  

function RandomComponent() {
    return (
        <Random>
            <Typography variant="h6" component="h3">Some facts about me</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Some fact"
                    // secondary='Federal University of Minas Gerais (UFMG)'
                  />
                </ListItem>
            </List>
        </Random>
    );
}

export default RandomComponent;
