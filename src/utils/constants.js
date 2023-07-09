export const MESSAGE = {
    MES_SUCCESS: 'Execute Success',
    MES_FALURE: 'Execute Failure',
    MES_NOCONTENT: 'Please enter the correct format of MySQL statement',
    MES_NOREQU: 'Unsupported MySQL parsing and check the initialization prompt',
    MES_ERRORPARSE: 'Parsing failed due to a large number of syntax errors',
    MES_ILLEGAL: 'Illegal expression',
    MES_ERRORSELECTCOLUMN: 'Exception in query column',
    MES_ERRORSELECTTABLE: 'Exception in query table',
    MES_ERRORJUAGESTATE: 'Exception in judgment statement',
    TYPE: {
        ERROR: 'Error',
        SUCCESS: 'Success'
    },
    STATUS: {
        ERROR: 2000,
        SUCCESS: 200
    }
}  

export const SQLTYPE = {
    DROP_TABLE: 'Drop_Table',
    DROP_DATABASE: 'Drop_Database',
    CREATE_TABLE: 'Create_Table',
    CREATE_DATABASE: 'Create_Database',
    DELETE_FROM: 'Delete_From',
    UPDATE_SET: 'Update_Set',
    GRANT_ON_TO: 'Grant_On_To',
    INSERT_INTO_VALUE: 'Insert_into_value',
    SELECT_FROM: 'Select_From',
    SHOW_DATABASES: 'Show_Databases',
    SHOW_TABLES: 'Show_Tables',
    USE: 'Use',
    SHOW: 'Show',
    DROP: 'Drop',
    CREATE: 'Create',
    DELETE: 'Delete',
    UPDATE: 'Update',
    GRANT: 'Grant',
    SELECT: 'Select',
    INSERT: 'Insert',
    USEDATABASES: 'Use_databases',
    USETABLES: 'Use_tables'
}

export const SQLTYPEREG = {

}

export const SIMPLESQLTYPE = ['Use', 'Show']

export const codeTips = 
`/* 
    Welcome to use sql parser!
    CTRL key can complete the code and the MySQL syntax you can use is as follows. 
    The system will do its best to ensure your correct grammar. Enjoy it!
*/
    Show tables; Show databases;
    Create table; Create databases;
    Drop table; Drop databases;
    Update;
    Select;
    Grant;
    Use;
    Insert into;
    Delete;

`