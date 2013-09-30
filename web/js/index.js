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
				console.log('success');
				console.log(data);
				$("h1").html(data);
			},
			complete: function () {
				console.log('complete');
			}
		});
	});
});

