const loginText = {
  en: {
    title: "Login",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    button: "Login",
    noAccountText: "Don't have an account?",
    registerLink: "Register",
    successWelcome: (name) => `Welcome ${name}`,
    errorServer: "Error connecting to server",
  },

  ar: {
    title: "تسجيل الدخول",
    emailPlaceholder: "أدخل البريد الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    button: "تسجيل الدخول",
    noAccountText: "ليس لديك حساب؟",
    registerLink: "إنشاء حساب جديد",
    successWelcome: (name) => `مرحباً ${name}`,
    errorServer: "حدث خطأ في الاتصال بالخادم",
  },
};

export default loginText;
