$(function () {
	$('#save').on('click', function () {
		$.ajax({
			type: 'GET',
			url: "/api/test",
			data: {
				code: $('#ide-code').val()
			},
			dataType: "text",
			success: function (data) {
				$("h1").html(data);
			}
		});
	});
});

