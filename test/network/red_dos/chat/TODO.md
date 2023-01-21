TODO inmediato:

[ ] Querybuilder UI
[ ] Formularios de creación y edición de columna
[ ] Formularios de creación y edición de protector
[ ] Chat UI (socket.io-client) + Chat server (socket.io)

[ ] Sobre queries:
    [ ] Gramática de transacción de query por peticiones http
    [ ] Gramática de query sobre ¿...?
    [ ] Gramática de 


[ ] mas menos a default selected
[ ] rows de calendario para mes y año y hora al 100%
[ ] Línea de separación del título de la app en gris
[ ] Bordes de los inputs de texto y selección azules
[ ] Ancho mínimo fijo para los botones (sobre todo los +/-)
[ ] Botones clickables con 1 hover uniforme
    [ ] Default: amarillado
    [ ] ?: averdeado
    [ ] Input: azuleado


















TODO SEMIPENDIENTE:

[x] Set file
[x] Get file


[ ] Añadir 1 componente en el DataTableComponent al abrir una ROW (se despliega una subrow donde):
    [x] Con un selector para escoger la vista que se quiere ver
    [x] Crear un componente de DataRowExplorerComponent:
        [x] Que permita explorar recursivamente ROWs, Objetos y Listas.
        [x] Con un botón para "Ir a dato" que abra una pestaña.
        [x] Con un botón para "Nuevo dato" que abra una pestaña.
        [x] Que por defecto tenga siempre 1 vista de explorador universal
        [x] Que además pueda soportar nuevos componentes de vista por table
            [ ] Con un hasRowViews en el schema.tables[*].attributes
                [ ] Donde se mapee un nombre con un componente vue + parámetros fijos desde el schema

[ ] Inyectar componentes UI en el proceso de despliegue:
    [ ] Por API
        [ ] Añadir un nuevo método
        [ ] Hookear el src/app/app.calo con sintaxis @TO-HOOK
        [ ] Alterar el proceso de despliegue para que permita hookear al app.calo con componentes Vue (código JS en última instancia)
        [ ] Crear un test cutrecillo para test/network que compruebe que se ha inyectado un componente
    [ ] Por el lenguaje
        [ ] ...










TODO of FORMS:

[ ] Form types (vue):
    [x] password
    [x] object
    [x] list
    [x] time (calendario, reloj)
    [ ] list: isRepeateableList / isSortableList
    [ ] recursive insert/edit/delete
    [ ] historical
    [ ] json
 ....
    [ ] options
    [ ] option
[ ] Special form types (project.json + vue):
    [ ] hasOptionCondition
    [ ] hasOptionsConditions

TODO of PROTECTORS:

[ ] Protectors:
    [ ] Un protector común que directamente contemple las columnas:
        ---------------------------------
        [ ] viewable_by_users
        [ ] viewable_by_groups
        [ ] viewable_by_privileges
        ---------------------------------
        [ ] persistable_by_users
        [ ] persistable_by_groups
        [ ] persistable_by_privileges   
        ---------------------------------
        [ ] administrable_by_users      -]-
        [ ] administrable_by_groups   ---]--- Que permita modificar los valores de estas tablas
        [ ] administrable_by_privileges -]-
        ---------------------------------

TODO of DATABASE:

[ ] Soft delete ( created_at )
[ ] Tracers:
    [ ] created_by
    [ ] updated_by
    [ ] last_updated_by
    [ ] deleted_by

TODO of UI:

[ ] Notificaciones
    [ ] error
    [ ] success
[ ] Schema CRUDs:
    [ ] add/update/delete table
    [ ] add/update/delete column
    [ ] add/update/delete protector
[ ] ...
[ ] Queries complejas
[ ] Gráficos (sobre queries y sobre datos)
[ ] UX/UI
[ ] Extras


DONE:

[x] Procesos:
    [x] Habilitar un servicio para llamar a procesos
    [x] Que use un switch-case (no un JSON ni un array)
    [x] Con método para añadir proceso a servidor
[x] Servidor de aplicación automáticamente creado e iniciado
    [x] Habilitando CORS en el server del back y del front
    [x] Que sirva ficheros estáticos
    [x] Que centralice todos los schemas dinámicamente
    [x] Con el código fuente de la aplicación original pero adaptado
[x] Gramática de aplicación REST.
