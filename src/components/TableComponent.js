import { Column, Table } from 'react-virtualized';
import styled from 'styled-components'

const TableComponent = ({ transformedData, transformedKeys, sortTable, itemClicked }) => <TableContainer >
    <Table
        headerHeight={38}
        height={Math.round(window.innerHeight * .9) - 120}
        width={Math.round(window.innerWidth * .9)}
        rowHeight={30}
        rowGetter={({ index }) => transformedData[index]}
        rowCount={transformedData.length}
        onHeaderClick={(x) => sortTable(x)}
        onRowClick={(x) => itemClicked(x)}
    >
        {Array.isArray(transformedKeys) && transformedKeys.map(key => <Column key={key} label={key} dataKey={key} width={400} />)}
    </Table>
</TableContainer>

export default TableComponent;

const TableContainer = styled.div`
    width: 90vw;
    height: 80vh;
    padding-left: 50px;
    .ReactVirtualized__Table {
        border-radius: 15px;
        background-color: #111;
        color: #00b4ff;
        box-shadow: 1px 7px 16px #000000cc;
    }
`
