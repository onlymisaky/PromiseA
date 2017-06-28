const ajax = ({type = "get", url = "#", data = '', dataType = "text"}) => {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		type = type.toLowerCase();
		data = convertData(data);
		if (type === "get") {
			url += url + data;
			xhr.open(type, url);
			data = null;
		} else {
			xhr.open("post", url);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		}
		xhr.send(data);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					try {
						resolve(dataType.toLowerCase() === "json" ? JSON.parse(xhr.responseText) : xhr.responseText)
					} catch (e) {
						reject(e);
					}
				} else {
					reject(new Error(xhr.statusText));
				}
			}
		}
	});

	function convertData(data) {
		if (data.toString().slice(8, -1) === "Object") {
			var d = "";
			for (var k in data) {
				if (data.hasOwnProperty(k)) {
					d += k + "=" + data[k] + "&";
				}
			}
			data = d.slice(0, -1);
		}
		return data;
	}
}
