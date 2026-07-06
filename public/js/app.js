$(document).ready(function () {
    const API_URL = '/api/vehicles';

   
    loadVehicles();

    
    $('#registrationForm').on('submit', function (e) {
        e.preventDefault();
        
        const isUpdate = $('#isUpdate').val() === 'true';
        const regNo = $('#RegNo').val();

        const vehicleData = {
            RegNo: $('#RegNo').val(),
            VehicleModel: $('#VehicleModel').val(),
            FirstName: $('#FirstName').val(),
            LastName: $('#LastName').val(),
            Email: $('#Email').val(),
            OwnerNIC: $('#OwnerNIC').val(),
            FuelType: $('#FuelType').val(),
            NearestStation: $('#NearestStation').val(),
            QRCode: $('#QRCode').val()
        };

        const type = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `${API_URL}/reg/${regNo}` : API_URL;

        showLoader(true);

        $.ajax({
            url: url,
            type: type,
            contentType: 'application/json',
            data: JSON.stringify(vehicleData),
            success: function (response) {
                showLoader(false);
                Swal.fire('Success!', `Vehicle ${isUpdate ? 'updated' : 'registered'} successfully.`, 'success');
                $('#registrationModal').modal('hide');
                resetForm();
                loadVehicles();
            },
            error: function (xhr) {
                showLoader(false);
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Operation failed';
                Swal.fire('Error!', errorMsg, 'error');
            }
        });
    });

    
    $('#vehicleTableBody').on('click', '.btn-edit', function () {
        const regNo = $(this).data('id');
        fetchVehicleForEdit(regNo);
    });

    $('#vehicleTableBody').on('click', '.btn-delete', function () {
        const regNo = $(this).data('id');
        confirmDelete(regNo);
    });

    $('#vehicleTableBody').on('click', '.btn-qr', function () {
        const regNo = $(this).data('id');
        showQRCard(regNo);
    });

    
    $('#RegNo').on('input', function() {
        const regNo = $(this).val().toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (regNo) {
            $('#QRCode').val(regNo + '-QR');
        } else {
            $('#QRCode').val('');
        }
    });

    
    $('#btnSearch').on('click', function () {
        const searchType = $('#searchType').val();
        const keyword = $('#searchInput').val();

        if (!keyword) {
            loadVehicles();
            return;
        }

        let searchUrl = '';
        switch (searchType) {
            case 'reg': searchUrl = `${API_URL}/reg/${keyword}`; break;
            case 'firstname': searchUrl = `${API_URL}/firstname/${keyword}`; break;
            case 'lastname': searchUrl = `${API_URL}/lastname/${keyword}`; break;
            case 'email': searchUrl = `${API_URL}/email/${keyword}`; break;
            case 'station': searchUrl = `${API_URL}/station/${keyword}`; break;
            case 'fuel': searchUrl = `${API_URL}/fuel/${keyword}`; break;
            case 'nic': searchUrl = `${API_URL}/nic/${keyword}`; break;
        }

        fetchSearchResults(searchUrl);
    });

    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-lg').css('background', 'white');
        } else {
            $('.navbar').removeClass('shadow-lg').css('background', 'rgba(255, 255, 255, 0.8)');
        }
    });

    
    function loadVehicles() {
        showLoader(true);
        $.get(API_URL, function (response) {
            renderTable(response.data);
            showLoader(false);
        });
    }

    
    function renderTable(data) {
        const tableBody = $('#vehicleTableBody');
        tableBody.empty();

        if (!data || data.length === 0 || (typeof data === 'object' && !Array.isArray(data) && !data.RegNo)) {
            tableBody.append('<tr><td colspan="7" class="text-center py-4">No records found.</td></tr>');
            return;
        }

        
        const list = Array.isArray(data) ? data : [data];

        list.forEach(vehicle => {
            tableBody.append(`
                <tr class="animate-fade">
                    <td><span class="fw-bold">${vehicle.RegNo}</span></td>
                    <td>${vehicle.FirstName} ${vehicle.LastName}</td>
                    <td>${vehicle.VehicleModel}</td>
                    <td><span class="badge ${vehicle.FuelType === 'Petrol' ? 'bg-success' : 'bg-warning'}">${vehicle.FuelType}</span></td>
                    <td>${vehicle.NearestStation}</td>
                    <td>
                        <button class="btn btn-sm btn-dark btn-qr" data-id="${vehicle.RegNo}">
                            <i class="fas fa-qrcode me-1"></i>View QR
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-edit me-1" data-id="${vehicle.RegNo}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${vehicle.RegNo}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    
    function fetchSearchResults(url) {
        showLoader(true);
        $.ajax({
            url: url,
            type: 'GET',
            success: function (response) {
                renderTable(response.data);
                showLoader(false);
            },
            error: function () {
                renderTable([]);
                showLoader(false);
            }
        });
    }

    
    function fetchVehicleForEdit(regNo) {
        showLoader(true);
        $.get(`${API_URL}/reg/${regNo}`, function (response) {
            showLoader(false);
            const v = response.data;
            $('#RegNo').val(v.RegNo).attr('readonly', true);
            $('#VehicleModel').val(v.VehicleModel);
            $('#FirstName').val(v.FirstName);
            $('#LastName').val(v.LastName);
            $('#Email').val(v.Email);
            $('#OwnerNIC').val(v.OwnerNIC);
            $('#FuelType').val(v.FuelType);
            $('#NearestStation').val(v.NearestStation);
            $('#QRCode').val(v.QRCode);
            
            $('#isUpdate').val('true');
            $('#modalTitle').text('Update Vehicle Details');
            $('#btnSubmit').text('Update Vehicle');
            $('#registrationModal').modal('show');
        });
    }

    
    function showQRCard(regNo) {
        showLoader(true);
        $.get(`${API_URL}/reg/${regNo}`, function (response) {
            showLoader(false);
            const v = response.data;
            
            $('#qrRegNo').text(v.RegNo);
            $('#qrName').text(`${v.FirstName} ${v.LastName}`);
            $('#qrNIC').text(v.OwnerNIC);
            $('#qrModel').text(v.VehicleModel);
            $('#qrFuel').text(v.FuelType);

            
            $('#qrcodeContainer').empty();

            
            new QRCode(document.getElementById("qrcodeContainer"), {
                text: v.QRCode,
                width: 180,
                height: 180,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            $('#qrModal').modal('show');
        });
    }

    
    window.printQR = function() {
        window.print();
    };

    
    function confirmDelete(regNo) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete vehicle registration ${regNo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                showLoader(true);
                $.ajax({
                    url: `${API_URL}/reg/${regNo}`,
                    type: 'DELETE',
                    success: function () {
                        showLoader(false);
                        Swal.fire('Deleted!', 'Record has been removed.', 'success');
                        loadVehicles();
                    }
                });
            }
        });
    }

    function resetForm() {
        $('#registrationForm')[0].reset();
        $('#RegNo').attr('readonly', false);
        $('#QRCode').val(''); 
        $('#isUpdate').val('false');
        $('#modalTitle').text('Register New Vehicle');
        $('#btnSubmit').text('Register Vehicle');
    }

    function showLoader(show) {
        if (show) $('#loader').fadeIn(200);
        else $('#loader').fadeOut(200);
    }
});
