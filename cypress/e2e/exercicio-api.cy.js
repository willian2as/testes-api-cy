/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
var faker = require('faker');

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nomeFaker = faker.name.firstName() + ' ' + faker.name.lastName()
          let emailFaker = faker.internet.email(nomeFaker)

          cy.cadastrarUsuario(nomeFaker, emailFaker, "senha", "false")
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Jose da Silva", "schwarzenegger@email.com.br", "senha", "false")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let posicao = Math.floor(Math.random() * 30)
          let emailFaker = faker.internet.email()

          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[posicao]._id
               let nome = response.body.usuarios[posicao].nome
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": nome,
                         "email": emailFaker,
                         "password": "editado",
                         "administrador": "true"
                    },
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          });
         
     });
     it('Deve deletar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.firstName() + ' ' + faker.name.lastName()
          let emailFaker = faker.internet.email(nomeFaker)
          
          cy.cadastrarUsuario(nomeFaker, emailFaker, "senha", "false")
          .then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
          })
     });
})