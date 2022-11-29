import { useState, useEffect } from 'react';
import styled from 'styled-components'
import 'react-virtualized/styles.css';
import externalAPI from '../io/externalAPI';
import TitleInterface from './TitleInterface';
import TableComponent from './TableComponent';


const PivotTable = () => {
    const [originalKeys, setOriginalKeys] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [transformedKeys, setTransformedKeys] = useState([]);
    const [transformedData, setTransformedData] = useState([]);
    const [sortDirection, setSortDirection] = useState(true);
    const [persistBreadCrumb, setPersistBreadCrumb] = useState(false);
    const [pivotTerm, setPivotTerm] = useState("");
    const [summable, setSummable] = useState("");
    const [tableStatus, setTableStatus] = useState("");
    const [breadCrumb, setBreadCrumb] = useState([{ label: `Original Data`, keys: originalKeys, pivotTerm: "", summable: "" }]);

    useEffect(() => {
        initialState();
    }, []);

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("breadCrumb"));
        if (storage && storage.length > 0) {
            setBreadCrumb(storage);
            fromHistory(storage.length-1);
        } else if (originalData.length > 0) {
            const kys = Object.keys(originalData[0]);
            setTableStatus(breadCrumb[breadCrumb.length - 1].label);
            setTransformedData(originalData);
            setTransformedKeys(kys);
        }
    }, [originalData]);

    const initialState = () => {
        const ioData = externalAPI().map(x => x.result);
        const initialKeys = Object.keys(ioData[0]);
        setOriginalData(ioData);
        setOriginalKeys(initialKeys);
        setTransformedKeys(initialKeys);
        setTransformedData(ioData);
    }

    const pushHistory = ({ pivotTerm, summable, filterTerm }) => {
        const label = filterTerm ? `${filterTerm.key} -> ${filterTerm.value}` : `${pivotTerm}-${summable}`;
        const memory = { label, keys: transformedKeys, pivotTerm, summable, filterTerm };
        const newCrumbs = breadCrumb.concat(memory);
        localStorage.setItem('breadCrumb', JSON.stringify(newCrumbs));
        setTableStatus(label)
        setBreadCrumb(newCrumbs);
    }

    const fromHistory = (index) => {
        const memories = JSON.parse(localStorage.getItem("breadCrumb"));
        const memory = memories[index];
        setTableStatus(memory.label);
        if (!persistBreadCrumb) {
            const newMemories = memories.slice(0, index + 1)
            localStorage.setItem('breadCrumb', JSON.stringify(newMemories));
            setBreadCrumb(newMemories);
        }
        if (index === 0) {
            setTransformedKeys(originalKeys);
            setTransformedData(originalData);
        } else if (memory && memory.filterTerm && memory.filterTerm.key.length > 0) {
            filterData(memory.filterTerm.key, memory.filterTerm.value, true);
        } else if (memory && memory.pivotTerm && memory.summable) {
            transformData({ pivotTerm: memory.pivotTerm, summable: memory.summable, fromMemory: true });
        }
    }

    const transformData = ({ pivotTerm, summable, fromMemory }) => {
        if (pivotTerm && summable) {
            const uniqeValuesArray = Array.from(new Set(originalData.map(x => x[pivotTerm])));
            const dataCopy = originalData.slice();
            const result = uniqeValuesArray.map(uniqueValue => {
                let totaling = 0;
                let count = 0;
                const remove = [];
                dataCopy.forEach((dataItem, i) => {
                    if (dataItem[pivotTerm] === uniqueValue) {
                        totaling += Number(dataItem[summable]);
                        remove.unshift(i);
                        count++;
                    }
                })
                remove.forEach(x => dataCopy.splice(x, 1));
                return { [pivotTerm]: uniqueValue, count, [summable]: totaling };
            })
            setTransformedKeys([pivotTerm, summable, "count"]);
            setPivotTerm(pivotTerm);
            setSummable(summable);
            setTransformedData(result);
            if (!fromMemory) pushHistory({ pivotTerm, summable });
        }
    }

    const pivot = () => {
        const lastThought = JSON.parse(localStorage.getItem("breadCrumb")).pop();
        if (!pivotTerm || !summable || pivotTerm.length === 0 || summable.length === 0) {
            alert("Please select both a Pivot Field and Sum Field from the dropdowns");
        } else if (lastThought.pivotTerm !== pivotTerm || lastThought.summable !== summable) {
            transformData({ pivotTerm, summable });
        }
    };

    const sort = (data, val, dir = null) => {
        return (dir || sortDirection)
            ? data.sort(function (a, b) { return parseInt(a[val]) - parseInt(b[val]) })
            : data.sort(function (a, b) { return parseInt(b[val]) - parseInt(a[val]) });
    }

    const sortTable = (val) => {
        if (val && val.dataKey) {
            val = val.dataKey;
            setSortDirection(!sortDirection);
            setTransformedData(sort(transformedData, val));
        }
    };

    const filterData = (key, value, fromHistory) => {
        const filteredData = originalData.filter(x => x[key] === value);
        const newKeys = originalKeys.filter(x => x !== key);
        newKeys.unshift(key);
        setTransformedKeys(newKeys);
        setTransformedData(filteredData);
        if (!fromHistory) pushHistory({ filterTerm: { key, value } });
    }

    const itemClicked = (e) => {
        const valueClicked = e.event.target.title;
        if (valueClicked && Object.values(e.rowData).indexOf(valueClicked) !== -1) {
            const fieldKey = Object.keys(e.rowData)[Object.values(e.rowData).indexOf(valueClicked)];
            filterData(fieldKey, valueClicked);
        }
    }

    return (
        <PageContainer>
            <TitleInterface
                title="Simple PivotTable"
                originalKeys={originalKeys}
                status={tableStatus}
                sample={originalData[0]}
                persistBreadCrumb={persistBreadCrumb}
                pivotTableFuncs={{ pivot, reset: fromHistory, setSummable, setPivotTerm, setPersistBreadCrumb }} />
            <Status>
                {breadCrumb.length > 0 && breadCrumb.map((x, i) => <span key={i}><Link onClick={() => fromHistory(i)} >{x.label}</Link> / </span>)}
            </Status>
            <TableComponent transformedData={transformedData} transformedKeys={transformedKeys} sortTable={sortTable} itemClicked={itemClicked} />
        </PageContainer>
    );
};

export default PivotTable;

const Link = styled.a`
    text-decoration: underline;
`
const Status = styled.div`
    height: 40px;
    color: white;
    padding-left: 50px 
`
const PageContainer = styled.div`
    height: 100vh;
    background-color: #bbbb44;
    background-color: white;
    background-image: linear-gradient(#00b4ff, white);
`
