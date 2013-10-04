$(function () {
	
	$.ajax({
		type: 'GET',
		url: "/api/code",
		success: function (data) {
			$('#ide-code').html(data.code);
		}
	});
	
	$('#save').on('click', function () {
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
	
	$('#ide-reload').on('click', function () {
		$.ajax({
			type: 'GET',
			url: "/api/code",
			success: function (data) {
				$('#ide-code').html(data.code);
			}
		});
	});
});

