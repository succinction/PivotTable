import { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import externalAPI from '../io/externalAPI';
import TitleInterface from './TitleInterface';


const PivotTable = () => {
    const [sortTerm, setSortTerm] = useState("");
    const [pivotTerm, setPivotTerm] = useState("");
    const [transformedData, setTransformedData] = useState([]);
    const [transformedKeys, setTransformedKeys] = useState(new Set());
    const [originalKeys, setOriginalKeys] = useState(new Set());
    const [originalData, setOriginalData] = useState([]);
    const [sortDirection, setSortDirection] = useState(true);
    const [sumable, setSumable] = useState("");

    useEffect(() => {
        const ioData = externalAPI().map(x => x.result);
        const originalKeys = new Set(Object.keys(ioData[0]));
        setOriginalData(ioData);
        setTransformedData(ioData);
        setOriginalKeys(originalKeys);
        setTransformedKeys(originalKeys);
    }, []);

    const transformData = (pivotTerm, sumable) => {
        if (pivotTerm && sumable) {
            const uniqueValuesSet = new Set(originalData.map(x => x[pivotTerm]));
            const uniqeValuesArray = Array.from(uniqueValuesSet);
            const dataCopy = originalData.slice();
            const result = uniqeValuesArray.map(uniqueValue => {
                let totaling = 0;
                let count = 0;
                dataCopy.forEach((dataItem, i) => {
                    if (dataItem[pivotTerm] === uniqueValue) {
                        totaling += Number(dataItem[sumable]);
                        dataCopy.splice(i, 1);
                        count++;
                    }
                })
                return { [pivotTerm]: uniqueValue, count, [sumable]: totaling };
            })
            setTransformedKeys([pivotTerm, "count", sumable]);
            setTransformedData(result);
        } else {
            alert("Please select both a Pivot field and Sum field from the dropdowns");
        }
    }

    const pivot = () => {
        transformData(pivotTerm, sumable)
    };

    const sort = (val) => {
        setSortTerm(val)
        setSortDirection(!sortDirection)
        const sortedData = (sortDirection)
            ? transformedData.sort(function (a, b) { return parseInt(a[val]) - parseInt(b[val]) })
            : transformedData.sort(function (a, b) { return parseInt(b[val]) - parseInt(a[val]) })
        setTransformedData(sortedData)
    };

    return (
        <PageContainer>
            <TitleInterface title="Simple PivotTable" originalKeys={originalKeys} status={sortTerm + sumable} transformedKeys={transformedKeys} pivotTableFuncs={{ pivot, sort, setSumable, setPivotTerm, setTransformedKeys }} />
            <TableContainer >
                <Table
                    headerHeight={20}
                    height={Math.round(window.innerHeight * .9) - 120}
                    width={Math.round(window.innerWidth * .9)}
                    rowHeight={30}
                    rowGetter={({ index }) => transformedData[index]}
                    rowCount={transformedData.length}
                    onHeaderClick={(x) => sort(x.dataKey)}
                    onColumnClick={(x) => sort(x.dataKey)}
                >
                    {transformedKeys && Array.from(transformedKeys).map(key => <Column key={key} label={key} dataKey={key} width={400} />)}
                </Table>
            </TableContainer>
        </PageContainer>
    );
};

export default PivotTable;

const PageContainer = styled.div`
    height: 100vh;
    background-color: #234567;
    background-image:  linear-gradient(30deg, #8d8e9d 12%, transparent 12.5%, transparent 87%, #8d8e9d 87.5%, #8d8e9d), linear-gradient(150deg, #8d8e9d 12%, transparent 12.5%, transparent 87%, #8d8e9d 87.5%, #8d8e9d), linear-gradient(30deg, #8d8e9d 12%, transparent 12.5%, transparent 87%, #8d8e9d 87.5%, #8d8e9d), linear-gradient(150deg, #8d8e9d 12%, transparent 12.5%, transparent 87%, #8d8e9d 87.5%, #8d8e9d), linear-gradient(60deg, #8d8e9d77 25%, transparent 25.5%, transparent 75%, #8d8e9d77 75%, #8d8e9d77), linear-gradient(60deg, #8d8e9d77 25%, transparent 25.5%, transparent 75%, #8d8e9d77 75%, #8d8e9d77);
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
`
const TableContainer = styled.div`
    width: 90vw;
    height: 80vh;
    padding-left: 50px;
    .ReactVirtualized__Table {
        border-radius: 15px;
        background-color: black;
        color: red;
        box-shadow: 1px 7px 16px black;
    }
`