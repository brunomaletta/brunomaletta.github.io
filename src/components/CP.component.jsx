import { Typography, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { Keyboard } from '@material-ui/icons';
import styled from 'styled-components';

const CP = styled.div`
    text-align: justify;
    font-weight: 300;
`;
  

function CPComponent() {
    return (
        <CP>
            <Typography variant="h6" component="h3">Competitive Programming</Typography>
            <List>
                <ListItem>
                  <ListItemIcon>
                    <Keyboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="IX Maratona Mineira de Programação [May 2022]"
                    secondary="Gold Medal - 1st out of 51 teams"
                  />
                </ListItem>
            </List>
        </CP>
    );
}

export default CPComponent;
