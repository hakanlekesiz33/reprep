import React, { Component } from 'react';
import DataTable from 'react-data-table-component';

class DataTableComp extends React.Component {

  render() {

    return (
      <>
        <DataTable
          pagination
          pagination={this.props.pagination}
          paginationPerPage={10}
          columns={this.props.columns}
          data={this.props.data}
          noDataComponent={this.props.noDataComponent}
          paginationComponentOptions=	{ {rowsPerPageText: this.props.rowsPerPage, rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'All'} }
        />
      </>
    )
  }
};

export default DataTableComp;