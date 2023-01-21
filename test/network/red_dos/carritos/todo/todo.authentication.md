[x] Crear instalador que copia los ficheros de un proyecto a una nueva carpeta
[x] Cambiar el test unitario "inrow" para que inicie y pare el servidor.
[ ] Adaptar los tests para que:
    [ ] 4. Cambiar el código de la aplicación para externalizar el AUTH:
        [x] 4.1. Que el CREATE-PROJECT permita un schema.auth para externalizar el AUTH: schema_attributes?
        [x] 4.2. Que el LOGIN, si hay un schema.auth, lo haga hacia fuera
        [x] 4.3. Que el LOGOUT, si hay un schema.auth, lo haga hacia fuera
        [x] 4.4. Que el AUTHENTICATE, si hay un schema.auth, lo haga hacia fuera
            [x] 4.4.1. Hay que instaurar un servicio que sea EXCLUSIVAMENTE para obtener la "?operation=authenticate"
            [x] 4.4.2. Cuando haya un schema.auth, el método AUTHENTICATE debe llamar a "?operation=authenticate"
    [x] 5. Crear un código de los tests 'pluralith' para externalizar el AUTH:
        [x] 5.1. Limpiar los proyectos: borrar los 2 proyectos recursivamente
        [x] 5.2. Un tests inicial que ejecute el instalador 2 veces, 1 por cada proyecto.
        [x] 5.3. Los hydrateJSON de los *.json tienen que hacerse con peticiones redireccionadas.
        [x] NOTA: los tests unitarios "inrow" (test/tests/inrow) están bien, y cuando hagamos no solo el punto de EXTERNALIZAR AUTH sino
            también de EXTERNALIZAR TABLES, los tests deberán seguir funcionando. Entonces, estos TESTS son y SEGUIRÁN SIENDO el SANCTA 
            SANCTORUM de que va a seguir funcionando correctamente la aplicación. Lo único que cambia es que por dentro, la aplicación
            no resolverá los servicios en un servidor, sino en otro. Pero eso se hará bien cuando se resuelva el punto de 
            TODO.DISTRIBUTED-DATABASES.MD, que es el siguiente.