$(function() {
	var $editDialog = $('#edit_dialog'),
		$deleteDialog = $('#delete_dialog');
	var blogrollId = '',
		webmaster = '',
		domain = '';
	$('#blogroll_list').click(function(event) {
		var $target = $(event.target);
		if ($target.hasClass('add') || $target.parent().hasClass('add')) {
			blogrollId = '';
			$('#webmaster').val('');
			$('#domain').val('');
			$editDialog.modal();
		}
		if ($target.hasClass('edit') || $target.parent().hasClass('edit')) {
			blogrollId = $target.parents('tr').attr('data');
			webmaster = $target.parents('td').siblings('td.webmaster').text();
			domain = $target.parents('td').siblings('td.domain').text();
			$('#webmaster').val(webmaster);
			$('#domain').val(domain);
			$editDialog.modal();
		}
		if ($target.hasClass('delete') || $target.parent().hasClass('delete')) {
			blogrollId = $target.parents('tr').attr('data');
			$deleteDialog.modal();
		}
	});

	$editDialog.find('button.btn-primary').click(function() {
		webmaster = $('#webmaster').val();
		domain = $('#domain').val();
		var blogroll = {};
		if ('' === blogrollId) {
			blogroll = {
				webmaster: webmaster,
				domain: domain
			};
			$.post('/blogroll/add', blogroll, function(data) {
				alert(data.msg);
				if ('success' === data.status) {
					location.reload();
				}
			}, 'json');
		} else {
			blogroll = {
				blogroll_id: blogrollId,
				webmaster: webmaster,
				domain: domain
			};
			$.post('/blogroll/update', blogroll, function(data) {
				alert(data.msg);
				if ('success' === data.status) {
					location.reload();
				}
			}, 'json');
		}
	});
	$deleteDialog.find('button.btn-primary').click(function() {
		var blogroll = {};
		blogroll.blogroll_id = blogrollId
		$.get('/blogroll/delete', blogroll, function(data) {
			alert(data.msg);
			$deleteDialog.modal('hide');
			if ('success' === data.status) {
				location.reload();
			}
		}, 'json');
	});
});