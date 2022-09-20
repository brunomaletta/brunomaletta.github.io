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
                <ListItem button component="a" href="https://homepages.dcc.ufmg.br/~monteirobruno/codando.jpg">
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Started coding at the age of 6 months"
                    secondary="Click for source"
                  />
                </ListItem>
                <ListItem button component="a" href="https://www.strava.com/activities/7328331547">
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Best half marathon time: 1:49:38"
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
                <ListItem>
                  <ListItemIcon>
                    <ArrowForwardIos/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Longest time holding my breath: 3 min 4 s"
                    secondary="Underwater"
                  />
                </ListItem>
            </List>
        </Random>
    );
}

export default RandomComponent;
