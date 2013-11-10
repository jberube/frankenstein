$(function () {

	reloadCode();	

	$('#ide-reload').on('click', reloadCode);
	
	$('#ide-save').on('click', function () {
		$.ajax({
			type: 'POST',
			url: "/api/code",
			data: {
				code: $('#ide-code').val()
			},
			dataType: "text",
			success: function (data) {
				$("#ide-status").text('saved');
			}
		});
	});
	
});

function reloadCode() {
	$.ajax({
		type: 'GET',
		url: "/api/code",
		success: function (data) {
			$('#ide-code').html(data.code);
		}
	});

	$.ajax({
		type: 'GET',
		url: "/api/ide/console/logs",
		success: function (data) {
			$('#ide-console-out').html(data.logs.join('\r\n'));
		}
	});
}

