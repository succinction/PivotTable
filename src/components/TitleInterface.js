import styled from 'styled-components'
import Select from 'react-select';


const TitleInterface = ({ pivotTableFuncs, originalKeys, title, sample, status, persistBreadCrumb }) => {
    return (
        <HeaderContainer>
            <StickyHeader>
                <Headline>
                    <Title>{title}</Title>
                    <Status>{status}</Status>
                </Headline>
                <Container>
                    <Highlight>Pivot Field</Highlight>
                    <Select onChange={x => pivotTableFuncs.setPivotTerm(x.value)} options={Array.from(originalKeys).map(x => ({ value: x, label: x }))} />
                </Container>
                <Container>
                    <Highlight>Sum Field</Highlight>
                    <Select onChange={x => pivotTableFuncs.setSummable(x.value)} options={Array.from(originalKeys).filter(x => isFinite(sample[x])).map(x => ({ value: x, label: x }))} />
                </Container>
                <Container>
                    <CreateButton onClick={() => pivotTableFuncs.pivot()}>CREATE</CreateButton>
                    <span> : </span>
                    <ResetButton onClick={() => pivotTableFuncs.reset(0)}>RESET</ResetButton>
                    <br />
                    <label>
                        <input type={"checkbox"} onChange={() => pivotTableFuncs.setPersistBreadCrumb(!persistBreadCrumb)} checked={persistBreadCrumb} />
                        Persist BreadCrumbs
                    </label>
                </Container>
            </StickyHeader>
        </HeaderContainer>
    )
}

export default TitleInterface;

const Title = styled.div`
    font-size: 16pt;
    font-weight: bold;
`
const Status = styled.div`
    font-size: 16pt;
    font-weight: bold;
    padding-top: 20px;
`
const HeaderContainer = styled.div`
    height: 100px;
    margin-bottom: 30px;
`
const StickyHeader = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    height: 100px;
    width: 99vw;
    z-index: 12;
    padding: 10px;
    box-shadow: -2px 10px 26px #000000cc;
    background-color: #efefef;
    background-image:  linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77), linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77);
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
`
const Headline = styled.div`
    flex-direction: column;
    padding-left: 50px;
    padding-right: 20px;
    // flex-grow: 2;
    width: 40vw;
    border-right: solid black;
    text-align: right;
`
const Highlight = styled.span`
    background-color: white;
    font-size: 14pt;
    font-weight: bold;
`
const CreateButton = styled.button`
    color: white;
    padding: 10px;
    background-color: #00b4ff;
    border-radius: 10px;
    border: solid white;
    font-weight: bold;
`
const ResetButton = styled.button`
    color: white;
    padding: 10px;
    background-color: black;
    border-radius: 10px;
    border: solid white;
    font-weight: bold;
`
const Container = styled.div`
    // flex-grow: 1;
    width: 20vw;
    padding: 20px;
`
