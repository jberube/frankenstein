$(function () {

	$('#ide-reload').on('click', reloadCode);
	$('#ide-save').on('click', saveCode);

	reloadCode();	
	
});

function saveCode() {
	var code = $('#ide-code').val();
	console.log(code);
	$.ajax({
		type: 'POST',
		url: '/api/code',
		data: { 
			code: code
		},
		success: function (data) {
			$('#ide-status').text('saved');
		},
		error: handleError
	});
}

function reloadCode() {
	$.ajax({
		type: 'GET',
		url: '/api/code',
		success: function (data) {
			$('#ide-code').html(data.code);
		},
		error: handleError
	});

	$.ajax({
		type: 'GET',
		url: '/api/ide/console/logs',
		success: function (data) {
			$('#ide-console-out').html(data.logs.join('\r\n'));
		},
		error: handleError
	});
}

function handleError(jqXHR, textStatus, errorThrown) {
	console.log(jqXHR, textStatus, errorThrown);
	console.trace();
}
