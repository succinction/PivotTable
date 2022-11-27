import styled from 'styled-components'
import Select from 'react-select';

const TitleInterface = ({ pivotTableFuncs, originalKeys, transformedKeys, title, status }) => {
    const handleFields = (event => {
        const checked = event.target.checked;
        const field = event.target.labels[0].innerText
        let newKeys
        if (checked) {
            newKeys = new Set(transformedKeys)
            newKeys.add(String(field))
        } else {
            newKeys = new Set(transformedKeys)
            newKeys.delete(String(field))
        }
        pivotTableFuncs.setTransformedKeys(newKeys)
    })

    return (
        <HeaderContainer>
            <StickyHeader>
                <Headline>
                    {title}
                    <div><span>{status}</span></div>
                    <button onClick={() => pivotTableFuncs.pivot()}>CREATE</button>
                </Headline>
                <FieldsControls>
                    <div>Fields</div>
                    {originalKeys && Array.from(originalKeys).map(x => (<Checkbox label={x} onChange={handleFields} />))}
                </FieldsControls>
                <div>
                    <div>Pivot Field</div>
                    <Select onChange={x => pivotTableFuncs.setPivotTerm(x.value)} options={Array.from(originalKeys).map(x => ({ value: x, label: x }))} />
                </div>
                <div>
                    <div>Sum Field</div>
                    <Select onChange={x => pivotTableFuncs.setSumable(x.value)} options={Array.from(originalKeys).map(x => ({ value: x, label: x }))} />
                </div>
            </StickyHeader>
        </HeaderContainer>
    )
}

const Checkbox = ({ label, onChange }) => {
    return (
        <label>
            <input type="checkbox" defaultChecked={true} onChange={onChange} />
            {label}
        </label>
    );
};

export default TitleInterface;

const HeaderContainer = styled.div`
    height: 100px;
    margin-bottom: 30px;
`
const StickyHeader = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    height: 90px;
    width: 99vw;
    z-index: 12;
    padding: 10px;
    box-shadow: 1px 7px 16px black;
    background-color: #efefef;
    opacity: 0.8;
    background-image:  linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77), linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77);
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
    div {
        flex-grow: 1;
        width: 24vh
    }
`
const Headline = styled.div`
    padding: 6px;
    span {
        color: yellowgreen;
    }
`
const FieldsControls = styled.div`
    display: flex;
    flex-direction: column
`

