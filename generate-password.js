// Script para gerar hash de senha
// Execute com: node generate-password.js

const bcrypt = require('bcrypt');

const senha = process.argv[2] || 'senha123';

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  
  console.log('\n===================================');
  console.log('Hash gerado com sucesso!');
  console.log('===================================');
  console.log(`\nSenha: ${senha}`);
  console.log(`Hash: ${hash}`);
  console.log('\nUse este hash no seu script SQL:');
  console.log(`\nINSERT INTO usuarios (email, senha, nome) VALUES`);
  console.log(`('miguel@empresa.com.br', '${hash}', 'Miguel Empresário');`);
  console.log('\n===================================\n');
});