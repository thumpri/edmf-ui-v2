import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import Header from '../../containers/Header';
import NameRenderer from '../../components/renderers/NameRenderer';
import VerifiedRenderer from '../../components/renderers/VerifiedRenderer';
import { InfiniteRowModelModule } from 'ag-grid-community';
import API from '../../api/easyDMAPI'

const columnDefs = [
	{ headerName: "Name", field: "name",cellRenderer: 'nameRenderer',
		valueGetter: function(params) {
            return params.data && {name:params.data.name,image:params.data.profile_image_url_https};
          },
		  flex:2},
	{ headerName: "Screen Name", field: "screen_name"},
	{ headerName: "Followers Count", field: "followers_count" },
	{ headerName: "Friends Count", field: "friends_count" },
	{ headerName: "Location", field: "location",flex:2},
	{ headerName: "Verified", field: "verified" ,cellRenderer: 'verifiedRenderer'}
]

const defaultColDef = { sortable: true }

const components = {
	nameRenderer: NameRenderer,
	verifiedRenderer: VerifiedRenderer
}

const paginationConfig = {
	 modules: [InfiniteRowModelModule ],
	 rowModelType: 'infinite',
	 paginationPageSize: 100,
	 cacheOverflowSize: 2,
	 maxConcurrentDatasourceRequests: 2,
	 infiniteInitialRowCount: 1000,
	 maxBlocksInCache: 2,
	 rowBuffer: 0
};
 const onGridReady = params => {
	var dataSource = {
		rowCount: null,
			getRows: function(params) {
				//console.log('asking for ' + params.startRow + ' to ' + params.endRow);
				let sortParams = params.sortModel.length > 0  ? [params.sortModel.map((sortBy)=>{
					return [sortBy.colId,sortBy.sort.toUpperCase()]
				})]:undefined;
				API.getPaginatedFollowers({offset:params.startRow,limit:100,order:sortParams}).then((users)=>{
					params.successCallback(users, -1);
				});
			}
		};
      params.api.setDatasource(dataSource);
  };


const Followers = ({ followers }: any) => {
	return (
		<div className="w-full">
			<Header name='Followers' />
			<main className="h-16 mx-auto p-4 sm:p-6 lg:p-8 flex">
				<div className="ag-theme-alpine" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
					<AgGridReact 
						columnDefs={columnDefs}
						defaultColDef={defaultColDef}
						components ={components}
						rowModelType={paginationConfig.rowModelType}
						paginationPageSize={paginationConfig.paginationPageSize}
						cacheOverflowSize={paginationConfig.cacheOverflowSize}
						maxConcurrentDatasourceRequests={
						paginationConfig.maxConcurrentDatasourceRequests
						}
						infiniteInitialRowCount={paginationConfig.infiniteInitialRowCount}
						maxBlocksInCache={paginationConfig.maxBlocksInCache}
						rowBuffer={paginationConfig.rowBuffer}
						onGridReady={onGridReady}
					>
					</AgGridReact>
				</div>
			</main>
		</div>
	);
}
 
export default Followers;