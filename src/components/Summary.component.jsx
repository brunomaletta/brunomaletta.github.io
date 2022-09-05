import styled from 'styled-components';

const LattesURL = "http://lattes.cnpq.br/5329322971923209"
const PinterestURL = "https://br.pinterest.com/damasiothais/meus-desenhos/";
const ViniciusURL = "https://homepages.dcc.ufmg.br/~viniciussantos/";
const UFMGURL = "https://ufmg.br/";
const CompilersLabURL = "http://lac.dcc.ufmg.br/";

const Summary = styled.div`
    text-align: justify;
    font-weight: 300;
`;

function SummaryComponent() {
    return (
        <Summary>
            <p>
            Hi! I am a MsC student at <a href={UFMGURL}>UFMG</a> (Federal University of Minas Gerais) and a software engineer at Google.
            {/*A little bit about me:*/}
            </p>
            
            {/*<ul>
                <li></li>
                <li></li>
            </ul>*/}
        </Summary>
    );
}

export default SummaryComponent;
