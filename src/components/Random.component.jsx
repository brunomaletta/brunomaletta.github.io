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
            <Typography variant="h6" component="h3">Random facts about me</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Best half marathon time: 1:49:40"
                    secondary="At Maratona do Rio 2022"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Best Rubik's Cube solve time: 10.65 s"
                    secondary="Best AVG5: 13.45"
                  />
                </ListItem>
            </List>
        </Random>
    );
}

export default RandomComponent;
