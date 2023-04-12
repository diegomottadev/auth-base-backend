
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../../../components/Error';
import CaterogyService from '../../../services/categories/CaterogyService'

const CategoryList = () => {

    const dt = useRef(null);
    const navigate = useNavigate();

    const [categories, setCategories] = useState(false);
    const [loadingDatatable, setLoadingDatatable] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showError, setShowError] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
        search: null
    });

    useEffect(() => {
        async  function loadLazyData () {

            try {
                setLoadingDatatable(true);
                const {data:{data:result, total:total}} =  await CaterogyService.allCategories(lazyParams)
                setTotalRecords(total);
                setCategories(result);
                setLoadingDatatable(false);
               // });
            } catch (err){
                console.log(err);
                console.warn('Hubo un problema con la carga del listado de categorias');
                setShowError(true);
                setLoadingDatatable(false);
            }
            
        }
        loadLazyData();
    },[lazyParams]) 


    const onPage = (event) => {        
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onFilter = (e) => {
        const search = { search: { name: e.target.value } };
        let _lazyParams = { ...lazyParams, ...search };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    }

    const onEditCategory = (categoryId) => {
        navigate(`/categories/${categoryId}/edit`);
    }

    const header = (

        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"></h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => onFilter(e)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button tooltip={"Editar"}  tooltipOptions={{ position: 'top' }} icon="pi pi-pencil" className="p-button-raised p-button-success p-mr-2" onClick={() => onEditCategory(rowData.id)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTeacher(rowData)} /> */}
            </div>
        );
    }

    if(showError){
        return(
                <Error mensaje={'Hubo un problema con la carga del listado de categorias'}></Error>
        );
    } 

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Categorias</h5>
                     <DataTable ref={dt} value={categories} lazy
                        paginator first={lazyParams.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                        loading={loadingDatatable}
                        className="p-datatable-gridlines" header={header}
                        >
                        <Column field="name" header="Nombre"  headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="description" header="Descripción"  ></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable> 
                </div>
            </div>
        </div>
    )

            
}
export default CategoryList;