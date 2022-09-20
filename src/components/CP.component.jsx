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
                <ListItem button component="a" href="http://maratona.sbc.org.br/hist/2021/resultados21/reports/brbr/score.html">
                  <ListItemIcon>
                    <Keyboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="ICPC 2022 [2021 - 2022]"
                    secondary="Gold Medal - 2nd at Brazilian Finals, classifying to the World Finals in Egypt"
                  />
                </ListItem>
                <ListItem button component="a" href="https://maratona.algartelecom.com.br/portal/wp-content/uploads/2022/05/4-Mineira2022_Maratona_Mineira_Placar_Final.pdf">
                  <ListItemIcon>
                    <Keyboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="IX Maratona Mineira de Programação [May 2022]"
                    secondary="Gold Medal - 1st out of 51 teams"
                  />
                </ListItem>
                <ListItem button component="a" href="https://maratona.ime.usp.br/resultados19/reports/scoreBrasil.html">
                  <ListItemIcon>
                    <Keyboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="ICPC 2020 [2019 - 2021]"
                    secondary="Silver Medal - 5th at Brazilian Finals, classifying to the World Finals in Moscow"
                  />
                </ListItem>
            </List>
        </CP>
    );
}

export default CPComponent;
