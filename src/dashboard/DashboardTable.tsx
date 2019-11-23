import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import {
  DataHeader,
  DataRow,
  OrderSetting
} from './interfaces';
import { printValue } from './services/Printable';

interface DashboardTableProps {
  isLoading: boolean
  headers: DataHeader[]
  rows: DataRow[]
  orderSetting: OrderSetting
  onChangeOrderSetting: (orderSetting: OrderSetting) => void
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  isLoading,
  headers,
  rows,
  orderSetting,
  onChangeOrderSetting
}) => {
  const renderEmptyState = () => (
    <TableBody>
      <TableRow>
        <TableCell colSpan={headers.length}>
          <EmptyCell>No rows to display.</EmptyCell>
        </TableCell>
      </TableRow>
    </TableBody>
  )

  return (
    <Container>
      {isLoading && (
        <LoadingOverlay>
          <CircularProgress />
        </LoadingOverlay>
      )}
      <Table stickyHeader size="small" aria-label="dashboard table">
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableCell
                key={header.id}
              >
                <TableSortLabel
                  active={orderSetting.column === header.id}
                  direction={orderSetting.direction}
                  onClick={() => onChangeOrderSetting(createNewOrderSetting(header.id, orderSetting))}
                >
                  {header.title}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {rows.length > 0
          ? <DashboardTableBody
              rows={rows}
              headers={headers}
            />
          : renderEmptyState()
        }
      </Table>
    </Container>
  );
}

export default DashboardTable;

interface BodyProps {
  headers: DataHeader[]
  rows: DataRow[]
}

const DashboardTableBody: React.FC<BodyProps> = React.memo(({
  rows,
  headers
}) => {
  return (
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id}>
          {headers.map((header, idx) =>
            idx === 0
              ? (
                <TableCell key={header.id} component="th" scope="row">
                  {printValue(row.cells[header.id])}
                </TableCell>
              )
              : (
                <TableCell key={idx}>{printValue(row.cells[header.id])}</TableCell>
              )
          )}
        </TableRow>
      ))}
    </TableBody>
  )
});

function createNewOrderSetting(columnId: string, previous: OrderSetting): OrderSetting {
  return {
    column: columnId,
    direction: (previous.column === columnId && previous.direction === 'asc') ? 'desc' : 'asc'
  }
}

const Container = styled(Paper)`
  position: relative;
  height: 100%;
  overflow: auto;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyCell = styled.div`
  text-align: center;
  font-style: italic;
`;
