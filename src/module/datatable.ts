import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-scroller';
import 'datatables.net-select';



interface SColumnDefsSettings<T> extends DataTables.ColumnSettings {
    sSearchNearest?: boolean
    sFilter?: boolean
    sClick?: (row: T) => void
    sKey: string,
    sIndex?: number
}

export interface TableConfig<T> extends DataTables.Settings {
    sAjaxUrl: string
    sGroupBy?: (a: T, b: T) => boolean
    columns: SColumnDefsSettings<T>[]
    sObjectForStructure: T
}


export function setupDataTable<T>(config: { elementId: string, config: TableConfig<T> }) {
    const tableConfig = config.config;
    tableConfig.columns.forEach((c, index) => {
        if (c.sFilter || c.sSearchNearest) {
            c.orderable = false;
        }
        c.data = (tableConfig.sGroupBy) ? `0.${c.sKey}` : c.sKey;
        c.title = c.title || c.sKey.camelCaseToRegularString();
        c.render = c.render || (data => {
            return data;
        });
        c.sIndex = index;
    });

    const tableElement = document.getElementById(config.elementId);
    tableElement.classList.add(config.elementId);
    const $table = $(tableElement).on('init.dt', function () {
        const searchNearestIndexes = tableConfig.columns.filter(c => c.sSearchNearest).map(c => c.sIndex);
        const filterIndexes = tableConfig.columns.filter(c => c.sFilter).map(c => c.sIndex);
        const createInput = (indexes: number[], type: 'searchNearest' | 'filter'): void => {
            indexes.forEach(columnIndex => {
                const thisColumnInput = document.createElement('input');
                thisColumnInput.type = 'text';
                thisColumnInput.placeholder = 'Search';
                let timeout: number = null;
                thisColumnInput.addEventListener('input', e => {
                    if (timeout !== null) clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        if (type === 'searchNearest') {
                            const columnDatas = $table.column(columnIndex).data();
                            const mapedTableDatas = columnDatas.map(function (value) {
                                return Math.abs(value - +(thisColumnInput.value));
                            });
                            const nearestValue = Math.min.apply(null, mapedTableDatas);
                            const rowIndex = mapedTableDatas.indexOf(nearestValue);

                            $table.row(':eq(' + ((rowIndex - 3 <= 0) ? 0 : rowIndex - 3) + ')').scrollTo();
                            $table.rows().deselect();
                            $table.row(':eq(' + rowIndex + ')').select();
                        }
                        else {
                            $table.column(columnIndex).search(thisColumnInput.value).draw();
                        }
                    }, 250);
                });
                thisColumnInput.addEventListener('focus', e => {
                    document.querySelectorAll<HTMLInputElement>(`table.${config.elementId} thead input`).forEach(input => {
                        if (input !== thisColumnInput) input.value = '';
                    });
                    $table.column(columnIndex).order('asc').draw();
                    $table.rows().deselect();
                });
                document.querySelector(`table.${config.elementId} thead th:nth-of-type(${columnIndex + 1})`).prepend(thisColumnInput);
            })
        }

        createInput(searchNearestIndexes, 'searchNearest');
        createInput(filterIndexes, 'filter');
    }).DataTable({
        ...tableConfig,
        ...{
            deferRender: false, //一定要false, 不然搜索后找不到eq，因为一开始只有很少的row element
            scroller: true,
            ajax: {
                url: tableConfig.sAjaxUrl,
                dataSrc: function (data: { datas: any[][] }) {
                    const datas = data.datas;
                    const datasAfterMap = datas.map<T>((array) => {
                        let item: any = {};
                        const keys = Object.keys(tableConfig.sObjectForStructure);
                        array.forEach((value, index) => {
                            item[keys[index]] = value;
                        });
                        return item;
                    });
                    return (tableConfig.sGroupBy) ? datasAfterMap.groupBy(tableConfig.sGroupBy) : datasAfterMap;
                }

            },
        }
    });

    const clickMethodVsIndex = tableConfig.columns.filter(c => c.sClick).reduce<{ [name: number]: (row: T) => void }>((result, column) => {
        result[column.sIndex] = column.sClick;
        return result;
    }, {});

    document.getElementById(config.elementId).addEventListener('click', e => {
        const targetElement = e.target as HTMLElement;
        let loopElement = targetElement;
        let tdElement = null; 

        while (loopElement !== null) {
            if (loopElement.tagName === 'TD') {
                tdElement  = loopElement;
                break;
            }
            else {
                loopElement = loopElement.parentElement;
            }
        }
        const columnIndex = $table.cell(loopElement).index().columnVisible;
        const clickMethod = clickMethodVsIndex[columnIndex];
        if(clickMethod){
            const rowData = targetElement.dataset['rowData'];
            if (rowData === undefined) {
                console.error('Jquery Datatable : click event missing dataset["rowData"]');
            }
            clickMethod(JSON.parse(rowData));
        }
    });
}






