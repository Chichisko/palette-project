$(() => {
        const login = $("#login");
        const password = $("#password");
        const loginButton = $("#login_button");
        const registerFormButton = $("#register_form_button");
        let registerClose;

        registerFormButton.click(showRegisterForm);

        function showRegisterForm(argument) {
        	$("body").prepend(`
	        <div class="register_wrap">
				<div class="register">
					<div class="head">Быстрая регистрация<div class="register_close" id="register_close">&#10006;</div></div>
					<div class="form">
						<textarea class="input_text" id="name_reg" placeholder="Введите имя"></textarea>
						<textarea class="input_text" id="login_reg" placeholder="Введите логин"></textarea>
						<textarea class="input_text" id="mail_reg" placeholder="Введите почту"></textarea>
						<textarea class="input_text" id="password_reg" placeholder="Введите пароль"></textarea>
						<textarea class="input_text" id="password_repeate_reg" placeholder="Повторите пароль"></textarea>
						<button class="btn" id="register_button">Зарегистрироваться</button>
					</div>
				</div>
			</div>`);

        	registerClose = $('#register_close');
        	registerClose.click(() => {
        		$('.register_wrap').remove();
        	})
        }
});