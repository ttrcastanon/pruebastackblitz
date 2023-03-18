/**
 * Enumeraciones
 */
export namespace Enumerations {


    export const Enums = {

        /**
         * Estatus de Usuario
         */
        UserStatus: {

            /**
             * Activo
             */
            Active: 1,

            /**
             * No activo (bloqueado)
             */
            Inactive: 2

        },

        /**
         * Tipos de Exportación de Información
         */
        ExportType: {

            /**
             * Memoria (Portapapeles)
             */
            MEM: 1,

            /**
             * MS Excel
             */
            XLS: 2,

            /**
             * CSV
             */
            CSV: 3,

            /**
             * PDF
             */
            PDF: 4,

            /**
             * Dialog Print
             */
            PTR: 5

        },
        /**
         * Opciones para radio buttons
         */
        RadioOptions:
        {
            Yes: 1,
            No: 0,
            NoApply: -1
        },
        /**
         * Tipos de Filtros
         */
        Filters:
        {
            BeginWith: 1,
            EndWith: 2,
            Contains: 3,
            Exact: 4,
        }

    }

}