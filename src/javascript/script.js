const form = document.querySelector('#form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const errorIcon = '<i class="fa-solid fa-circle-exclamation"></i>';
  let isFormValid = true;

  // 1. Validação de campos de texto, data e senha
  const fields = [
    { id: 'name',             label: 'Nome',            validator: nameIsValid },
    { id: 'last_name',        label: 'Sobrenome',       validator: nameIsValid },
    { id: 'birthdate',        label: 'Nascimento',      validator: dateIsValid },
    { id: 'email',            label: 'E-mail',          validator: emailIsValid },
    { id: 'password',         label: 'Senha',           validator: passwordIsSecure },
    { id: 'confirm_password', label: 'Confirmar senha', validator: passwordMatch }
  ];

  fields.forEach(field => {
    const input      = document.getElementById(field.id);
    const container  = input.closest('.input-box');
    const errorSpan  = container.querySelector('.error');
    const { isValid, errorMessage } = field.validator(input.value.trim());

    // reset de estado
    container.classList.remove('valid', 'invalid');
    errorSpan.innerHTML = '';

    if (!isValid) {
      isFormValid = false;
      errorSpan.innerHTML = `${errorIcon} ${errorMessage}`;
      container.classList.add('invalid');
    } else {
      container.classList.add('valid');
    }
  });

  // 2. Validação de gênero (radio buttons)
  const genderRadios    = document.querySelectorAll('input[name="gender"]');
  const radioContainer  = document.querySelector('.radio-container');
  const genderErrorSpan = radioContainer.querySelector('.error');

  // reset de estado
  radioContainer.classList.remove('valid', 'invalid');
  genderErrorSpan.innerHTML = '';

  const anyChecked = [...genderRadios].some(radio => radio.checked);
  if (!anyChecked) {
    isFormValid = false;
    radioContainer.classList.add('invalid');
    genderErrorSpan.innerHTML = `${errorIcon} Selecione um gênero`;
  } else {
    radioContainer.classList.add('valid');
  }

  // 3. Se tudo estiver OK, submete o form
  if (isFormValid) {
    form.submit();
  }
});


// ——————————
// Funções de validação
// ——————————

function isEmpty(value) {
  return value === '';
}

function nameIsValid(value) {
  if (isEmpty(value)) {
    return { isValid: false, errorMessage: 'O campo é obrigatório!' };
  }
  if (value.length < 6) {
    return { isValid: false, errorMessage: 'O nome deve ter no mínimo 6 caracteres!' };
  }
  // apenas letras (inclui acentos)
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/;
  if (!regex.test(value)) {
    return { isValid: false, errorMessage: 'O campo deve conter apenas letras!' };
  }
  return { isValid: true, errorMessage: null };
}

function dateIsValid(value) {
  if (isEmpty(value)) {
    return { isValid: false, errorMessage: 'O nascimento é obrigatório!' };
  }
  const year = new Date(value).getFullYear();
  const thisYear = new Date().getFullYear();
  if (year < 1920 || year > thisYear) {
    return { isValid: false, errorMessage: 'Data inválida!' };
  }
  return { isValid: true, errorMessage: null };
}

function emailIsValid(value) {
  if (isEmpty(value)) {
    return { isValid: false, errorMessage: 'O e-mail é obrigatório!' };
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!regex.test(value)) {
    return { isValid: false, errorMessage: 'O e-mail precisa ser válido!' };
  }
  return { isValid: true, errorMessage: null };
}

function passwordIsSecure(value) {
  if (isEmpty(value)) {
    return { isValid: false, errorMessage: 'A senha é obrigatória!' };
  }
  // mínimo 8 caracteres, 1 maiuscula, 1 minuscula, 1 dígito e 1 especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/;
  if (!regex.test(value)) {
    return {
      isValid: false,
      errorMessage:
        'Sua senha deve conter ao menos 8 dígitos, 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial!'
    };
  }
  return { isValid: true, errorMessage: null };
}

function passwordMatch(confirmValue) {
  const passwordValue = document.getElementById('password').value;
  if (confirmValue !== passwordValue) {
    return { isValid: false, errorMessage: 'Senhas não condizem!' };
  }
  return { isValid: true, errorMessage: null };
}


// —————————————————
// Toggle visibilidade da senha
// —————————————————

document.querySelectorAll('.password-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.parentElement.querySelector('.form-control');
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.classList.toggle('fa-eye');
  });
});
