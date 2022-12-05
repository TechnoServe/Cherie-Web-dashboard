$(document).ready( function () {
    document.addEventListener('build', (e) => {
        setTimeout(() => {
            let messageBottom = `Generated ${Date()}`

            let exportConfig = {
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5 ]
                },
                title: "TNS Cherries Report",
                messageBottom: messageBottom
            }
            $('#table').DataTable({
                dom: 'Bfrtip',
                destroy: true,
                buttons: [
                    {
                        extend: 'copy',
                        ...exportConfig,
                    },
                    {
                        extend: 'csv',
                        ...exportConfig,
                    },
                    {
                        extend: 'pdf',
                        ...exportConfig,
                    },
                    {
                        extend: 'print',
                        ...exportConfig,
                    },
                    {
                        extend: 'excel',
                        ...exportConfig,
                    },
                ]
            });
        }, 1000)
     }, false);
    
} );