const User = require('../models/User');

class AuthController {
  static showLogin(req, res) {
    res.render('login', { error: null });
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.render('login', { error: 'Email e senha são obrigatórios' });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.render('login', { error: 'Email ou senha inválidos' });
      }

      const isPasswordValid = await User.verifyPassword(senha, user.senha);

      if (!isPasswordValid) {
        return res.render('login', { error: 'Email ou senha inválidos' });
      }

      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userName = user.nome;

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      res.render('login', { error: 'Erro ao realizar login. Tente novamente.' });
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
      }
      res.redirect('/login');
    });
  }
}

module.exports = AuthController;