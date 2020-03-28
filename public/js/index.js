$(() => {
	const login = $('#login');
	const password = $('#password');
	const loginButton = $('#login_button');
	const registrationFormButton = $('#registration_form_button');
	console.log()

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
			updateColorValuePanel(rgbArray);
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
			updateColorValuePanel(rgbArray);
		});
	}
	const hsv = $('#hsv').children('.color-value');
	const hsl = $('#hsl').children('.color-value');
	const hex = $('#hex').children('.color-value');
	for(let colorInput of hex) {		
		
		let rgbArray;
		$(colorInput).on('input', (event) => {
			let hexString = $(hex[0]).val();
			if($(hex[0]).val().slice(0,1) != '#'){
				hexString = '#' + hexString.slice(0,6);
			}
			let rValue = parseInt(hexString.slice(1,3), 16);
			let gValue = parseInt(hexString.slice(3,5), 16);
			let bValue = parseInt(hexString.slice(5,7), 16);
			rgbArray = [rValue, gValue, bValue];
			updatePaletteCell(rgbArray);
		});
		$(colorInput).on('change', (event) => {
			updateColorValuePanel(rgbArray);
		});
	}
	const lab = $('#lab').children('.color-value');
	let currentCell = $('.color-selected');
	updateColorValuePanel();

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
			  alert('Request error: ' + status); //very bad style
			 }
			   }).done((data) => {
			 if(data.error) {
			  registrationLogin.css('background-color', '#f003');
				showFormError('Логин уже используется');
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
		//check login for uniqueness
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
		updateColorValuePanel();
	}
	function updateColorValuePanel() {
		let currentColor = createRgbArrayFromCell(currentCell);
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
		let rValue = parseInt(rgbArray[0]).toString(16);
		let gValue = parseInt(rgbArray[1]).toString(16);
		let bValue = parseInt(rgbArray[2]).toString(16);

		if(rValue.length < 2) {
			rValue = '0' + rValue;
		}
		if(gValue.length < 2) {
			gValue = '0' + gValue;
		}
		if(bValue.length < 2) {
			bValue = '0' + bValue;
		}

		let hexValue = rValue + gValue + bValue;
		$(hex[0]).val('#' + hexValue);

	}
	function updateRgb(rgbArray) {
		let rValue = parseInt(rgbArray[0]);
		let gValue = parseInt(rgbArray[1]);
		let bValue = parseInt(rgbArray[2]);

		$(rgb[0]).val(rValue);
		$(rgb[1]).val(gValue);
		$(rgb[2]).val(bValue);
	}
	function updateHsv(rgbArray) {
		let rValue = parseInt(rgbArray[0]);
		let gValue = parseInt(rgbArray[1]);
		let bValue = parseInt(rgbArray[2]);
	}
	function updateHsl(rgbArray) {
		let rValue = parseInt(rgbArray[0]);
		let gValue = parseInt(rgbArray[1]);
		let bValue = parseInt(rgbArray[2]);
	}
	function updateCmyk(rgbArray) {
		cmykArray = rgbToCmyk(rgbArray);

		$(cmyk[0]).val(cmykArray[0]);
		$(cmyk[1]).val(cmykArray[1]);
		$(cmyk[2]).val(cmykArray[2]);
		$(cmyk[3]).val(cmykArray[3]);
	}
	function rgbToCmyk(rgbArray) {
		let rValue = Math.round(parseInt(rgbArray[0]) / 2.55);
		let gValue = Math.round(parseInt(rgbArray[1]) / 2.55);
		let bValue = Math.round(parseInt(rgbArray[2]) / 2.55);

		let blackValue = Math.round(100 - Math.max(rValue, gValue, bValue));
		let cValue = Math.round((100 - rValue - blackValue) / (100 - blackValue) * 100);
		let mValue = Math.round((100 - gValue - blackValue) / (100 - blackValue) * 100);
		let yValue = Math.round((100 - bValue - blackValue) / (100 - blackValue) * 100);		

		let cmykArray = [cValue, mValue, yValue, blackValue];
		for(let i = 0; i < 3; i++) {
			if(cmykArray[i] !== cmykArray[i] || cmykArray[i] < 0) {
				cmykArray[i] = 0;
			}
		}
		return cmykArray;
	}
	function cmykToRgb(cmykArray) {
		let cValue = parseInt(cmykArray[0]);
		let mValue = parseInt(cmykArray[1]);
		let yValue = parseInt(cmykArray[2]);
		let blackValue = parseInt(cmykArray[3]);

		let rValue = Math.round(2.55 * (100 - cValue) * (100 - blackValue) / 100);
		let gValue = Math.round(2.55 * (100 - mValue) * (100 - blackValue) / 100);
		let bValue = Math.round(2.55 * (100 - yValue) * (100 - blackValue) / 100);

		let rgbArray = [rValue, gValue, bValue];
		return rgbArray;
	}
	function updateLab(rgbArray) {
		let rValue = parseInt(rgbArray[0]);
		let gValue = parseInt(rgbArray[1]);
		let bValue = parseInt(rgbArray[2]);
	}
	function updatePaletteCell(rgbArray) {
		let rValue = parseInt(rgbArray[0]).toString(16);;
		let gValue = parseInt(rgbArray[1]).toString(16);;
		let bValue = parseInt(rgbArray[2]).toString(16);;

		if(rValue.length < 2) {
			rValue = '0' + rValue;
		}
		if(gValue.length < 2) {
			gValue = '0' + gValue;
		}
		if(bValue.length < 2) {
			bValue = '0' + bValue;
		}

		let hexValue = '#' + rValue + gValue + bValue;
		$(currentCell).css('background-color', hexValue);
	}
});