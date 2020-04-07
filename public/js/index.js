$(() => {
	const login = $('#login');
	const password = $('#password');
	const loginButton = $('#login_button');
	loginButton.click(() => {
		let data = {
			login: login.val(),
			password: password.val()
		};
		$.ajax({
				url: '/login',
				type: 'POST',
				dataType: 'json',
				data: data,
				error: (xmlHttp, status, errorThrown) => {
					console.log(xmlHttp);
				}
			}).done((data) => {
			if(data.error) {
				alert(data.error);
			} else {
				console.log(data.message);
				setTimeout(() => {window.location.href = '/';}, 1000);
			}
		})
	});
	const logoutButton = $('#logout_button');
	logoutButton.click(() => {
		let data = {};
		$.ajax({
				url: '/logout',
				type: 'POST',
				dataType: 'json',
				data: data,
				error: (xmlHttp, status, errorThrown) => {
					console.log(xmlHttp);
				}
			}).done((data) => {
			if(data.error) {
				alert(data.error);
			} else {
				console.log(data.message);
				setTimeout(() => {window.location.href = '/';}, 1000);
			}
		})
	});
	const registrationFormButton = $('#registration_form_button');

	let palette = $("#palette").children();
	for(let i = 0; i < palette.length; i++) {
		$(palette[i]).click(selectColor);
	}
	const rgb = $('#rgb').children('.color-value');
	for(let colorInput of rgb) {
		let rgbArray;		
		$(colorInput).on('input', (event) => {
			rgbArray = [$(rgb[0]).val(), $(rgb[1]).val(), $(rgb[2]).val()];
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {
			saveColor(currentCell);
		});
	}
	const cmyk = $('#cmyk').children('.color-value');
	for(let colorInput of cmyk) {
		let rgbArray;
		let cmykArray;
		$(colorInput).on('input', (event) => {
			cmykArray = [$(cmyk[0]).val(), $(cmyk[1]).val(), $(cmyk[2]).val(), $(cmyk[3]).val()];
			rgbArray = cmykToRgb(cmykArray);
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {			
			saveColor(currentCell);
		});
	}
	const hsv = $('#hsv').children('.color-value');
	for(let colorInput of hsv) {
		let rgbArray;
		let hsvArray;
		$(colorInput).on('input', (event) => {
			hsvArray = [$(hsv[0]).val(), $(hsv[1]).val(), $(hsv[2]).val()];
			rgbArray = hsvToRgb(hsvArray);
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {			
			saveColor(currentCell);
		});
	}
	const hsl = $('#hsl').children('.color-value');
	for(let colorInput of hsl) {
		let rgbArray;
		let hslArray;
		$(colorInput).on('input', (event) => {
			hslArray = [$(hsl[0]).val(), $(hsl[1]).val(), $(hsl[2]).val()];
			rgbArray = hslToRgb(hslArray);
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {			
			saveColor(currentCell);
		});
	}
	const hex = $('#hex').children('.color-value');
	for(let colorInput of hex) {		
		
		let rgbArray;
		$(colorInput).on('input', (event) => {
			let hexString = $(hex[0]).val();
			if($(hex[0]).val().slice(0,1) != '#'){
				hexString = '#' + hexString.slice(0,6);
			}
			let red = parseInt(hexString.slice(1,3), 16);
			let green = parseInt(hexString.slice(3,5), 16);
			let blue = parseInt(hexString.slice(5,7), 16);
			rgbArray = [red, green, blue];
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {
			saveColor(currentCell);
		});
	}
	$('#rgb .color-value').on('mousewheel', (event) => {
		if(event.originalEvent.wheelDelta / 120 > 0) {
			if($(event.target).val() >= 250) {
				$(event.target).val(255);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) + 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		} else {
			if($(event.target).val() <= 5) {
				$(event.target).val(0);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) - 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		}
	});
	$('#hsv .color-value').on('mousewheel', (event) => {
		if(event.originalEvent.wheelDelta / 120 > 0) {
			if(event.target.id == "hsv-h") {
				if($(event.target).val() >= 355) {
					$(event.target).val(0);
					$(event.target).trigger('input');
					$(event.target).trigger('change');
					return;
				}
				$(event.target).val(parseInt($(event.target).val()) + 5);
				$(event.target).trigger('input');
				$(event.target).trigger('change');				
				return;
			}
			if($(event.target).val() >= 95) {
				$(event.target).val(100);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) + 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		} else {
			if(event.target.id == "hsv-h") {
				if($(event.target).val() < 5) {
					$(event.target).val(355);
					$(event.target).trigger('input');
					$(event.target).trigger('change');
					return;
				}
				$(event.target).val(parseInt($(event.target).val()) - 5);
				$(event.target).trigger('input');
				$(event.target).trigger('change');			
				return;
			}
			if($(event.target).val() <= 5) {
				$(event.target).val(0);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) - 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		}
	});
	$('#hsl .color-value').on('mousewheel', (event) => {
		if(event.originalEvent.wheelDelta / 120 > 0) {
			if(event.target.id == "hsl-h") {
				if($(event.target).val() >= 355) {
					$(event.target).val(0);
					$(event.target).trigger('input');
					$(event.target).trigger('change');
					return;
				}
				$(event.target).val(parseInt($(event.target).val()) + 5);
				$(event.target).trigger('input');
				$(event.target).trigger('change');				
				return;
			}
			if($(event.target).val() >= 95) {
				$(event.target).val(100);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) + 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		} else {
			if(event.target.id == "hsl-h") {
				if($(event.target).val() < 5) {
					$(event.target).val(355);
					$(event.target).trigger('input');
					$(event.target).trigger('change');
					return;
				}
				$(event.target).val(parseInt($(event.target).val()) - 5);
				$(event.target).trigger('input');
				$(event.target).trigger('change');			
				return;
			}
			if($(event.target).val() <= 5) {
				$(event.target).val(0);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) - 5);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		}
	});
	$('#cmyk .color-value').on('mousewheel', (event) => {
		if(event.originalEvent.wheelDelta / 120 > 0) {
			if($(event.target).val() >= 90) {
				$(event.target).val(100);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) + 10);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		} else {
			if($(event.target).val() <= 10) {
				$(event.target).val(0);
				$(event.target).trigger('input');
				$(event.target).trigger('change');
				return;
			}
			$(event.target).val(parseInt($(event.target).val()) - 10);
			$(event.target).trigger('input');
			$(event.target).trigger('change');
		}
	});

	let currentCell;
	loadOpenedPalette(() => {
		currentCell = $('.color-selected');
		if(currentCell) {
			currentCell.trigger('click');
		}
	});

	let registrationClose;

	let registrationName;
	let registrationLogin;
	let registrationMail;
	let registrationPassword;
	let registrationPasswordRepeat;
	let registrationButton;

	registrationFormButton.click(showRegistrationForm);

	function showRegistrationForm() {
	$('body').prepend(`
		<div class='registration_wrap'>
			<div class='registration'>
				<div class='head'>Быстрая регистрация<div class='registration_close' id='registration_close'>&#10006;</div></div>
				<div class='form'>
					<textarea class='input_text' id='name_reg' placeholder='Введите имя'></textarea>
					<textarea class='input_text' id='login_reg' placeholder='Введите логин'></textarea>
					<textarea class='input_text' id='mail_reg' placeholder='Введите почту'></textarea>
					<input type='password' class='input_text' id='password_reg' placeholder='Введите пароль'></textarea>
					<input type='password' class='input_text' id='password_repeat_reg' placeholder='Повторите пароль'></textarea>
					<button class='btn' id='registration_button'>Зарегистрироваться</button>
					<div class='message_box' id='message_box'></div>
				</div>
			</div>
		</div>`);

		registrationClose = $('#registration_close');

		registrationName = $('#name_reg');
		   registrationLogin = $('#login_reg');
		   registrationMail = $('#mail_reg');
		   registrationPassword = $('#password_reg');
		   registrationPasswordRepeat = $('#password_repeat_reg');
		   registrationButton = $('#registration_button');

		   registrationButton.click(sendRegistrationForm);

		registrationClose.click(() => {
			   $('.registration_wrap').remove();
		})
	}

	function sendRegistrationForm() {
		if(checkForm()) {
			let data = {
				name: $('#name_reg').val(),
				login: $('#login_reg').val(),
				mail: $('#mail_reg').val(),
				password: $('#password_reg').val(),
			};
			$.ajax({
				url: '/registration',
				type: 'POST',
				dataType: 'json',
				data: data,
				error: (xmlHttp, status, errorThrown) => {
					console.log(xmlHttp);
				}
			}).done((data) => {
			if(data.error) {
				console.log(data.error);
				registrationLogin.css('background-color', '#f003');
				showFormError(data.error);
			} else {
				showRegistrationMessage();
				setTimeout(() => {window.location.href = '/';}, 1000);
				}
			})
		}
	}

	function checkForm() {
		clearMessageBox();
		if(checkLogin()&&checkPasswords()) {
			   return true;
		}
		return false;
	}
	function checkPasswords() {
		if(!registrationPassword.val()) {
			   registrationPassword.css('background-color', '#f003');
			   showFormError('Введите пароль');
			   return false;
		}
		if(registrationPassword.val().length < 6) {
			   registrationPassword.css('background-color', '#f003');
			   showFormError('Пароль должен быть больше 6 символов');
			   return false;
		}
		if(registrationPassword.val() == registrationPasswordRepeat.val()) {
			   registrationPassword.css('background-color', '#fff');
			   registrationPasswordRepeat.css('background-color', '#fff');
			   return true;
		} else {
			   registrationPasswordRepeat.css('background-color', '#f003');
			   showFormError('Введенные пароли не совпадают');
			   return false;
		}
	}
	function checkLogin() {
		if(registrationLogin.val()) {
			   if(/^[A-Za-z0-9]+$/.test(registrationLogin.val())) {
			  registrationLogin.css('background-color', '#fff');
			  return true;
			   } else {
			  registrationLogin.css('background-color', '#f003');
			  showFormError('В логине можно использовать только цифры и латинские буквы');
			  return false;
			   }		  
		} else {
			   registrationLogin.css('background-color', '#f003');
			   showFormError('Введите логин');
		}
	}

	function showFormError(message) {
		clearMessageBox();
		let box = $('#message_box');
		box.append(message);
		box.css('border', '1px solid #a00');
		box.css('border-radius', '5px');
		box.css('background-color', '#f003');
	}
	function showRegistrationMessage() {
		clearMessageBox();
		let box = $('#message_box');
		box.append('Регистрация прошла успешно');
		box.css('border', '1px solid #0a0');
		box.css('border-radius', '5px');
		box.css('background-color', '#0f03');
		box.css('color', '#0f0');
	}
	function clearMessageBox() {
		let box = $('#message_box');
		box.empty();
		box.css('border', '0');
		box.css('border-radius', '5px');
		box.css('background-color', '#fff');
	}


	function selectColor() {
		currentCell = $(this);
		for(let i = 0; i < palette.length; i++) {
			$(palette[i]).removeClass("color-selected");
		}
		currentCell.addClass("color-selected");
		updateColorPanel(currentCell);
	}
	function updateColorPanel(colorCell) {
		let currentColor = createRgbArrayFromCell(colorCell);
		updateHex(currentColor);
		updateRgb(currentColor);
		updateHsv(currentColor);
		updateHsl(currentColor);
		updateCmyk(currentColor);
		updateLab(currentColor);

	}
	function createRgbArrayFromCell(cell) {
		let rgbString = cell.css('background-color');
		rgbString = rgbString.slice(4);
		rgbString = rgbString.slice(0, -1);
		return rgbString.split(', ');
	}
	function updateHex(rgbArray) {
		let hexValue = rgbToHex(rgbArray);
		$(hex[0]).val('#' + hexValue);
	}
	function rgbToHex(rgbArray) {
		let red = parseInt(rgbArray[0]).toString(16);
		let green = parseInt(rgbArray[1]).toString(16);
		let blue = parseInt(rgbArray[2]).toString(16);

		if(red.length < 2) {
			red = '0' + red;
		}
		if(green.length < 2) {
			green = '0' + green;
		}
		if(blue.length < 2) {
			blue = '0' + blue;
		}

		let hexValue = red + green + blue;
		return hexValue;
	}
	function updateRgb(rgbArray) {
		let red = parseInt(rgbArray[0]);
		let green = parseInt(rgbArray[1]);
		let blue = parseInt(rgbArray[2]);

		$(rgb[0]).val(red);
		$(rgb[1]).val(green);
		$(rgb[2]).val(blue);
	}
	function updateHsv(rgbArray) {
		let hsvArray = rgbToHsv(rgbArray);

		$(hsv[0]).val(hsvArray[0]);
		$(hsv[1]).val(hsvArray[1]);
		$(hsv[2]).val(hsvArray[2]);
	}
	function rgbToHsv(rgbArray) {
		let red = parseInt(rgbArray[0]) / 2.55;
		let green = parseInt(rgbArray[1]) / 2.55;
		let blue = parseInt(rgbArray[2]) / 2.55;

		let max = Math.max(red, green, blue);
		let min = Math.min(red, green, blue);
		let diff = max - min;

		let hue = 0;
		if(diff == 0) {
			hue = 0;
		} 
		else if(max == red) {
			hue = Math.round(60 * ((green - blue) / diff % 6) % 360); 
		} 
		else if(max == green) {
			hue = Math.round(60 * ((blue - red) / diff + 2) % 360);
		} 
		else if(max == blue) {
			hue = Math.round(60 * ((red - green) / diff + 4) % 360);
		}
		if(hue < 0) {
			hue += 360;
		}

		let saturation = 0;
		if(max == 0) {
			saturation = 0;
		} else {
			saturation =  Math.round(diff / max * 100);
		}

		let value = Math.round(max);

		let hsvArray = [hue, saturation, value];
		return hsvArray;
	}
	function hsvToRgb(hsvArray) {
		let hue = hsvArray[0];
		if(hue >= 360 || hue < 0) {
			hue = 0;
		}
		let saturation = hsvArray[1] / 100;
		let value = hsvArray[2] / 100;

		let colorX = value * saturation;
		let colorY = colorX * (1 - Math.abs(hue / 60 % 2 - 1));
		let coef = value - colorX;

		let rgbArray = [];
		if(hue >= 0 && hue < 60) {
			rgbArray = [colorX, colorY, 0];
		} 
		else if(hue >= 60 && hue < 120) {
			rgbArray = [colorY, colorX, 0];
		} 
		else if(hue >= 120 && hue < 180) {
			rgbArray = [0, colorX, colorY];
		} 
		else if(hue >= 180 && hue < 240) {
			rgbArray = [0, colorY, colorX];
		}
		else if(hue >= 240 && hue < 300) {
			rgbArray = [colorY, 0, colorX];
		} 
		else if(hue >= 300 && hue < 360) {
			rgbArray = [colorX, 0, colorY];
		}

		rgbArray[0] = Math.round((rgbArray[0] + coef) * 255);
		rgbArray[1] = Math.round((rgbArray[1] + coef) * 255);
		rgbArray[2] = Math.round((rgbArray[2] + coef) * 255);

		return rgbArray;
	}
	function updateHsl(rgbArray) {
		let hslArray = rgbToHsl(rgbArray);

		$(hsl[0]).val(hslArray[0]);
		$(hsl[1]).val(hslArray[1]);
		$(hsl[2]).val(hslArray[2]);
	}
	function rgbToHsl(rgbArray) {
		let red = parseInt(rgbArray[0]) / 2.55;
		let green = parseInt(rgbArray[1]) / 2.55;
		let blue = parseInt(rgbArray[2]) / 2.55;

		let max = Math.max(red, green, blue);
		let min = Math.min(red, green, blue);
		let diff = max - min;

		let hue = 0;
		if(diff == 0) {
			hue = 0;
		} 
		else if(max == red) {
			hue = Math.round(60 * ((green - blue) / diff % 6) % 360); 
		} 
		else if(max == green) {
			hue = Math.round(60 * ((blue - red) / diff + 2) % 360);
		} 
		else if(max == blue) {
			hue = Math.round(60 * ((red - green) / diff + 4) % 360);
		}
		if(hue < 0) {
			hue += 360;
		}

		let lightness = (max + min) / 2;

		let saturation = 0;
		if(diff == 0) {
			saturation = 0;
		} else {
			saturation =  Math.round(diff / (100 - Math.abs(2 * lightness - 100)) * 100);
		}
		lightness = Math.round(lightness);


		let hslArray = [hue, saturation, lightness];
		return hslArray;
	}
	function hslToRgb(hslArray) {
		let hue = hslArray[0];
		if(hue >= 360 || hue < 0) {
			hue = 0;
		}
		let saturation = hslArray[1] / 100;
		let lightness = hslArray[2] / 100;

		let colorX = (1 - Math.abs(2 * lightness - 1)) * saturation;
		let colorY = colorX * (1 - Math.abs(hue / 60 % 2 - 1));
		let coef = lightness - colorX / 2;

		let rgbArray = [];
		if(hue >= 0 && hue < 60) {
			rgbArray = [colorX, colorY, 0];
		} 
		else if(hue >= 60 && hue < 120) {
			rgbArray = [colorY, colorX, 0];
		} 
		else if(hue >= 120 && hue < 180) {
			rgbArray = [0, colorX, colorY];
		} 
		else if(hue >= 180 && hue < 240) {
			rgbArray = [0, colorY, colorX];
		}
		else if(hue >= 240 && hue < 300) {
			rgbArray = [colorY, 0, colorX];
		} 
		else if(hue >= 300 && hue < 360) {
			rgbArray = [colorX, 0, colorY];
		}

		rgbArray[0] = Math.round((rgbArray[0] + coef) * 255);
		rgbArray[1] = Math.round((rgbArray[1] + coef) * 255);
		rgbArray[2] = Math.round((rgbArray[2] + coef) * 255);

		return rgbArray;
	}
	function updateCmyk(rgbArray) {
		cmykArray = rgbToCmyk(rgbArray);

		$(cmyk[0]).val(cmykArray[0]);
		$(cmyk[1]).val(cmykArray[1]);
		$(cmyk[2]).val(cmykArray[2]);
		$(cmyk[3]).val(cmykArray[3]);
	}
	function rgbToCmyk(rgbArray) {
		let red = Math.round(parseInt(rgbArray[0]) / 2.55);
		let green = Math.round(parseInt(rgbArray[1]) / 2.55);
		let blue = Math.round(parseInt(rgbArray[2]) / 2.55);

		let black = Math.round(100 - Math.max(red, green, blue));
		let cyan = Math.round((100 - red - black) / (100 - black) * 100);
		let magneta = Math.round((100 - green - black) / (100 - black) * 100);
		let yellow = Math.round((100 - blue - black) / (100 - black) * 100);		

		let cmykArray = [cyan, magneta, yellow, black];
		for(let i = 0; i < 3; i++) {
			if(cmykArray[i] !== cmykArray[i] || cmykArray[i] < 0) {
				cmykArray[i] = 0;
			}
		}
		return cmykArray;
	}
	function cmykToRgb(cmykArray) {
		let cyan = parseInt(cmykArray[0]);
		let magneta = parseInt(cmykArray[1]);
		let yellow = parseInt(cmykArray[2]);
		let black = parseInt(cmykArray[3]);

		let red = Math.round(2.55 * (100 - cyan) * (100 - black) / 100);
		let green = Math.round(2.55 * (100 - magneta) * (100 - black) / 100);
		let blue = Math.round(2.55 * (100 - yellow) * (100 - black) / 100);

		let rgbArray = [red, green, blue];
		return rgbArray;
	}
	function updateLab(rgbArray) {
		let red = parseInt(rgbArray[0]);
		let green = parseInt(rgbArray[1]);
		let blue = parseInt(rgbArray[2]);
	}
	function updatePaletteCell(rgbArray) {
		let red = parseInt(rgbArray[0]).toString(16);;
		let green = parseInt(rgbArray[1]).toString(16);;
		let blue = parseInt(rgbArray[2]).toString(16);;

		if(red.length < 2) {
			red = '0' + red;
		}
		if(green.length < 2) {
			green = '0' + green;
		}
		if(blue.length < 2) {
			blue = '0' + blue;
		}

		let hexValue = '#' + red + green + blue;
		$(currentCell).css('background-color', hexValue);
	}
	function generatePaletteKey() {
		let palette = $('#palette .color');
		let numCell = palette.length;

		let paletteKey = '';
		for(let i = 0; i < numCell; i++) {
			let thisCell = $(palette[i]); 
			let thisColorRgbArray = createRgbArrayFromCell(thisCell);
			let thisColor = rgbToHex(thisColorRgbArray);
			paletteKey = paletteKey + thisColor;
		}
		if(numCell < 16) {
			numCell = '0' + parseInt(numCell).toString(16);
		} else {			
			numCell = parseInt(numCell).toString(16);
		}

		paletteKey = numCell + paletteKey;
		return paletteKey;
	}
	function saveColor(cell) {
		updateColorPanel(cell);
		let paletteKey = generatePaletteKey();
		saveOpenedPalette(paletteKey);
	}
	function saveOpenedPalette(paletteKey) {
		let key = paletteKey;
		let data = {
			paletteKey: key
		};
		$.ajax({
				url: '/saveOpenedPalette',
				type: 'POST',
				dataType: 'json',
				data: data,
				error: (xmlHttp, status, errorThrown) => {
					console.log(xmlHttp);
				}
			}).done((data) => {
			if(data.error) {
				alert(data.error);
			} else {
				console.log(data.message);
			}
		})
	}
	function loadOpenedPalette(callback) {
		$.ajax({
				url: '/loadOpenedPalette',
				type: 'POST',
				dataType: 'json',
				data: {},
				error: (xmlHttp, status, errorThrown) => {
				}
			}).done((data) => {
			if(data.error) {
				alert(data.error);
			} else {
				console.log(data.message);
				createPaletteFromKey(data.paletteKey);
				callback();
			}
		})
	}
	function createPaletteFromKey(paletteKey) {
		let numCell = parseInt(paletteKey.slice(0, 2), 16);
		let palette = $('#palette .color');
		for(let i = 0; i < numCell; i++) {
			let start = 2 + i * 6;
			let end = 8 + i * 6;
			let color = paletteKey.slice(start, end);
			$(palette[i]).css('background-color', '#' + color);
		}
	}
});