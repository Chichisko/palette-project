$(() => {
        const login = $('#login');
        const password = $('#password');
        const loginButton = $('#login_button');
        const registrationFormButton = $('#registration_form_button');

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
});